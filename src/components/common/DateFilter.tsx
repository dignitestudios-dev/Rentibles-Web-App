"use client";
import React from "react";
import { FaFilter } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { InputField } from "./InputField";
import { Label } from "@/components/ui/label";
import { Funnel } from "lucide-react";

type DateFilterValue = {
  startDate: string;
  endDate: string;
};

type DateFilterProps = {
  onFilterChange?: (value: DateFilterValue) => void;
};

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onFilterChange?.({
      startDate,
      endDate,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");

    if (onFilterChange) {
      onFilterChange({
        startDate: "",
        endDate: "",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={""}>
          <Funnel className=" text-white " />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex gap-5 justify-between items-center border-b border-b-gray-200 pb-3 ">
          <p className="text-xl font-semibold">Filter</p>
          <PopoverClose asChild>
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <RxCross2 className="h-5 w-5" />
            </button>
          </PopoverClose>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex flex-col gap-1">
            <Label className={"text-base"}>Start Date</Label>
            <InputField
              placeholder="Select Date"
              type={"date"}
              className={"w-40 h-14"}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className={"text-base"}>End Date</Label>
            <InputField
              placeholder="Select Date"
              type={"date"}
              className={"w-40 h-14"}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button
            className={"h-14!"}
            variant={"secondary"}
            type="button"
            onClick={handleClear}
          >
            Clear
          </Button>

          <Button className={"h-14!"} type="submit">
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
