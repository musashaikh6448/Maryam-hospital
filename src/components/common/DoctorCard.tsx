import React from 'react';
import { cn } from '@/lib/utils';
import { Doctor } from '@/data/mockData';
import { Star, Clock, DollarSign, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
  className?: string;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  onViewProfile,
  className,
}) => {
  return (
    <div className={cn(
      "bg-card rounded-xl border border-border p-6 transition-all duration-200 hover:shadow-elevated group",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary">
            {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {doctor.name}
          </h3>
          <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
          <p className="text-sm text-muted-foreground">{doctor.department}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-medium">{doctor.rating}</span>
          <span className="text-sm text-muted-foreground">({doctor.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Award className="w-4 h-4" />
          <span className="text-sm">{doctor.experience} yrs exp</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">${doctor.consultationFee}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {doctor.bio}
      </p>

      <div className="mt-4 flex gap-2">
        {onViewProfile && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewProfile(doctor)}
          >
            View Profile
          </Button>
        )}
        {onBookAppointment && (
          <Button 
            className="flex-1 btn-primary"
            onClick={() => onBookAppointment(doctor)}
          >
            Book Appointment
          </Button>
        )}
      </div>
    </div>
  );
};
