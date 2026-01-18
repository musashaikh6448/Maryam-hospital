import React from 'react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/data/mockData';
import { Clock, Calendar, User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
  showDoctor?: boolean;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onComplete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  showPatient = false,
  showDoctor = true,
  onCancel,
  onReschedule,
  onComplete,
  onViewDetails,
  className,
}) => {
  const getStatusBadge = (status: Appointment['status']) => {
    const styles = {
      scheduled: 'badge-status badge-scheduled',
      completed: 'badge-status badge-completed',
      cancelled: 'badge-status badge-cancelled',
      'no-show': 'badge-status badge-cancelled',
      'in-progress': 'badge-status badge-pending',
    };
    const labels = {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      'no-show': 'No Show',
      'in-progress': 'In Progress',
    };
    return <span className={styles[status]}>{labels[status]}</span>;
  };

  const getTypeBadge = (type: Appointment['type']) => {
    const styles = {
      consultation: 'bg-primary/10 text-primary',
      'follow-up': 'bg-secondary/10 text-secondary',
      emergency: 'bg-destructive/10 text-destructive',
      'walk-in': 'bg-warning/10 text-warning',
    };
    return (
      <span className={cn('badge-status', styles[type])}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={cn(
      "bg-card rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusBadge(appointment.status)}
          {getTypeBadge(appointment.type)}
        </div>
        {(onCancel || onReschedule || onComplete || onViewDetails) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(appointment.id)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onReschedule && appointment.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => onReschedule(appointment.id)}>
                  Reschedule
                </DropdownMenuItem>
              )}
              {onComplete && appointment.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => onComplete(appointment.id)}>
                  Mark Complete
                </DropdownMenuItem>
              )}
              {onCancel && appointment.status === 'scheduled' && (
                <DropdownMenuItem 
                  onClick={() => onCancel(appointment.id)}
                  className="text-destructive"
                >
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-2">
        {showDoctor && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{appointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">{appointment.department}</p>
            </div>
          </div>
        )}

        {showPatient && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="font-medium text-sm">{appointment.patientName}</p>
              <p className="text-xs text-muted-foreground">Patient</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{appointment.time}</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="text-sm text-muted-foreground pt-2 border-t border-border mt-2">
            {appointment.notes}
          </p>
        )}
      </div>
    </div>
  );
};
