import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  events = [],
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(selected ? startOfMonth(selected) : startOfMonth(new Date()));

  const days = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const eventDates = React.useMemo(() => 
    events.map(event => format(parseISO(event.event_date), 'yyyy-MM-dd')), 
  [events]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (day) => {
    if (onSelect) {
      onSelect(day);
    }
  };

  return (
    <div className={cn("p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg", className)} {...props}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-px border-l border-t border-gray-200 dark:border-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div
            key={dayName}
            className={cn(
              "py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-b border-gray-200 dark:border-gray-700",
              classNames?.head_cell
            )}
          >
            {dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px border-l border-gray-200 dark:border-gray-700">
        {days.map(day => {
          const isOutside = !isSameMonth(day, currentMonth);
          const isSelectedDay = selected && isSameDay(day, selected);
          const isCurrentToday = isToday(day);
          const hasEvent = eventDates.includes(format(day, 'yyyy-MM-dd'));

          if (isOutside && !showOutsideDays) {
            return <div key={day.toString()} className="border-r border-b border-gray-200 dark:border-gray-700 h-14" />;
          }

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative p-1.5 text-center text-sm border-r border-b border-gray-200 dark:border-gray-700 h-14 flex flex-col items-center justify-center",
                isOutside ? "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50",
                isSelectedDay && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 font-semibold",
                isCurrentToday && !isSelectedDay && "bg-accent dark:bg-accent/50 text-accent-foreground",
                "transition-colors duration-150 cursor-pointer",
                classNames?.cell
              )}
              onClick={() => handleDayClick(day)}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>
                {format(day, 'd')}
              </time>
              {hasEvent && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };