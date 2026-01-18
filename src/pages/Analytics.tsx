import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { analyticsData, departments } from '@/data/mockData';
import { StatCard } from '@/components/common/StatCard';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Star,
  Building2,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['hsl(210, 85%, 45%)', 'hsl(175, 60%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(0, 72%, 51%)', 'hsl(199, 89%, 48%)'];

export const Analytics: React.FC = () => {
  const { appointments, doctors } = useApp();

  const statusData = [
    { name: 'Scheduled', value: analyticsData.pendingToday, color: COLORS[0] },
    { name: 'Completed', value: analyticsData.completedToday, color: COLORS[3] },
    { name: 'Cancelled', value: analyticsData.cancelledToday, color: COLORS[4] },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor hospital performance and metrics</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={analyticsData.totalPatients.toLocaleString()}
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Doctors"
          value={analyticsData.totalDoctors}
          icon={UserCheck}
          iconClassName="bg-secondary/10 text-secondary"
        />
        <StatCard
          title="Monthly Appointments"
          value={analyticsData.totalAppointments.toLocaleString()}
          icon={Calendar}
          iconClassName="bg-info/10 text-info"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Patient Satisfaction"
          value={`${analyticsData.patientSatisfaction}/5`}
          icon={Star}
          iconClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly appointments chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-heading font-semibold mb-4">Weekly Appointments</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="appointments" fill="hsl(210, 85%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's status pie chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Appointment Status</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and departments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-semibold">Monthly Revenue</h3>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className="text-4xl font-bold text-foreground">
            ${(analyticsData.monthlyRevenue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-success mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +8% from last month
          </p>
        </div>

        {/* Department stats */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-heading font-semibold mb-4">Department Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 font-medium text-muted-foreground">Department</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Appointments</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Revenue</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.departmentStats.map((dept, index) => (
                  <tr key={dept.name} className={index !== analyticsData.departmentStats.length - 1 ? 'border-b border-border' : ''}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">{dept.appointments}</td>
                    <td className="py-3 text-right text-success">${dept.revenue.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="w-24 h-2 bg-muted rounded-full ml-auto">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(dept.appointments / 250) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
