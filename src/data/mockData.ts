// Types
export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  specialization?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  experience: number;
  education: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'full' | 'blocked';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'in-progress';
  type: 'consultation' | 'follow-up' | 'emergency' | 'walk-in';
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Mock Data
export const departments: Department[] = [
  { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system', icon: 'Heart' },
  { id: '2', name: 'Neurology', description: 'Brain and nervous system', icon: 'Brain' },
  { id: '3', name: 'Orthopedics', description: 'Bones, joints, and muscles', icon: 'Bone' },
  { id: '4', name: 'Pediatrics', description: 'Children\'s health', icon: 'Baby' },
  { id: '5', name: 'Dermatology', description: 'Skin conditions', icon: 'Fingerprint' },
  { id: '6', name: 'General Medicine', description: 'Primary care', icon: 'Stethoscope' },
  { id: '7', name: 'Ophthalmology', description: 'Eye care', icon: 'Eye' },
  { id: '8', name: 'Dentistry', description: 'Dental care', icon: 'Smile' },
];

export const users: User[] = [
  {
    id: 'u1',
    email: 'patient@hospital.com',
    password: 'password123',
    name: 'John Smith',
    role: 'patient',
    phone: '+1 234 567 8900',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-15',
  },
  {
    id: 'u2',
    email: 'doctor@hospital.com',
    password: 'password123',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1 234 567 8901',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    createdAt: '2023-06-01',
  },
  {
    id: 'u3',
    email: 'receptionist@hospital.com',
    password: 'password123',
    name: 'Emily Davis',
    role: 'receptionist',
    phone: '+1 234 567 8902',
    createdAt: '2023-08-15',
  },
  {
    id: 'u4',
    email: 'admin@hospital.com',
    password: 'password123',
    name: 'Michael Brown',
    role: 'admin',
    phone: '+1 234 567 8903',
    createdAt: '2023-01-01',
  },
  {
    id: 'u5',
    email: 'jane.patient@email.com',
    password: 'password123',
    name: 'Jane Wilson',
    role: 'patient',
    phone: '+1 234 567 8904',
    dateOfBirth: '1990-03-22',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    createdAt: '2024-02-10',
  },
  {
    id: 'u6',
    email: 'robert.patient@email.com',
    password: 'password123',
    name: 'Robert Taylor',
    role: 'patient',
    phone: '+1 234 567 8905',
    dateOfBirth: '1978-11-08',
    address: '789 Pine Rd, Queens, NY 11375',
    createdAt: '2024-03-05',
  },
];

export const doctors: Doctor[] = [
  {
    id: 'd1',
    userId: 'u2',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@hospital.com',
    specialization: 'Interventional Cardiology',
    department: 'Cardiology',
    experience: 15,
    education: 'MD from Harvard Medical School',
    bio: 'Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in minimally invasive cardiac procedures.',
    avatar: '',
    rating: 4.9,
    reviewCount: 328,
    consultationFee: 200,
  },
  {
    id: 'd2',
    userId: 'u7',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    specialization: 'Pediatric Neurology',
    department: 'Neurology',
    experience: 12,
    education: 'MD from Johns Hopkins University',
    bio: 'Dr. Chen is a renowned pediatric neurologist specializing in epilepsy and developmental disorders. He is known for his compassionate approach to treating young patients.',
    avatar: '',
    rating: 4.8,
    reviewCount: 256,
    consultationFee: 180,
  },
  {
    id: 'd3',
    userId: 'u8',
    name: 'Dr. Amanda Foster',
    email: 'amanda.foster@hospital.com',
    specialization: 'Sports Medicine',
    department: 'Orthopedics',
    experience: 10,
    education: 'MD from Stanford University',
    bio: 'Dr. Foster specializes in sports-related injuries and rehabilitation. She has worked with professional athletes and is passionate about helping patients return to active lifestyles.',
    avatar: '',
    rating: 4.7,
    reviewCount: 189,
    consultationFee: 175,
  },
  {
    id: 'd4',
    userId: 'u9',
    name: 'Dr. James Williams',
    email: 'james.williams@hospital.com',
    specialization: 'General Pediatrics',
    department: 'Pediatrics',
    experience: 18,
    education: 'MD from Yale School of Medicine',
    bio: 'Dr. Williams has dedicated his career to children\'s health. With nearly two decades of experience, he provides comprehensive care for infants through adolescents.',
    avatar: '',
    rating: 4.9,
    reviewCount: 412,
    consultationFee: 150,
  },
  {
    id: 'd5',
    userId: 'u10',
    name: 'Dr. Lisa Park',
    email: 'lisa.park@hospital.com',
    specialization: 'Cosmetic Dermatology',
    department: 'Dermatology',
    experience: 8,
    education: 'MD from Columbia University',
    bio: 'Dr. Park combines medical expertise with aesthetic innovation. She specializes in both medical dermatology and cosmetic procedures.',
    avatar: '',
    rating: 4.6,
    reviewCount: 167,
    consultationFee: 220,
  },
  {
    id: 'd6',
    userId: 'u11',
    name: 'Dr. Robert Martinez',
    email: 'robert.martinez@hospital.com',
    specialization: 'Internal Medicine',
    department: 'General Medicine',
    experience: 20,
    education: 'MD from UCLA',
    bio: 'Dr. Martinez is a highly experienced internist who believes in holistic patient care. He focuses on preventive medicine and managing chronic conditions.',
    avatar: '',
    rating: 4.8,
    reviewCount: 534,
    consultationFee: 140,
  },
];

// Generate time slots for the next 14 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  
  doctors.forEach(doctor => {
    for (let day = 0; day < 14; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      
      times.forEach((time, index) => {
        const bookedCount = Math.floor(Math.random() * 3);
        slots.push({
          id: `slot-${doctor.id}-${day}-${index}`,
          doctorId: doctor.id,
          date: date.toISOString().split('T')[0],
          startTime: time,
          endTime: times[index + 1] || '17:00',
          capacity: 2,
          bookedCount,
          status: bookedCount >= 2 ? 'full' : 'available',
        });
      });
    }
  });
  
  return slots;
};

export const timeSlots: TimeSlot[] = generateTimeSlots();

export const appointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'u1',
    patientName: 'John Smith',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'scheduled',
    type: 'consultation',
    notes: 'Regular checkup for heart condition',
    createdAt: '2024-01-10',
    createdBy: 'u1',
  },
  {
    id: 'apt2',
    patientId: 'u5',
    patientName: 'Jane Wilson',
    doctorId: 'd2',
    doctorName: 'Dr. Michael Chen',
    department: 'Neurology',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    status: 'in-progress',
    type: 'follow-up',
    notes: 'Follow-up for migraine treatment',
    createdAt: '2024-01-08',
    createdBy: 'u3',
  },
  {
    id: 'apt3',
    patientId: 'u6',
    patientName: 'Robert Taylor',
    doctorId: 'd3',
    doctorName: 'Dr. Amanda Foster',
    department: 'Orthopedics',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '14:00',
    status: 'completed',
    type: 'consultation',
    notes: 'Knee pain evaluation',
    createdAt: '2024-01-05',
    createdBy: 'u6',
  },
  {
    id: 'apt4',
    patientId: 'u1',
    patientName: 'John Smith',
    doctorId: 'd4',
    doctorName: 'Dr. James Williams',
    department: 'Pediatrics',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    status: 'scheduled',
    type: 'consultation',
    createdAt: '2024-01-12',
    createdBy: 'u1',
  },
  {
    id: 'apt5',
    patientId: 'u5',
    patientName: 'Jane Wilson',
    doctorId: 'd5',
    doctorName: 'Dr. Lisa Park',
    department: 'Dermatology',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '15:30',
    status: 'cancelled',
    type: 'consultation',
    notes: 'Skin rash examination - Patient cancelled',
    createdAt: '2024-01-03',
    createdBy: 'u5',
  },
  {
    id: 'apt6',
    patientId: 'u6',
    patientName: 'Robert Taylor',
    doctorId: 'd6',
    doctorName: 'Dr. Robert Martinez',
    department: 'General Medicine',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '09:30',
    status: 'scheduled',
    type: 'follow-up',
    createdAt: '2024-01-14',
    createdBy: 'u3',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 09:00 AM',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'Appointment Confirmed',
    message: 'Your appointment has been confirmed for Dr. James Williams',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n3',
    userId: 'u2',
    title: 'New Patient Assigned',
    message: 'A new patient has booked an appointment for today',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n4',
    userId: 'u3',
    title: 'Walk-in Patient',
    message: 'A walk-in patient is waiting at the reception',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

// Analytics data for admin dashboard
export const analyticsData = {
  totalPatients: 1247,
  totalDoctors: 48,
  totalAppointments: 3856,
  todayAppointments: 42,
  completedToday: 28,
  cancelledToday: 3,
  pendingToday: 11,
  weeklyTrend: [
    { day: 'Mon', appointments: 52 },
    { day: 'Tue', appointments: 48 },
    { day: 'Wed', appointments: 61 },
    { day: 'Thu', appointments: 55 },
    { day: 'Fri', appointments: 42 },
    { day: 'Sat', appointments: 18 },
    { day: 'Sun', appointments: 0 },
  ],
  departmentStats: [
    { name: 'Cardiology', appointments: 156, revenue: 31200 },
    { name: 'Neurology', appointments: 124, revenue: 22320 },
    { name: 'Orthopedics', appointments: 98, revenue: 17150 },
    { name: 'Pediatrics', appointments: 187, revenue: 28050 },
    { name: 'Dermatology', appointments: 76, revenue: 16720 },
    { name: 'General Medicine', appointments: 234, revenue: 32760 },
  ],
  monthlyRevenue: 148200,
  patientSatisfaction: 4.7,
};
