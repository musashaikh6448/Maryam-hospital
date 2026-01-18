import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  Appointment, 
  TimeSlot, 
  Notification, 
  Doctor,
  appointments as initialAppointments, 
  timeSlots as initialTimeSlots,
  notifications as initialNotifications,
  doctors as initialDoctors,
} from '@/data/mockData';

interface AppContextType {
  appointments: Appointment[];
  timeSlots: TimeSlot[];
  notifications: Notification[];
  doctors: Doctor[];
  
  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  
  // Time slot actions
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => TimeSlot;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  
  // Doctor actions
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);

  // Appointment actions
  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    
    // Update time slot booked count
    const slot = timeSlots.find(
      s => s.doctorId === appointment.doctorId && 
           s.date === appointment.date && 
           s.startTime === appointment.time
    );
    if (slot) {
      updateTimeSlot(slot.id, { 
        bookedCount: slot.bookedCount + 1,
        status: slot.bookedCount + 1 >= slot.capacity ? 'full' : 'available'
      });
    }
    
    return newAppointment;
  }, [timeSlots]);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    );
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      updateAppointment(id, { status: 'cancelled' });
      
      // Update time slot booked count
      const slot = timeSlots.find(
        s => s.doctorId === appointment.doctorId && 
             s.date === appointment.date && 
             s.startTime === appointment.time
      );
      if (slot && slot.bookedCount > 0) {
        updateTimeSlot(slot.id, { 
          bookedCount: slot.bookedCount - 1,
          status: 'available'
        });
      }
    }
  }, [appointments, timeSlots]);

  // Time slot actions
  const addTimeSlot = useCallback((slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: `slot-${Date.now()}`,
    };
    setTimeSlots(prev => [...prev, newSlot]);
    return newSlot;
  }, []);

  const updateTimeSlot = useCallback((id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(prev => 
      prev.map(slot => slot.id === id ? { ...slot, ...updates } : slot)
    );
  }, []);

  const deleteTimeSlot = useCallback((id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  }, []);

  // Notification actions
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications(prev => 
      prev.map(n => n.userId === userId ? { ...n, read: true } : n)
    );
  }, []);

  // Doctor actions
  const updateDoctor = useCallback((id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => 
      prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
    );
  }, []);

  return (
    <AppContext.Provider value={{
      appointments,
      timeSlots,
      notifications,
      doctors,
      addAppointment,
      updateAppointment,
      cancelAppointment,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      updateDoctor,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
