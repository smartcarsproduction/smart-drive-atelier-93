import { AdminLayout } from "@/components/admin/AdminLayout";
import { Routes, Route } from "react-router-dom";
import AdminDashboardHome from "./admin/AdminDashboardHome";
import AdminCustomers from "./admin/AdminCustomers";
import AdminBookings from "./admin/AdminBookings";
import AdminSystem from "./admin/AdminSystem";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminSettings from "./admin/AdminSettings";
import AdminContent from "./admin/AdminContent";
import AdminSecurity from "./admin/AdminSecurity";
import AdminServices from "./admin/AdminServices";
import AdminMedia from "./admin/AdminMedia";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboardHome />} />
        <Route path="/customers" element={<AdminCustomers />} />
        <Route path="/bookings" element={<AdminBookings />} />
        <Route path="/services" element={<AdminServices />} />
        <Route path="/system" element={<AdminSystem />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/content" element={<AdminContent />} />
        <Route path="/media" element={<AdminMedia />} />
        <Route path="/security" element={<AdminSecurity />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;