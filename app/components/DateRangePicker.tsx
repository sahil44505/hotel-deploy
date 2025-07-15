import { useEffect, useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import { eachDayOfInterval, format, isSameDay } from "date-fns";

interface DateRangePickerProps {
  onDateChange: (range: Range) => void;
  disabledDates?: Date[];
}



const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange, disabledDates }) => {
  
  

  console.log("Disabled dates array:", disabledDates);

  const today = new Date(); // Get today's date
  const [isOpen, setIsOpen] = useState(false);

  const [dateRange, setDateRange] = useState<Range>({
    startDate: today,
    endDate: today,
    key: "selection",
  });
  const [disabledDatesState, setDisabledDatesState] = useState<Date[]>([]);

  // If disabledDates prop changes, update the local state.
  useEffect(() => {
    if (disabledDates) {
      setDisabledDatesState(disabledDates);
    }
  }, [disabledDates]);


  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (disabledDates) {
      const selectionDays = eachDayOfInterval({
        start: selection.startDate!,
        end: selection.endDate!,
      });
      const hasDisabled = selectionDays.some(day =>
        disabledDates.some(disabledDate => isSameDay(disabledDate, day))
      );
      if (hasDisabled) {
        confirm("You have already Booked that dates")
        // Instead of alerting, simply do not update the selection.
        return;
      }
    }
    setDateRange(selection);
    onDateChange(selection);
    setIsOpen(false);
  };
  const calendarKey = disabledDatesState.length; 

  // Cast DateRange to any to bypass type issues with renderDayContents
  const DateRangeAny = DateRange as any;
  return (
    <div className="relative w-full "> {/* Increased max-width for a wider layout */}
      {/* Clickable Input Fields */}
      <div className="flex flex-wrap gap-4 p-2 rounded-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="border p-3 rounded-md shadow-md w-[17vw]"><p className="text-sm text-gray-500">Check In</p><p className="font-medium">{format(dateRange.startDate!, "EEE, d MMM")}</p></div>
        <div className="border p-3 rounded-md shadow-md w-[17vw]"><p className="text-sm text-gray-500">Check Out</p><p className="font-medium">{format(dateRange.endDate!, "EEE, d MMM")}</p></div>
      </div>

      {/* Show Calendar Only When isOpen is True */}
      {isOpen && (
  <div className="absolute z-50 bg-white shadow-lg p-4 border rounded-md w-[650px]">
    <DateRangeAny
      ranges={[dateRange]}
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
      months={2}
      direction="horizontal"
      showDateDisplay={false}
      minDate={today}
       renderDayContents={(date: Date) => {
        // Normalize the date comparison by formatting both dates
        const formattedDate = format(date, "yyyy-MM-dd");
        if (
          disabledDatesState.some(
            disabledDate => format(disabledDate, "yyyy-MM-dd") === formattedDate
          )
        ) {
          return (
            <span className=".disabled-day">
              {format(date, "d")}
            </span>
          );
        }
        return format(date, "d");
      }}
      
    />
  </div>
)}
    </div>
  );
};

export default DateRangePicker;
