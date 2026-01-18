import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import History from "./pages/History";
import Availability from "./pages/Availability";
import Schedule from "./pages/Schedule";
import MyPatients from "./pages/MyPatients";
import Scheduling from "./pages/Scheduling";
import AllAppointments from "./pages/AllAppointments";
import Patients from "./pages/Patients";
import ManageDoctors from "./pages/ManageDoctors";
import Departments from "./pages/Departments";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login\" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              
              {/* Patient routes */}
              <Route path="/doctors" element={<ProtectedRoute allowedRoles={['patient']}><Doctors /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute allowedRoles={['patient']}><Appointments /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute allowedRoles={['patient']}><History /></ProtectedRoute>} />
              
              {/* Doctor routes */}
              <Route path="/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><Schedule /></ProtectedRoute>} />
              <Route path="/availability" element={<ProtectedRoute allowedRoles={['doctor']}><Availability /></ProtectedRoute>} />
              <Route path="/my-patients" element={<ProtectedRoute allowedRoles={['doctor']}><MyPatients /></ProtectedRoute>} />
              
              {/* Receptionist routes */}
              <Route path="/scheduling" element={<ProtectedRoute allowedRoles={['receptionist']}><Scheduling /></ProtectedRoute>} />
              
              {/* Receptionist & Admin routes */}
              <Route path="/all-appointments" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><AllAppointments /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><Patients /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/manage-doctors" element={<ProtectedRoute allowedRoles={['admin']}><ManageDoctors /></ProtectedRoute>} />
              <Route path="/departments" element={<ProtectedRoute allowedRoles={['admin']}><Departments /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
