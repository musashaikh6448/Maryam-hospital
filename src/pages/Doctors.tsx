import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DoctorCard } from '@/components/common/DoctorCard';
import { useApp } from '@/contexts/AppContext';
import { departments, Doctor } from '@/data/mockData';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TimeSlotPicker } from '@/components/common/TimeSlotPicker';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TimeSlot } from '@/data/mockData';

export const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, timeSlots, addAppointment, addNotification } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedSlot(null);
    setShowBookingModal(true);
  };

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const confirmBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !user) return;

    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const appointment = addAppointment({
      patientId: user.id,
      patientName: user.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      status: 'scheduled',
      type: 'consultation',
      createdBy: user.id,
    });

    addNotification({
      userId: user.id,
      title: 'Appointment Booked',
      message: `Your appointment with ${selectedDoctor.name} on ${selectedSlot.date} at ${selectedSlot.startTime} has been confirmed.`,
      type: 'success',
      read: false,
    });

    toast.success('Appointment booked successfully!');
    setShowBookingModal(false);
    setIsBooking(false);
    navigate('/appointments');
  };

  const doctorSlots = selectedDoctor 
    ? timeSlots.filter(s => s.doctorId === selectedDoctor.id)
    : [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Find a Doctor</h1>
        <p className="text-muted-foreground mt-1">Browse our specialists and book appointments</p>
      </div>

      {/* Search and filters */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedDepartment === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDepartment(null)}
            >
              All
            </Button>
            {departments.slice(0, 5).map(dept => (
              <Button
                key={dept.id}
                variant={selectedDepartment === dept.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDepartment(dept.name)}
              >
                {dept.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {selectedDoctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedDoctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.specialization}</p>
                  <p className="text-sm text-primary font-medium">${selectedDoctor.consultationFee} consultation</p>
                </div>
              </div>

              <TimeSlotPicker
                slots={doctorSlots}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={setSelectedDate}
                onSlotSelect={setSelectedSlot}
              />

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 btn-primary"
                  disabled={!selectedSlot || isBooking}
                  onClick={confirmBooking}
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Doctors;
