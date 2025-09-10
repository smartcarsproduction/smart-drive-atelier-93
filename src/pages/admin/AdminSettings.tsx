import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RefreshCw } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-luxury text-3xl font-bold text-primary">System Settings</h1>
          <p className="text-muted-foreground">Configure platform and application settings.</p>
        </div>
        <Button variant="luxury">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card className="p-6 shadow-luxury">
        <h2 className="font-luxury text-xl font-bold text-primary mb-6">General Settings</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Smart Cars Elite" />
            </div>
            <div>
              <Label htmlFor="site-url">Site URL</Label>
              <Input id="site-url" defaultValue="https://smartcarselite.com" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Input id="site-description" defaultValue="Premium automotive services with AI-powered diagnostics" />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-primary">Feature Toggles</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="booking-enabled">Online Booking</Label>
                <p className="text-sm text-muted-foreground">Allow customers to book services online</p>
              </div>
              <Switch id="booking-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications-enabled">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send automated email notifications</p>
              </div>
              <Switch id="notifications-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics-enabled">Analytics Tracking</Label>
                <p className="text-sm text-muted-foreground">Track website analytics and performance</p>
              </div>
              <Switch id="analytics-enabled" defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 shadow-luxury">
        <h2 className="font-luxury text-xl font-bold text-primary mb-6">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>IP Whitelisting</Label>
              <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Maintenance Mode */}
      <Card className="p-6 shadow-luxury border-yellow-200">
        <div className="flex items-center space-x-3 mb-4">
          <RefreshCw className="w-5 h-5 text-yellow-600" />
          <h2 className="font-luxury text-xl font-bold text-primary">Maintenance Mode</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">Display maintenance message to visitors</p>
          </div>
          <Switch />
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;