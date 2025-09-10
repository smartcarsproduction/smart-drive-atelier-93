import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Server, Database, Wifi, HardDrive, Activity, Shield, AlertTriangle } from "lucide-react";

const AdminSystem = () => {
  const systemMetrics: Array<{
    name: string;
    value: number;
    status: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [];

  const services: Array<{
    name: string;
    status: string;
    uptime: string;
    lastCheck: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time system health and performance metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.length > 0 ? (
          systemMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.name} className="p-6 shadow-elegant">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <Badge variant="outline">{metric.status}</Badge>
                </div>
                <h3 className="font-medium text-primary mb-2">{metric.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold text-primary">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full p-8 text-center">
            <Monitor className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No system metrics available</p>
            <p className="text-sm text-muted-foreground">System monitoring will show metrics once connected</p>
          </Card>
        )}
      </div>

      {/* Service Status */}
      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-6">Service Status</h2>
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => {
                const IconComponent = service.icon;
                const isOnline = service.status === "Online";
                const isDegraded = service.status === "Degraded";
                
                return (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-card-luxury rounded-luxury">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${isOnline ? 'bg-green-500/10' : isDegraded ? 'bg-yellow-500/10' : 'bg-red-500/10'} rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${isOnline ? 'text-green-600' : isDegraded ? 'text-yellow-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">Uptime: {service.uptime} • Last check: {service.lastCheck}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={isOnline ? 'default' : isDegraded ? 'secondary' : 'destructive'} 
                             className={isOnline ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''}>
                        {service.status}
                      </Badge>
                      <Button variant="ghost" size="sm">Details</Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Server className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No services monitored</p>
                <p className="text-sm text-muted-foreground">System services will appear here once monitoring is configured</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-luxury">
          <h3 className="font-luxury text-lg font-bold text-primary mb-4">System Actions</h3>
          <div className="space-y-3">
            <Button variant="elegant" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              View Detailed Metrics
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Database Health Check
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
          </div>
        </Card>

        <Card className="p-6 shadow-luxury">
          <h3 className="font-luxury text-lg font-bold text-primary mb-4">Maintenance</h3>
          <div className="space-y-3">
            <Button variant="elegant" className="w-full justify-start">
              <Server className="w-4 h-4 mr-2" />
              Restart Services
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <HardDrive className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="elegant" className="w-full justify-start">
              <Monitor className="w-4 h-4 mr-2" />
              Performance Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystem;