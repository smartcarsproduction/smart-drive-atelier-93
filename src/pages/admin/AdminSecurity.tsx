import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Lock, Eye, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSecurity = () => {
  const { toast } = useToast();
  const threats: Array<{
    id: number;
    type: string;
    severity: string;
    source: string;
    time: string;
    status: string;
  }> = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Security Center</h1>
          <p className="text-muted-foreground">Monitor security threats and system protection.</p>
        </div>
        <Button variant="luxury" onClick={() => toast({ title: "Security Scan", description: "Security scanning functionality coming soon!" })}>
          <Shield className="w-4 h-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold text-primary">-</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Threats Blocked</p>
              <p className="text-2xl font-bold text-primary">-</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Monitors</p>
              <p className="text-2xl font-bold text-primary">-</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Threats */}
      <Card className="shadow-luxury">
        <div className="p-6">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Recent Security Events</h2>
          <div className="space-y-4">
            {threats.length > 0 ? (
              threats.map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-4 bg-card-luxury rounded-luxury">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${threat.severity === 'High' ? 'bg-red-500/10' : threat.severity === 'Medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'} rounded-full flex items-center justify-center`}>
                      <AlertTriangle className={`w-5 h-5 ${threat.severity === 'High' ? 'text-red-600' : threat.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary">{threat.type}</h3>
                      <p className="text-sm text-muted-foreground">Source: {threat.source} • {threat.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={threat.severity === 'High' ? 'destructive' : threat.severity === 'Medium' ? 'secondary' : 'outline'}>
                      {threat.severity}
                    </Badge>
                    <Badge variant={threat.status === 'Blocked' ? 'default' : 'secondary'}>
                      {threat.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No security events</p>
                <p className="text-sm text-muted-foreground">Your system is secure. Security events will appear here if detected.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSecurity;