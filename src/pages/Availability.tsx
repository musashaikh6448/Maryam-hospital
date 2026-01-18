import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { doctors as allDoctors, TimeSlot } from '@/data/mockData';
import { Calendar, Clock, Plus, Trash2, Edit, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Availability: React.FC = () => {
  const { user } = useAuth();
  const { timeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot, appointments } = useApp();
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // Form state
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [capacity, setCapacity] = useState('2');

  // Get doctor ID for current user
  const currentDoctor = allDoctors.find(d => d.userId === user?.id);
  
  const doctorSlots = timeSlots.filter(s => s.doctorId === currentDoctor?.id);
  
  const slotsForSelectedDate = doctorSlots.filter(s => s.date === selectedDate);

  // Get booked patients for a slot
  const getBookedPatients = (slot: TimeSlot) => {
    return appointments.filter(
      a => a.doctorId === slot.doctorId && 
           a.date === slot.date && 
           a.time === slot.startTime &&
           a.status !== 'cancelled'
    );
  };

  // Generate next 14 days
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    return dates;
  };

  const dates = getDates();

  const handleAddSlot = () => {
    if (!currentDoctor) return;

    const newSlot = addTimeSlot({
      doctorId: currentDoctor.id,
      date: slotDate || selectedDate,
      startTime,
      endTime,
      capacity: parseInt(capacity),
      bookedCount: 0,
      status: 'available',
    });

    toast.success('Time slot added successfully');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSlot = () => {
    if (!editingSlot) return;

    updateTimeSlot(editingSlot.id, {
      startTime,
      endTime,
      capacity: parseInt(capacity),
      status: parseInt(capacity) <= editingSlot.bookedCount ? 'full' : 'available',
    });

    toast.success('Time slot updated successfully');
    setEditingSlot(null);
    resetForm();
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteTimeSlot(slotId);
    toast.success('Time slot deleted');
  };

  const handleBlockSlot = (slot: TimeSlot) => {
    updateTimeSlot(slot.id, { status: slot.status === 'blocked' ? 'available' : 'blocked' });
    toast.success(slot.status === 'blocked' ? 'Slot unblocked' : 'Slot blocked');
  };

  const resetForm = () => {
    setSlotDate('');
    setStartTime('09:00');
    setEndTime('09:30');
    setCapacity('2');
  };

  const openEditModal = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setCapacity(slot.capacity.toString());
  };

  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00',
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground mt-1">Manage your available time slots</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Time Slot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={slotDate || selectedDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Capacity (max patients)</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddSlot}>
                  Add Slot
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date selector */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {dates.map(({ date, day, dayNum, month, isWeekend }) => {
            const slotsCount = doctorSlots.filter(s => s.date === date).length;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center py-3 px-4 rounded-xl transition-all min-w-[70px]",
                  selectedDate === date
                    ? "bg-primary text-primary-foreground"
                    : isWeekend
                      ? "bg-muted/50 text-muted-foreground"
                      : "bg-muted hover:bg-accent"
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                <span className="text-lg font-bold">{dayNum}</span>
                <span className="text-xs">{month}</span>
                {slotsCount > 0 && (
                  <span className={cn(
                    "text-xs mt-1 px-1.5 py-0.5 rounded-full",
                    selectedDate === date ? "bg-white/20" : "bg-primary/10 text-primary"
                  )}>
                    {slotsCount} slots
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots for selected date */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">
          Slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>

        {slotsForSelectedDate.length > 0 ? (
          <div className="grid gap-4">
            {slotsForSelectedDate
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(slot => {
                const bookedPatients = getBookedPatients(slot);
                return (
                  <div
                    key={slot.id}
                    className={cn(
                      "bg-card rounded-xl border p-4 transition-all",
                      slot.status === 'blocked' 
                        ? "border-destructive/30 bg-destructive/5" 
                        : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          slot.status === 'blocked' 
                            ? "bg-destructive/10 text-destructive"
                            : slot.status === 'full'
                              ? "bg-warning/10 text-warning"
                              : "bg-primary/10 text-primary"
                        )}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "badge-status",
                              slot.status === 'available' && "badge-completed",
                              slot.status === 'full' && "badge-pending",
                              slot.status === 'blocked' && "badge-cancelled"
                            )}>
                              {slot.status === 'available' && 'Available'}
                              {slot.status === 'full' && 'Full'}
                              {slot.status === 'blocked' && 'Blocked'}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {slot.bookedCount}/{slot.capacity} booked
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockSlot(slot)}
                        >
                          {slot.status === 'blocked' ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(slot)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Booked patients */}
                    {bookedPatients.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Booked Patients:</p>
                        <div className="space-y-2">
                          {bookedPatients.map(apt => (
                            <div key={apt.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {apt.patientName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{apt.patientName}</p>
                                <p className="text-xs text-muted-foreground capitalize">{apt.type}</p>
                              </div>
                              <span className={cn(
                                "badge-status ml-auto",
                                apt.status === 'scheduled' && "badge-scheduled",
                                apt.status === 'completed' && "badge-completed",
                                apt.status === 'in-progress' && "badge-pending"
                              )}>
                                {apt.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No time slots</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any availability for this date.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Capacity</Label>
              <Select value={capacity} onValueChange={setCapacity}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setEditingSlot(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleEditSlot}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Availability;
