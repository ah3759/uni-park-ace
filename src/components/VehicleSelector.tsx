import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMakes, getModels, getYears } from "@/data/vehicleData";

interface VehicleSelectorProps {
  make: string;
  model: string;
  year: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  makeError?: string;
  modelError?: string;
  yearError?: string;
}

const VehicleSelector = ({
  make, model, year,
  onMakeChange, onModelChange, onYearChange,
  makeError, modelError, yearError,
}: VehicleSelectorProps) => {
  const makes = getMakes();
  const models = make ? getModels(make) : [];
  const years = make && model ? getYears(make, model) : [];

  const handleMakeChange = (val: string) => {
    onMakeChange(val);
    onModelChange("");
    onYearChange("");
  };

  const handleModelChange = (val: string) => {
    onModelChange(val);
    onYearChange("");
  };

  return (
    <>
      <div className="space-y-1.5">
        <Label>Make *</Label>
        <Select value={make} onValueChange={handleMakeChange}>
          <SelectTrigger className={makeError ? "border-destructive" : ""}>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {makes.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {makeError && <p className="text-sm text-destructive">{makeError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Model *</Label>
        <Select value={model} onValueChange={handleModelChange} disabled={!make}>
          <SelectTrigger className={modelError ? "border-destructive" : ""}>
            <SelectValue placeholder={make ? "Select model" : "Select make first"} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {models.map((m) => (
              <SelectItem key={m.name} value={m.name}>
                {m.name}
                {m.endYear && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    ({m.startYear}–{m.endYear})
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modelError && <p className="text-sm text-destructive">{modelError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Year *</Label>
        <Select value={year} onValueChange={onYearChange} disabled={!model}>
          <SelectTrigger className={yearError ? "border-destructive" : ""}>
            <SelectValue placeholder={model ? "Select year" : "Select model first"} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {yearError && <p className="text-sm text-destructive">{yearError}</p>}
      </div>
    </>
  );
};

export default VehicleSelector;
