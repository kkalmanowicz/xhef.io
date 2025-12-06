import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, isSameDay } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Events() {
  const { supabase, session } = useSupabase();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    name: "",
    event_date: format(new Date(), "yyyy-MM-dd"),
    guest_count: "",
    notes: "",
  });

  const fetchEvents = useCallback(async () => {
    if (!supabase || !session?.user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching events",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, session, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setEventFormData(prev => ({ ...prev, event_date: format(date, "yyyy-MM-dd") }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEventFormData({
      name: "",
      event_date: format(selectedDate || new Date(), "yyyy-MM-dd"),
      guest_count: "",
      notes: "",
    });
    setEditingEvent(null);
  };

  const handleAddEventClick = () => {
    resetForm();
    setEventFormData(prev => ({ ...prev, event_date: format(selectedDate || new Date(), "yyyy-MM-dd") }));
    setIsModalOpen(true);
  };
  
  const handleEditEventClick = (event) => {
    setEditingEvent(event);
    setEventFormData({
      name: event.name,
      event_date: format(parseISO(event.event_date), "yyyy-MM-dd"),
      guest_count: event.guest_count.toString(),
      notes: event.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!supabase || !session?.user) return;

    const eventDataToSave = {
      ...eventFormData,
      guest_count: parseInt(eventFormData.guest_count, 10),
      user_id: session.user.id,
    };

    try {
      let error;
      if (editingEvent) {
        ({ error } = await supabase
          .from("events")
          .update(eventDataToSave)
          .eq("id", editingEvent.id)
          .eq("user_id", session.user.id));
      } else {
        ({ error } = await supabase.from("events").insert(eventDataToSave));
      }

      if (error) throw error;

      toast({
        title: `Event ${editingEvent ? "updated" : "added"} successfully!`,
      });
      fetchEvents();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${editingEvent ? "updating" : "adding"} event`,
        description: error.message,
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!supabase || !session?.user || !window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast({
        title: "Event deleted successfully!",
      });
      fetchEvents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting event",
        description: error.message,
      });
    }
  };
  
  const eventsOnSelectedDate = events.filter(event => 
    isSameDay(parseISO(event.event_date), selectedDate)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
        <Button onClick={handleAddEventClick} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2">
          <Calendar
            selected={selectedDate}
            onSelect={handleDateSelect}
            events={events}
            className="w-full shadow-xl border border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Events on {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          {isLoading && <p className="text-gray-500 dark:text-gray-400">Loading events...</p>}
          {!isLoading && eventsOnSelectedDate.length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No events scheduled for this day.</p>
            </div>
          )}
          {!isLoading && eventsOnSelectedDate.length > 0 && (
            <ul className="space-y-4">
              {eventsOnSelectedDate.map(event => (
                <li key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-lg text-primary dark:text-primary-400">{event.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Guests: {event.guest_count}</p>
                  {event.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Notes: {event.notes}</p>}
                  <div className="mt-3 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEventClick(event)} className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30">
                      <Edit className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)} className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/30">
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update the details for your event." : "Fill in the details for your new event."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input id="name" name="name" value={eventFormData.name} onChange={handleInputChange} className="col-span-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event_date" className="text-right text-gray-700 dark:text-gray-300">
                Date
              </Label>
              <Input id="event_date" name="event_date" type="date" value={eventFormData.event_date} onChange={handleInputChange} className="col-span-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guest_count" className="text-right text-gray-700 dark:text-gray-300">
                Guests
              </Label>
              <Input id="guest_count" name="guest_count" type="number" value={eventFormData.guest_count} onChange={handleInputChange} className="col-span-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" required min="0" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right text-gray-700 dark:text-gray-300">
                Notes
              </Label>
              <Input id="notes" name="notes" value={eventFormData.notes} onChange={handleInputChange} className="col-span-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                {editingEvent ? "Save Changes" : "Add Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Events;