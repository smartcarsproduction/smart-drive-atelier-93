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

const AdminDashboardHome = () => {
  const stats = [
    { label: "Total Customers", value: "1,247", icon: Users, change: "+12%" },
    { label: "Active Bookings", value: "89", icon: Calendar, change: "+8%" },
    { label: "Cars Serviced", value: "2,156", icon: Car, change: "+15%" },
    { label: "Monthly Revenue", value: "₹4,04,04,225", icon: DollarSign, change: "+23%" },
    { label: "Website Visitors", value: "15,432", icon: Globe, change: "+18%" },
    { label: "Page Views", value: "45,821", icon: Eye, change: "+25%" },
    { label: "System Uptime", value: "99.9%", icon: Server, change: "+0.1%" },
    { label: "Active Sessions", value: "234", icon: Activity, change: "+5%" }
  ];

  const recentBookings = [
    { id: "SC-001234", customer: "John Smith", service: "AI Diagnostics", date: "Dec 15, 2024", status: "Confirmed" },
    { id: "SC-001235", customer: "Sarah Johnson", service: "Engine Rebuild", date: "Dec 16, 2024", status: "In Progress" },
    { id: "SC-001236", customer: "Michael Chen", service: "Smart Customization", date: "Dec 17, 2024", status: "Pending" },
    { id: "SC-001237", customer: "Emma Davis", service: "Predictive Maintenance", date: "Dec 18, 2024", status: "Confirmed" }
  ];

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
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6 shadow-elegant hover:shadow-luxury transition-luxury group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-secondary font-medium">{stat.change} from last month</p>
                </div>
                <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center group-hover:scale-110 transition-luxury">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
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
            {recentBookings.map((booking) => (
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
            ))}
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