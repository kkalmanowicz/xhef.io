import React from "react";
import { Button } from "@/components/ui/button";

const stations = ["all", "grill", "saute", "sauces", "salads", "events", "other"];

const StationFilterTabs = ({ selectedStation, onSetSelectedStation }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {stations.map((station) => (
        <Button
          key={station}
          variant={selectedStation === station ? "default" : "outline"}
          onClick={() => onSetSelectedStation(station)}
          size="sm"
          className="capitalize transition-all duration-150 ease-in-out hover:shadow-md dark:hover:bg-gray-700"
        >
          {station}
        </Button>
      ))}
    </div>
  );
};

export default StationFilterTabs;