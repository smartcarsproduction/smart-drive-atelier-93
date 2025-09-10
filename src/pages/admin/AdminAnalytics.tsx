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
              <p className="text-2xl font-bold text-primary">45,821</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="w-3 h-3 mr-1" />
                +25%
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
              <p className="text-2xl font-bold text-primary">15,432</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="w-3 h-3 mr-1" />
                +18%
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
              <p className="text-2xl font-bold text-primary">32.1%</p>
              <div className="flex items-center text-red-600 text-sm">
                <ArrowDown className="w-3 h-3 mr-1" />
                -5%
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
              <p className="text-2xl font-bold text-primary">4m 32s</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-luxury">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Top Pages</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">/services</span>
              <span className="font-medium">2,341 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">1,987 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">/about</span>
              <span className="font-medium">1,234 views</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">/booking</span>
              <span className="font-medium">987 views</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-luxury">
          <h2 className="font-luxury text-xl font-bold text-primary mb-4">Traffic Sources</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Direct</span>
              <span className="font-medium">45.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Search Engines</span>
              <span className="font-medium">32.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Social Media</span>
              <span className="font-medium">12.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Referrals</span>
              <span className="font-medium">10.0%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;