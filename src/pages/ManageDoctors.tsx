import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { DoctorCard } from '@/components/common/DoctorCard';
import { toast } from 'sonner';

export const ManageDoctors: React.FC = () => {
  const { doctors } = useApp();

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Manage Doctors</h1>
        <p className="text-muted-foreground mt-1">View and manage doctor profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onViewProfile={handleEdit}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageDoctors;
