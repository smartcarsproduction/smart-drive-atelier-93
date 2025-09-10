import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, Users, Globe, ArrowUp, ArrowDown } from "lucide-react";

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Website performance and user analytics.</p>
        </div>
        <Button variant="luxury">Generate Report</Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Page Views</p>
              <p className="text-2xl font-bold text-primary">-</p>
              <div className="flex items-center text-muted-foreground text-sm">
                No data
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold text-primary">-</p>
              <div className="flex items-center text-muted-foreground text-sm">
                No data
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
              <p className="text-2xl font-bold text-primary">-</p>
              <div className="flex items-center text-muted-foreground text-sm">
                No data
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Session</p>
              <p className="text-2xl font-bold text-primary">-</p>
              <div className="flex items-center text-muted-foreground text-sm">
                No data
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-luxury">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Top Pages</h2>
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No page data available</p>
            <p className="text-sm text-muted-foreground">Page analytics will appear here once data is collected</p>
          </div>
        </Card>

        <Card className="p-6 shadow-luxury">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Traffic Sources</h2>
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No traffic data available</p>
            <p className="text-sm text-muted-foreground">Traffic source analytics will appear here once data is collected</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;