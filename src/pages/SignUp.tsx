import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Step 2 - Vehicle Info
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleVin: "",
    
    // Step 3 - Account Setup
    preferences: "",
    newsletter: false,
    terms: false
  });

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    toast.success("Account created successfully! Welcome to Smart Cars Elite.");
    navigate("/dashboard");
  };

  const handleSocialSignUp = (provider: string) => {
    toast.success(`Creating account with ${provider}...`);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-primary font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-background border-accent-light focus:border-secondary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-primary font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-background border-accent-light focus:border-secondary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-accent-light focus:border-secondary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary font-medium">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={cn("text-xs font-medium", 
                      passwordScore < 3 ? "text-destructive" : 
                      passwordScore < 5 ? "text-secondary" : "text-green-600"
                    )}>
                      {passwordScore < 3 ? "Weak" : passwordScore < 5 ? "Good" : "Strong"}
                    </span>
                  </div>
                  <Progress value={passwordScore * 20} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(passwordStrength).map(([key, met]) => (
                      <div key={key} className={cn("flex items-center gap-1", met ? "text-green-600" : "text-muted-foreground")}>
                        {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>
                          {key === "length" ? "8+ characters" :
                           key === "uppercase" ? "Uppercase" :
                           key === "lowercase" ? "Lowercase" :
                           key === "number" ? "Number" : "Special char"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-primary font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={cn(
                  "bg-background border-accent-light focus:border-secondary",
                  formData.confirmPassword && (passwordMatch ? "border-green-600" : "border-destructive")
                )}
                required
              />
              {formData.confirmPassword && (
                <div className={cn("text-xs flex items-center gap-1", passwordMatch ? "text-green-600" : "text-destructive")}>
                  {passwordMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {passwordMatch ? "Passwords match" : "Passwords don't match"}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleMake" className="text-primary font-medium">Vehicle Make</Label>
              <Select value={formData.vehicleMake} onValueChange={(value) => setFormData({ ...formData, vehicleMake: value })}>
                <SelectTrigger className="bg-background border-accent-light focus:border-secondary">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="porsche">Porsche</SelectItem>
                  <SelectItem value="bentley">Bentley</SelectItem>
                  <SelectItem value="rollsroyce">Rolls-Royce</SelectItem>
                  <SelectItem value="ferrari">Ferrari</SelectItem>
                  <SelectItem value="lamborghini">Lamborghini</SelectItem>
                  <SelectItem value="other">Other Luxury Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel" className="text-primary font-medium">Vehicle Model</Label>
              <Input
                id="vehicleModel"
                placeholder="e.g., S-Class, 7 Series, A8"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="bg-background border-accent-light focus:border-secondary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleYear" className="text-primary font-medium">Year</Label>
              <Select value={formData.vehicleYear} onValueChange={(value) => setFormData({ ...formData, vehicleYear: value })}>
                <SelectTrigger className="bg-background border-accent-light focus:border-secondary">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleVin" className="text-primary font-medium">VIN (Optional)</Label>
              <Input
                id="vehicleVin"
                placeholder="17-character VIN"
                value={formData.vehicleVin}
                onChange={(e) => setFormData({ ...formData, vehicleVin: e.target.value })}
                className="bg-background border-accent-light focus:border-secondary"
                maxLength={17}
              />
              <p className="text-xs text-muted-foreground">
                VIN helps us provide more accurate diagnostics and service recommendations
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferences" className="text-primary font-medium">Service Preferences</Label>
              <Select value={formData.preferences} onValueChange={(value) => setFormData({ ...formData, preferences: value })}>
                <SelectTrigger className="bg-background border-accent-light focus:border-secondary">
                  <SelectValue placeholder="Select your preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">White-glove pickup & delivery</SelectItem>
                  <SelectItem value="dropoff">I'll drop off my vehicle</SelectItem>
                  <SelectItem value="mobile">Mobile service (where applicable)</SelectItem>
                  <SelectItem value="flexible">Flexible - depends on service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border border-accent-light rounded-luxury p-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="newsletter" 
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="rounded border-accent-light text-secondary focus:ring-secondary"
                />
                <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                  Join the Smart Cars Elite Club for exclusive updates and offers
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="rounded border-accent-light text-secondary focus:ring-secondary"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <Link to="#" className="text-secondary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="#" className="text-secondary hover:underline">Privacy Policy</Link>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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

        {/* Sign Up Form */}
        <Card className="p-8 shadow-luxury bg-card/80 backdrop-blur-md border-accent-light">
          <div className="text-center mb-6">
            <h1 className="font-luxury text-2xl font-bold text-primary mb-2">Join Smart Cars Elite</h1>
            <p className="text-muted-foreground">Create your luxury automotive care account</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
              <span className="text-sm text-secondary font-medium">
                {currentStep === 1 ? "Personal Info" : currentStep === 2 ? "Vehicle Info" : "Account Setup"}
              </span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>

          {renderStep()}

          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="elegant"
                className="flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="luxury"
              className="flex-1"
              onClick={handleNext}
              disabled={currentStep === 3 && !formData.terms}
            >
              {currentStep === 3 ? "Create Account" : "Next"}
            </Button>
          </div>

          {currentStep === 1 && (
            <>
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Or sign up with
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {["Google", "Apple", "Microsoft"].map((provider) => (
                    <Button
                      key={provider}
                      variant="elegant"
                      className="w-full text-xs"
                      onClick={() => handleSocialSignUp(provider)}
                    >
                      {provider}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-secondary hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
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

export default SignUp;