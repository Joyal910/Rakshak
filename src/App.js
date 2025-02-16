import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// Lucide Icons
import {
  LayoutDashboard,
  Users,
  Bell,
  Package,
  AlertTriangle,
  FileBarChart,
  Settings,
  Menu,
  X,
  AlertCircle,
  UserCog,
  MessageSquare,
  HandHelping,
} from 'lucide-react';

// User-facing components
import Register from './components/Register/register';
import Login from './components/Login/login';
import ForgotPassword from './components/Login/ForgotPassword';
import Home from './components/userHome/pages/Home';
import DisasterUpdates from './components/userHome/pages/DisasterUpdates';
import ResourceRequest from './components/userHome/pages/ResourceRequest';
import EmergencyInfo from './components/userHome/pages/EmergencyInfo';
import Contact from './components/userHome/pages/Contact';
import SubmitRequest from './components/userHome/pages/SubmitRequest';
import Volunteer from './components/userHome/pages/Volunteer';
import LandingPage from './components/userHome/pages/Landing';
import UserProfile from './components/userHome/pages/Profile';
import UserNotification from './components/userHome/pages/UserNotification';

// Admin components
import Dashboard from './components/AdminHome/Dashboard';
import Feedback from './components/AdminHome/Feedback';
import Notifications from './components/AdminHome/Notifications';
import TaskRequests from './components/AdminHome/TaskRequests';
import ResourceRequests from './components/AdminHome/ResourceRequests';
import Resources from './components/AdminHome/Resources';
import Sidebar from './components/AdminHome/Sidebar';
import Header from './components/AdminHome/Header';
import Updates from './components/AdminHome/Updates';
import UserManagement from './components/AdminHome/UserManagement';
import VolunteerApplications from './components/AdminHome/VolunteerApplications';
import Volunteers from './components/AdminHome/Volunteers';
import PrivateAdminRoute from './components/AdminHome/PrivateAdminRoute';
import AdminSettings from "./components/AdminHome/Settings"

// Volunteer components
import VolunteerHome from './components/VolunteerHome/pages/Home';
import VolunteerNotifications from './components/VolunteerHome/pages/Notifications';
import VolunteerProfile from './components/VolunteerHome/pages/Profile';
import VolunteerTasks from './components/VolunteerHome/pages/Tasks';
import { ThemeProvider } from './components/VolunteerHome/context/ThemeContext';
import Layout from './components/VolunteerHome/components/Layout';
import PrivateVolunteerRoute from './components/VolunteerHome/PrivateVolunteerRoute';



// Admin Layout wrapper component
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const location = useLocation();

  // Update currentPage when location changes
  React.useEffect(() => {
    const page = location.pathname.split('/')[2]?.toLowerCase() || 'dashboard';
    setCurrentPage(page);
  }, [location]);

  const navigate = useNavigate(); // Add this

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: 'User Management', icon: UserCog, path: '/admin/usermanagement' },
    { id: 'taskrequests', label: 'Manage Task Requests', icon: AlertCircle, path: '/admin/taskrequests' },
    { id: 'resourcerequests', label: 'Manage Resource Requests', icon: AlertCircle, path: '/admin/resourcerequests' },
    { id: 'volunteers', label: 'Active Volunteers', icon: Users, path: '/admin/volunteers' },
    { id: 'applications', label: 'Volunteer Applications', icon: HandHelping, path: '/admin/volunteerapplications' },
    { id: 'resources', label: 'Resource Inventory', icon: Package, path: '/admin/resources' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { id: 'updates', label: 'Disaster Updates', icon: AlertTriangle, path: '/admin/updates' },
    { id: 'feedback', label: 'User Feedback', icon: MessageSquare, path: '/admin/feedback' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    
  ];

  const handlePageChange = (pageId) => {
    const navItem = navItems.find(item => item.id === pageId);
    if (navItem) {
      setCurrentPage(pageId);
      navigate(navItem.path);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50">
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Sidebar
        navItems={navItems}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="lg:ml-64 min-h-screen">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app-container">
    <ThemeProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<LandingPage/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/disasterupdates" element={<DisasterUpdates />} />
        <Route path="/resourcerequest" element={<ResourceRequest />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/emergencyinfo" element={<EmergencyInfo />} />
        <Route path="/submitrequest" element={<SubmitRequest />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/usernotifications" element={<UserNotification />} />
        

         {/* Volunteer routes */}

         <Route element={<PrivateVolunteerRoute />}>
  <Route element={<Layout />}>
    <Route path="/volunteer/home" element={<VolunteerHome />} />
    <Route path="/volunteer/tasks" element={<VolunteerTasks />} />
    <Route path="/volunteer/profile" element={<VolunteerProfile />} />
    <Route path="/volunteer/volunteernotification" element={<VolunteerNotifications />}/>
  </Route>
</Route>
        
        {/* Protected Admin routes */}
        <Route element={<PrivateAdminRoute />}>
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/feedback" element={<AdminLayout><Feedback /></AdminLayout>} />
          <Route path="/admin/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />
          <Route path="/admin/taskrequests" element={<AdminLayout><TaskRequests /></AdminLayout>} />
          <Route path="/admin/resourcerequests" element={<AdminLayout><ResourceRequests /></AdminLayout>} />
          <Route path="/admin/resources" element={<AdminLayout><Resources /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/updates" element={<AdminLayout><Updates /></AdminLayout>} />
          <Route path="/admin/usermanagement" element={<AdminLayout><UserManagement /></AdminLayout>} />
          <Route path="/admin/volunteerapplications" element={<AdminLayout><VolunteerApplications /></AdminLayout>} />
          
          <Route path="/admin/volunteers" element={<AdminLayout><Volunteers /></AdminLayout>} />
        </Route>
        
        {/* Legacy route - consider redirecting or removing */}
        
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ThemeProvider>
    </div>
  );
}

export default App;