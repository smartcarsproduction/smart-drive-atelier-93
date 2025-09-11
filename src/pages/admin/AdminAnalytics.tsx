import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Car, 
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('30');
  const [groupBy, setGroupBy] = useState('day');

  // Fetch analytics data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['/api/analytics/overview', period],
    queryFn: () => fetch(`/api/analytics/overview?period=${period}`).then(res => res.json()),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/analytics/bookings', period, groupBy],
    queryFn: () => fetch(`/api/analytics/bookings?period=${period}&groupBy=${groupBy}`).then(res => res.json()),
  });

  const { data: popularServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/analytics/services/popular'],
    queryFn: () => fetch('/api/analytics/services/popular?limit=5').then(res => res.json()),
  });

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/analytics/bookings/status'],
    queryFn: () => fetch('/api/analytics/bookings/status').then(res => res.json()),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['/api/analytics/revenue', period],
    queryFn: () => fetch(`/api/analytics/revenue?period=${period}`).then(res => res.json()),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="luxury" data-testid="button-generate-report">Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 shadow-elegant" data-testid="card-total-bookings">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-total-bookings">
                {overviewLoading ? <Skeleton className="h-8 w-16" /> : overview?.overview?.totalBookings || 0}
              </p>
              <div className="flex items-center text-muted-foreground text-sm">
                {overviewLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span>Last {period} days: {overview?.overview?.periodBookings || 0}</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant" data-testid="card-total-revenue">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-total-revenue">
                {overviewLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(overview?.overview?.totalRevenue || 0)}
              </p>
              <div className="flex items-center text-muted-foreground text-sm">
                {overviewLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span>Last {period} days: {formatCurrency(overview?.overview?.periodRevenue || 0)}</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant" data-testid="card-completed-services">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Services</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-completed-services">
                {overviewLoading ? <Skeleton className="h-8 w-16" /> : overview?.overview?.completedBookings || 0}
              </p>
              <div className="flex items-center text-muted-foreground text-sm">
                {overviewLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span>Success rate: {overview?.overview?.totalBookings > 0 ? Math.round((overview?.overview?.completedBookings / overview?.overview?.totalBookings) * 100) : 0}%</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant" data-testid="card-avg-booking-value">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Booking Value</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-avg-booking-value">
                {overviewLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  formatCurrency(
                    overview?.overview?.completedBookings > 0 
                      ? overview?.overview?.totalRevenue / overview?.overview?.completedBookings 
                      : 0
                  )
                )}
              </p>
              <div className="flex items-center text-muted-foreground text-sm">
                Per completed service
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Over Time */}
        <Card className="p-6 shadow-luxury">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bookings Over Time
              </CardTitle>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : bookingsData?.bookingsData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingsData.bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No booking data available</p>
                <p className="text-sm text-muted-foreground">Booking trends will appear here once data is available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card className="p-6 shadow-luxury">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Most Popular Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : popularServices?.popularServices?.length > 0 ? (
              <div className="space-y-3">
                {popularServices.popularServices.map((service: any, index: number) => (
                  <div key={service.serviceId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{service.serviceName}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.bookingCount} bookings • {formatCurrency(parseFloat(service.totalRevenue || '0'))}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS[index] + '20' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No service data available</p>
                <p className="text-sm text-muted-foreground">Popular services will appear here once data is available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 shadow-luxury">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Daily Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : revenueData?.dailyRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueData.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(parseFloat(value as string)), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No revenue data available</p>
                <p className="text-sm text-muted-foreground">Revenue trends will appear here once services are completed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="p-6 shadow-luxury">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Booking Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : statusData?.statusDistribution?.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="status"
                    >
                      {statusData.statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="ml-4 space-y-2">
                  {statusData.statusDistribution.map((entry: any, index: number) => (
                    <div key={entry.status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm capitalize">{entry.status}</span>
                      <Badge variant="outline" className="text-xs">{entry.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No status data available</p>
                <p className="text-sm text-muted-foreground">Booking status distribution will appear here once data is available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;