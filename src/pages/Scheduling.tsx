import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { users, doctors as allDoctors, TimeSlot } from '@/data/mockData';
import { Search, Calendar, User, Plus, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSlotPicker } from '@/components/common/TimeSlotPicker';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const Scheduling: React.FC = () => {
  const { user } = useAuth();
  const { doctors, timeSlots, appointments, addAppointment, addNotification, updateAppointment, cancelAppointment } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof users[0] | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof allDoctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up' | 'walk-in'>('consultation');
  const [notes, setNotes] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const patients = users.filter(u => u.role === 'patient');
  
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery)
  );

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);

  const handleSelectPatient = (patient: typeof users[0]) => {
    setSelectedPatient(patient);
    setShowBookingModal(true);
  };

  const handleBookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedSlot || !user) return;

    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const appointment = addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      status: 'scheduled',
      type: appointmentType,
      notes: notes || undefined,
      createdBy: user.id,
    });

    addNotification({
      userId: selectedPatient.id,
      title: 'Appointment Scheduled',
      message: `Your appointment with ${selectedDoctor.name} on ${selectedSlot.date} at ${selectedSlot.startTime} has been scheduled.`,
      type: 'success',
      read: false,
    });

    toast.success('Appointment scheduled successfully!');
    setShowBookingModal(false);
    resetForm();
    setIsBooking(false);
  };

  const handleWalkIn = () => {
    setAppointmentType('walk-in');
    setShowBookingModal(true);
  };

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    toast.success('Appointment marked as complete');
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    toast.success('Appointment cancelled');
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAppointmentType('consultation');
    setNotes('');
    setSearchQuery('');
  };

  const doctorSlots = selectedDoctor 
    ? timeSlots.filter(s => s.doctorId === selectedDoctor.id)
    : [];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Central Scheduling</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage appointments for patients</p>
        </div>
        <Button className="btn-primary" onClick={handleWalkIn}>
          <Plus className="w-4 h-4 mr-2" />
          Walk-in Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient search */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-heading font-semibold mb-4">Search Patient</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    selectedPatient?.id === patient.id
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-muted border border-transparent"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="font-medium text-secondary">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                  </div>
                </button>
              ))}

              {filteredPatients.length === 0 && searchQuery && (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  No patients found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Today's Appointments</h2>
            <span className="text-sm text-muted-foreground">{todayAppointments.length} total</span>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(apt => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    showPatient={true}
                    showDoctor={true}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                  />
                ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No appointments today</h3>
              <p className="text-muted-foreground">
                Search for a patient to schedule an appointment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {appointmentType === 'walk-in' ? 'Walk-in Appointment' : 'Schedule Appointment'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Patient info */}
            {selectedPatient && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedPatient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                </div>
              </div>
            )}

            {!selectedPatient && (
              <div>
                <Label>Select Patient</Label>
                <Select onValueChange={(id) => setSelectedPatient(patients.find(p => p.id === id) || null)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Appointment type */}
            <div>
              <Label>Appointment Type</Label>
              <Select value={appointmentType} onValueChange={(v: any) => setAppointmentType(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor selection */}
            <div>
              <Label>Select Doctor</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {doctors.map(doctor => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSelectedDate(null);
                      setSelectedSlot(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                      selectedDoctor?.id === doctor.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-sm">
                        {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{doctor.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot picker */}
            {selectedDoctor && (
              <TimeSlotPicker
                slots={doctorSlots}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={setSelectedDate}
                onSlotSelect={setSelectedSlot}
              />
            )}

            {/* Notes */}
            <div>
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowBookingModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 btn-primary"
                disabled={!selectedPatient || !selectedDoctor || !selectedSlot || isBooking}
                onClick={handleBookAppointment}
              >
                {isBooking ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Scheduling;
