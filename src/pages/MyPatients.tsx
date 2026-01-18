import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { doctors as allDoctors } from '@/data/mockData';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MyPatients: React.FC = () => {
  const { user } = useAuth();
  const { appointments } = useApp();

  const currentDoctor = allDoctors.find(d => d.userId === user?.id);
  
  // Get unique patients who have appointments with this doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor?.id);
  const uniquePatientIds = [...new Set(doctorAppointments.map(a => a.patientId))];
  
  const patients = uniquePatientIds.map(patientId => {
    const patientAppointments = doctorAppointments.filter(a => a.patientId === patientId);
    const lastAppointment = patientAppointments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    return {
      id: patientId,
      name: lastAppointment.patientName,
      appointmentCount: patientAppointments.length,
      lastVisit: lastAppointment.date,
      lastStatus: lastAppointment.status,
    };
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">My Patients</h1>
        <p className="text-muted-foreground mt-1">
          Patients who have appointments with you
        </p>
      </div>

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(patient => (
            <div
              key={patient.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {patient.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{patient.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {patient.appointmentCount} visits
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">No patients yet</h3>
          <p className="text-muted-foreground">
            Patients who book appointments with you will appear here
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyPatients;
