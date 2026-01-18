import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { departments } from '@/data/mockData';
import { Heart, Brain, Bone, Baby, Fingerprint, Stethoscope, Eye, Smile, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Bone,
  Baby,
  Fingerprint,
  Stethoscope,
  Eye,
  Smile,
};

export const Departments: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Departments</h1>
        <p className="text-muted-foreground mt-1">Manage hospital departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map((dept, index) => {
          const Icon = iconMap[dept.icon] || Building2;
          const colors = [
            'from-primary/20 to-primary/10 text-primary',
            'from-secondary/20 to-secondary/10 text-secondary',
            'from-info/20 to-info/10 text-info',
            'from-success/20 to-success/10 text-success',
            'from-warning/20 to-warning/10 text-warning',
            'from-destructive/20 to-destructive/10 text-destructive',
          ];
          const colorClass = colors[index % colors.length];

          return (
            <div
              key={dept.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                colorClass
              )}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                {dept.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dept.description}
              </p>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Departments;
