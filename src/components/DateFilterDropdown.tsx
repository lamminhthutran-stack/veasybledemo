import { useState, useRef, useEffect } from "react";
import { ChevronDown, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export type FilterMode = "all" | "month" | "date";

export interface DateFilterState {
  mode: FilterMode;
  month?: number; // 0-11
  year?: number;
  startDate?: Date;
  endDate?: Date;
}

interface Props {
  value: DateFilterState;
  onChange: (state: DateFilterState) => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DateFilterDropdown({ value, onChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FilterMode>(value.mode);
  
  // Month Mode State
  const [viewYear, setViewYear] = useState(value.year || new Date().getFullYear());
  
  // Date Mode State
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [tempStart, setTempStart] = useState<Date | undefined>(value.startDate);
  const [tempEnd, setTempEnd] = useState<Date | undefined>(value.endDate);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleModeSwitch = (m: FilterMode) => {
    setMode(m);
    if (m === "all") {
      onChange({ mode: "all" });
      setIsOpen(false);
    }
  };

  const selectMonth = (mIdx: number) => {
    onChange({ mode: "month", month: mIdx, year: viewYear });
    setIsOpen(false);
  };

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(calYear, calMonth, day);
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(clickedDate);
      setTempEnd(undefined);
    } else {
      if (clickedDate < tempStart) {
        setTempStart(clickedDate);
        setTempEnd(tempStart);
        onChange({ mode: "date", startDate: clickedDate, endDate: tempStart });
      } else {
        setTempEnd(clickedDate);
        onChange({ mode: "date", startDate: tempStart, endDate: clickedDate });
      }
      setIsOpen(false);
    }
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(calMonth, calYear);
    const firstDay = getFirstDayOfMonth(calMonth, calYear);
    const cells = [];
    
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let d = 1; d <= days; d++) {
      const current = new Date(calYear, calMonth, d);
      const isStart = tempStart && current.getTime() === tempStart.getTime();
      const isEnd = tempEnd && current.getTime() === tempEnd.getTime();
      const inRange = tempStart && tempEnd && current > tempStart && current < tempEnd;
      
      let bg = "hover:bg-gray-100";
      let text = "text-gray-700";
      let rounded = "rounded-full";

      if (isStart || isEnd) {
        bg = "bg-blue-600";
        text = "text-white font-bold";
        if (isStart && tempEnd) rounded = "rounded-l-full rounded-r-none";
        if (isEnd && tempStart) rounded = "rounded-r-full rounded-l-none";
      } else if (inRange) {
        bg = "bg-blue-100";
        rounded = "rounded-none";
      }

      cells.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`w-8 h-8 flex items-center justify-center text-xs transition-colors ${bg} ${text} ${rounded}`}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-[5px] bg-white hover:bg-gray-50"
      >
        <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
        Filter Date
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-[5px] shadow-lg z-50 overflow-hidden">
          {/* Modes */}
          <div className="flex bg-gray-50 p-1 border-b border-gray-100">
            {[
              { id: "all", label: "All Time" },
              { id: "month", label: "By Month" },
              { id: "date", label: "By Date" }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleModeSwitch(m.id as FilterMode)}
                className={`flex-1 text-xs py-1.5 font-medium rounded-[3px] transition-colors ${mode === m.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {mode === "all" && (
              <div className="text-center text-sm text-gray-500 py-4">
                Showing all time.
              </div>
            )}

            {mode === "month" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setViewYear(y => y - 1)} className="p-1 hover:bg-gray-100 rounded-[5px]"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-semibold text-sm">{viewYear}</span>
                  <button onClick={() => setViewYear(y => y + 1)} className="p-1 hover:bg-gray-100 rounded-[5px]"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => selectMonth(i)}
                      className={`py-2 text-xs font-medium rounded-[5px] border ${value.mode === "month" && value.month === i && value.year === viewYear ? "border-blue-500 bg-blue-50 text-blue-700" : "border-transparent hover:bg-gray-50"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "date" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => {
                    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                    else { setCalMonth(m => m - 1); }
                  }} className="p-1 hover:bg-gray-100 rounded-[5px]"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-semibold text-sm">{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => {
                    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                    else { setCalMonth(m => m + 1); }
                  }} className="p-1 hover:bg-gray-100 rounded-[5px]"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-7 gap-y-2 mb-2 text-center text-[10px] font-semibold text-gray-400 uppercase">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {renderCalendar()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
