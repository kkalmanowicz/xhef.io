import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metricUnits = ["kg", "g", "l", "ml", "units", "pieces"];
const imperialUnits = ["lb", "oz", "gal", "qt", "fl_oz"];

function UnitSelector({ value, onValueChange, className }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select unit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" disabled>
          Metric Units
        </SelectItem>
        {metricUnits.map((unit) => (
          <SelectItem key={unit} value={unit}>
            {unit}
          </SelectItem>
        ))}
        <SelectItem value="none" disabled>
          Imperial Units
        </SelectItem>
        {imperialUnits.map((unit) => (
          <SelectItem key={unit} value={unit}>
            {unit.replace('_', ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default UnitSelector;