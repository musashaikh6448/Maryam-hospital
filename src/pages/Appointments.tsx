import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type FilterType = 'all' | 'upcoming' | 'past';

export const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, cancelAppointment, addNotification } = useApp();
  const [filter, setFilter] = useState<FilterType>('upcoming');

  const today = new Date().toISOString().split('T')[0];
  
  const patientAppointments = appointments
    .filter(a => a.patientId === user?.id)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

  const filteredAppointments = patientAppointments.filter(apt => {
    if (filter === 'upcoming') {
      return apt.date >= today && apt.status !== 'cancelled' && apt.status !== 'completed';
    }
    if (filter === 'past') {
      return apt.date < today || apt.status === 'completed' || apt.status === 'cancelled';
    }
    return true;
  });

  const handleCancel = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt && user) {
      cancelAppointment(id);
      addNotification({
        userId: user.id,
        title: 'Appointment Cancelled',
        message: `Your appointment with ${apt.doctorName} has been cancelled.`,
        type: 'warning',
        read: false,
      });
      toast.success('Appointment cancelled successfully');
    }
  };

  const handleReschedule = (id: string) => {
    toast.info('Reschedule feature coming soon');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">My Appointments</h1>
        <p className="text-muted-foreground mt-1">View and manage your appointments</p>
      </div>

      {/* Filter tabs */}
      <div className="bg-card rounded-xl border border-border p-1 inline-flex mb-6">
        {(['upcoming', 'past', 'all'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
              filter === f 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map(apt => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={apt.status === 'scheduled' ? handleCancel : undefined}
              onReschedule={apt.status === 'scheduled' ? handleReschedule : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            No {filter === 'all' ? '' : filter} appointments
          </h3>
          <p className="text-muted-foreground mb-6">
            {filter === 'upcoming' 
              ? "You don't have any upcoming appointments scheduled."
              : filter === 'past'
                ? "You don't have any past appointments."
                : "You don't have any appointments yet."
            }
          </p>
          {filter !== 'past' && (
            <Button onClick={() => window.location.href = '/doctors'}>
              Find a Doctor
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Appointments;
