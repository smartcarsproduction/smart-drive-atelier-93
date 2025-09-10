import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  Globe,
  Eye,
  Server,
  Activity,
  TrendingUp,
  Bell,
  FileText
} from "lucide-react";
import { useAdminStats, useRecentBookings } from "@/lib/admin-hooks";
import CarLoadingAnimation from "@/components/CarLoadingAnimation";

const AdminDashboardHome = () => {
  const { data: stats = [], isLoading: statsLoading } = useAdminStats();
  const { data: recentBookings = [], isLoading: bookingsLoading } = useRecentBookings(5);

  // Icon mapping for stats
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Users,
    Calendar,
    Car,
    DollarSign
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Administrator. Here's your Smart Cars Elite overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="elegant" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="luxury" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.length > 0 ? (
          stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || TrendingUp;
            return (
              <Card key={index} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-secondary font-medium">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center group-hover:scale-110 transition-luxury">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })
        ) : statsLoading ? (
          <Card className="col-span-full p-8 text-center">
            <CarLoadingAnimation size="lg" className="mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">Loading statistics...</p>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </Card>
        ) : (
          <Card className="col-span-full p-8 text-center">
            <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No statistics available</p>
            <p className="text-sm text-muted-foreground">Data will appear once the system is connected</p>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 p-6 shadow-luxury">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-luxury text-xl font-bold text-primary">Recent Bookings</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-card-luxury rounded-luxury hover:shadow-elegant transition-luxury">
                  <div>
                    <p className="font-medium text-primary">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">{booking.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{booking.date}</p>
                    <Badge 
                      variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'In Progress' ? 'secondary' : 'outline'}
                      className="mt-1"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : bookingsLoading ? (
              <div className="text-center py-8">
                <CarLoadingAnimation size="md" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading recent bookings...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No recent bookings</p>
                <p className="text-sm text-muted-foreground">New bookings will appear here</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 shadow-luxury">
          <h2 className="font-luxury text-xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="elegant" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Add New Customer
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Service
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <Car className="w-4 h-4 mr-2" />
              Vehicle Registry
            </Button>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="p-6 shadow-luxury bg-gradient-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-luxury text-lg font-semibold text-primary mb-2">System Health</h3>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Web Server</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">API Services</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardHome;