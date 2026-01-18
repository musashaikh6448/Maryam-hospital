import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { Calendar, Clock, CheckCircle, XCircle, Users, UserCheck, Building2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { analyticsData } from '@/data/mockData';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { appointments, doctors, cancelAppointment, updateAppointment } = useApp();

  const today = new Date().toISOString().split('T')[0];

  // Patient specific data
  const patientAppointments = appointments.filter(a => a.patientId === user?.id);
  const upcomingPatientAppointments = patientAppointments.filter(
    a => a.date >= today && a.status === 'scheduled'
  ).slice(0, 3);

  // Doctor specific data
  const doctorAppointments = appointments.filter(
    a => doctors.find(d => d.userId === user?.id)?.id === a.doctorId
  );
  const todayDoctorAppointments = doctorAppointments.filter(a => a.date === today);

  // Receptionist/Admin data
  const todayAppointments = appointments.filter(a => a.date === today);
  const scheduledToday = todayAppointments.filter(a => a.status === 'scheduled').length;
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const cancelledToday = todayAppointments.filter(a => a.status === 'cancelled').length;

  const handleCancel = (id: string) => {
    cancelAppointment(id);
  };

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: 'completed' });
  };

  const renderPatientDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingPatientAppointments.length}
          icon={Calendar}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Completed Visits"
          value={patientAppointments.filter(a => a.status === 'completed').length}
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title="Available Doctors"
          value={doctors.length}
          icon={Users}
          iconClassName="bg-secondary/10 text-secondary"
        />
        <StatCard
          title="Total Appointments"
          value={patientAppointments.length}
          icon={Clock}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Upcoming Appointments</h2>
            <Link to="/appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {upcomingPatientAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingPatientAppointments.map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onCancel={handleCancel}
                  onReschedule={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">No upcoming appointments</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book an appointment with one of our specialists
              </p>
              <Link to="/doctors">
                <Button>Find a Doctor</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/doctors" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Find a Doctor</p>
                    <p className="text-sm text-muted-foreground">Browse specialists</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/appointments" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">My Appointments</p>
                    <p className="text-sm text-muted-foreground">View schedule</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/history" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">Visit History</p>
                    <p className="text-sm text-muted-foreground">Past appointments</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const renderDoctorDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={todayDoctorAppointments.length}
          icon={Calendar}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Completed Today"
          value={todayDoctorAppointments.filter(a => a.status === 'completed').length}
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title="Pending"
          value={todayDoctorAppointments.filter(a => a.status === 'scheduled').length}
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
        />
        <StatCard
          title="Total Patients"
          value={new Set(doctorAppointments.map(a => a.patientId)).size}
          icon={Users}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Today's Schedule</h2>
            <Link to="/schedule">
              <Button variant="outline" size="sm">View Full Schedule</Button>
            </Link>
          </div>
          {todayDoctorAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayDoctorAppointments.map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDoctor={false}
                  showPatient={true}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
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

        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/availability" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Availability</p>
                    <p className="text-sm text-muted-foreground">Set your schedule</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/my-patients" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">My Patients</p>
                    <p className="text-sm text-muted-foreground">View patient list</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const renderReceptionistDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Scheduled"
          value={scheduledToday}
          icon={Clock}
          iconClassName="bg-info/10 text-info"
        />
        <StatCard
          title="Completed"
          value={completedToday}
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title="Cancelled"
          value={cancelledToday}
          icon={XCircle}
          iconClassName="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Today's Appointments</h2>
            <Link to="/all-appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.slice(0, 5).map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showPatient={true}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">No appointments today</h3>
              <p className="text-sm text-muted-foreground">
                Schedule is clear for today
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/scheduling" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Schedule Appointment</p>
                    <p className="text-sm text-muted-foreground">Book for patient</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/patients" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Patient Directory</p>
                    <p className="text-sm text-muted-foreground">Search patients</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={analyticsData.totalPatients.toLocaleString()}
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Doctors"
          value={analyticsData.totalDoctors}
          icon={UserCheck}
          iconClassName="bg-secondary/10 text-secondary"
        />
        <StatCard
          title="Today's Appointments"
          value={analyticsData.todayAppointments}
          icon={Calendar}
          iconClassName="bg-info/10 text-info"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(analyticsData.monthlyRevenue / 1000).toFixed(0)}k`}
          icon={TrendingUp}
          iconClassName="bg-success/10 text-success"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold mb-4">Department Overview</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Appointments</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.departmentStats.map((dept, index) => (
                  <tr key={dept.name} className={index !== analyticsData.departmentStats.length - 1 ? 'border-b border-border' : ''}>
                    <td className="p-4 font-medium">{dept.name}</td>
                    <td className="p-4 text-right">{dept.appointments}</td>
                    <td className="p-4 text-right text-success">${dept.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/analytics" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-muted-foreground">Detailed reports</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/manage-doctors" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Doctors</p>
                    <p className="text-sm text-muted-foreground">Staff management</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/departments" className="block">
              <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">Departments</p>
                    <p className="text-sm text-muted-foreground">Manage departments</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          {getGreeting()}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'patient' && "Here's your health overview"}
          {user?.role === 'doctor' && "Here's your schedule for today"}
          {user?.role === 'receptionist' && "Here's the appointment overview"}
          {user?.role === 'admin' && "Here's your system overview"}
        </p>
      </div>

      {user?.role === 'patient' && renderPatientDashboard()}
      {user?.role === 'doctor' && renderDoctorDashboard()}
      {user?.role === 'receptionist' && renderReceptionistDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
