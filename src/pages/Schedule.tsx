import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { doctors as allDoctors } from '@/data/mockData';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const Schedule: React.FC = () => {
  const { user } = useAuth();
  const { appointments, updateAppointment, cancelAppointment } = useApp();

  const currentDoctor = allDoctors.find(d => d.userId === user?.id);
  
  const doctorAppointments = appointments
    .filter(a => a.doctorId === currentDoctor?.id)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = doctorAppointments.filter(a => a.date === today);
  const upcomingAppointments = doctorAppointments.filter(a => a.date > today && a.status === 'scheduled');

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    toast.success('Appointment marked as complete');
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    toast.success('Appointment cancelled');
  };

  const handleNoShow = (id: string) => {
    updateAppointment(id, { status: 'no-show' });
    toast.success('Marked as no-show');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">My Schedule</h1>
        <p className="text-muted-foreground mt-1">View and manage your appointments</p>
      </div>

      <div className="space-y-8">
        {/* Today's appointments */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Today's Appointments
            <span className="text-sm font-normal text-muted-foreground">({todayAppointments.length})</span>
          </h2>

          {todayAppointments.length > 0 ? (
            <div className="grid gap-4">
              {todayAppointments.map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDoctor={false}
                  showPatient={true}
                  onComplete={apt.status === 'scheduled' ? handleComplete : undefined}
                  onCancel={apt.status === 'scheduled' ? handleCancel : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">No appointments today</h3>
              <p className="text-sm text-muted-foreground">
                Your schedule is clear for today
              </p>
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">
            Upcoming Appointments
            <span className="text-sm font-normal text-muted-foreground ml-2">({upcomingAppointments.length})</span>
          </h2>

          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4">
              {upcomingAppointments.slice(0, 10).map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDoctor={false}
                  showPatient={true}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">No upcoming appointments</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any scheduled appointments
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
