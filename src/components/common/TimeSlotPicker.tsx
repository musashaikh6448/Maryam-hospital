import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TimeSlot } from '@/data/mockData';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  className?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
  className,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Get next 14 days grouped by week
  const getDates = () => {
    const dates: { date: string; day: string; dayNum: number; isWeekend: boolean }[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    
    return dates;
  };

  const dates = getDates();
  const visibleDates = dates.slice(weekOffset * 7, (weekOffset + 1) * 7);

  const slotsForDate = selectedDate 
    ? slots.filter(s => s.date === selectedDate && s.status !== 'blocked')
    : [];

  const morningSlots = slotsForDate.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = slotsForDate.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    return hour >= 12;
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Date picker */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Select Date</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset(Math.min(1, weekOffset + 1))}
              disabled={weekOffset === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {visibleDates.map(({ date, day, dayNum, isWeekend }) => {
            const hasSlots = slots.some(s => s.date === date && s.status === 'available');
            const isSelected = date === selectedDate;
            
            return (
              <button
                key={date}
                onClick={() => !isWeekend && hasSlots && onDateSelect(date)}
                disabled={isWeekend || !hasSlots}
                className={cn(
                  "flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200",
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-accent",
                  (isWeekend || !hasSlots) && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                <span className="text-lg font-bold">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-4 animate-fade-in">
          {morningSlots.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Morning
              </h5>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {morningSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => slot.status === 'available' && onSlotSelect(slot)}
                    disabled={slot.status === 'full'}
                    className={cn(
                      "py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                      selectedSlot?.id === slot.id
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                        : slot.status === 'available'
                          ? "bg-muted hover:bg-accent hover:text-accent-foreground"
                          : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {slot.startTime}
                    {slot.status === 'full' && (
                      <span className="block text-xs text-destructive">Full</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Afternoon
              </h5>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {afternoonSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => slot.status === 'available' && onSlotSelect(slot)}
                    disabled={slot.status === 'full'}
                    className={cn(
                      "py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                      selectedSlot?.id === slot.id
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                        : slot.status === 'available'
                          ? "bg-muted hover:bg-accent hover:text-accent-foreground"
                          : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {slot.startTime}
                    {slot.status === 'full' && (
                      <span className="block text-xs text-destructive">Full</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {morningSlots.length === 0 && afternoonSlots.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No available slots for this date
            </p>
          )}
        </div>
      )}
    </div>
  );
};
