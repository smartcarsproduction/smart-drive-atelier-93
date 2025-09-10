import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app, this would call an API
    toast.success("Login successful! Welcome to Smart Cars Elite.");
    navigate("/dashboard");
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Logging in with ${provider}...`);
    // Simulate successful social login
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-luxury rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            <span className="font-luxury text-2xl font-semibold text-primary">Smart Cars</span>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-luxury bg-card/80 backdrop-blur-md border-accent-light">
          <div className="text-center mb-6">
            <h1 className="font-luxury text-2xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Smart Cars Elite account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-accent-light focus:border-secondary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-background border-accent-light focus:border-secondary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="rounded border-accent-light text-secondary focus:ring-secondary"
                />
                <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="#" className="text-secondary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="luxury" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or continue with
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {["Google", "Apple", "Microsoft"].map((provider) => (
                <Button
                  key={provider}
                  variant="elegant"
                  className="w-full text-xs"
                  onClick={() => handleSocialLogin(provider)}
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-secondary hover:underline font-medium">
                Create Elite Account
              </Link>
            </p>
          </div>

          {/* Admin Login */}
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="text-center">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                  Administrator Access
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Emergency Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need immediate assistance?{" "}
            <span className="text-secondary font-medium">Call +91 98765 43210</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;