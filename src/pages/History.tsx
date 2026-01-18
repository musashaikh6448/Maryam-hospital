import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { Calendar } from 'lucide-react';

export const History: React.FC = () => {
  const { user } = useAuth();
  const { appointments } = useApp();

  const today = new Date().toISOString().split('T')[0];
  
  const pastAppointments = appointments
    .filter(a => a.patientId === user?.id && (a.date < today || a.status === 'completed' || a.status === 'cancelled'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Appointment History</h1>
        <p className="text-muted-foreground mt-1">View your past appointments</p>
      </div>

      {pastAppointments.length > 0 ? (
        <div className="grid gap-4">
          {pastAppointments.map(apt => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">No appointment history</h3>
          <p className="text-muted-foreground">
            Your past appointments will appear here
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default History;
