import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Car, Calendar, Wrench, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Vehicle, Booking, ServiceHistoryRecord } from "@/lib/schema";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().min(0).optional(),
  fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid"]).optional(),
  transmission: z.enum(["automatic", "manual"]).optional(),
  engineSize: z.string().optional(),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const VehicleManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch user's vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles/user', user?.id],
    enabled: !!user?.id,
  });

  // Fetch service history for selected vehicle
  const { data: serviceHistory, isLoading: historyLoading } = useQuery<ServiceHistoryRecord[]>({
    queryKey: ['/api/service-history/vehicle', selectedVehicle?.id],
    enabled: !!selectedVehicle?.id,
  });

  // Fetch upcoming bookings for selected vehicle
  const { data: upcomingBookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/vehicle', selectedVehicle?.id, 'upcoming'],
    enabled: !!selectedVehicle?.id,
  });

  const addVehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vin: "",
      color: "",
      mileage: undefined,
      fuelType: "gasoline",
      transmission: "automatic",
      engineSize: "",
      notes: "",
    },
  });

  const editVehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });
      if (!response.ok) throw new Error('Failed to add vehicle');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Vehicle added successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/user', user?.id] });
      setShowAddDialog(false);
      addVehicleForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
    },
  });

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormData & { id: string }) => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update vehicle');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Vehicle updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/user', user?.id] });
      setShowEditDialog(false);
      setSelectedVehicle(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
    },
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Vehicle deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/user', user?.id] });
      setSelectedVehicle(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
    },
  });

  const onAddVehicle = (data: VehicleFormData) => {
    addVehicleMutation.mutate(data);
  };

  const onEditVehicle = (data: VehicleFormData) => {
    if (selectedVehicle) {
      updateVehicleMutation.mutate({ ...data, id: selectedVehicle.id });
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    editVehicleForm.reset({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin || "",
      color: vehicle.color || "",
      mileage: vehicle.mileage || undefined,
      fuelType: (vehicle.fuelType as "gasoline" | "diesel" | "electric" | "hybrid") || "gasoline",
      transmission: (vehicle.transmission as "automatic" | "manual") || "automatic",
      engineSize: vehicle.engineSize || "",
      notes: vehicle.notes || "",
    });
    setShowEditDialog(true);
  };

  const getNextServiceDate = (vehicle: Vehicle): string => {
    if (vehicle.nextServiceDue) {
      const date = new Date(vehicle.nextServiceDue);
      return date.toLocaleDateString();
    }
    return "Not scheduled";
  };

  const getServiceStatus = (vehicle: Vehicle): "none" | "overdue" | "due-soon" | "scheduled" => {
    if (!vehicle.nextServiceDue) return "none";
    const nextService = new Date(vehicle.nextServiceDue);
    const today = new Date();
    const diffDays = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays <= 7) return "due-soon";
    return "scheduled";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Vehicle Management</h1>
          <p className="text-muted-foreground">Manage your luxury vehicles and service history</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-vehicle" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new luxury vehicle to your collection
              </DialogDescription>
            </DialogHeader>
            <Form {...addVehicleForm}>
              <form onSubmit={addVehicleForm.handleSubmit(onAddVehicle)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addVehicleForm.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input data-testid="input-vehicle-make" placeholder="Mercedes-Benz, BMW, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addVehicleForm.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input data-testid="input-vehicle-model" placeholder="S-Class, X5, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={addVehicleForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-vehicle-year" 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addVehicleForm.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input data-testid="input-vehicle-color" placeholder="Black, White, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addVehicleForm.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                          <Input 
                            data-testid="input-vehicle-mileage" 
                            type="number" 
                            placeholder="50000"
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addVehicleForm.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (Optional)</FormLabel>
                      <FormControl>
                        <Input data-testid="input-vehicle-vin" placeholder="Vehicle Identification Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addVehicleForm.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fuel-type">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gasoline">Gasoline</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addVehicleForm.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-transmission">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addVehicleForm.control}
                  name="engineSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine Size (Optional)</FormLabel>
                      <FormControl>
                        <Input data-testid="input-engine-size" placeholder="3.0L V6, 4.0L V8, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addVehicleForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          data-testid="textarea-vehicle-notes" 
                          placeholder="Any special notes about this vehicle..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-save-vehicle" disabled={addVehicleMutation.isPending}>
                    {addVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {vehiclesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vehicles?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles added yet</h3>
            <p className="text-muted-foreground mb-4">Add your first luxury vehicle to get started</p>
            <Button data-testid="button-add-first-vehicle" onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicles List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Vehicles</h2>
            {vehicles?.map((vehicle: any) => (
              <Card 
                key={vehicle.id} 
                className={`cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
                data-testid={`card-vehicle-${vehicle.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(vehicle);
                        }}
                        data-testid={`button-edit-vehicle-${vehicle.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVehicleMutation.mutate(vehicle.id);
                        }}
                        data-testid={`button-delete-vehicle-${vehicle.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {vehicle.color && `${vehicle.color} • `}
                    {vehicle.mileage && `${vehicle.mileage.toLocaleString()} miles • `}
                    {vehicle.fuelType && vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Next Service: {getNextServiceDate(vehicle)}
                    </div>
                    <Badge 
                      variant={
                        getServiceStatus(vehicle) === 'overdue' ? 'destructive' :
                        getServiceStatus(vehicle) === 'due-soon' ? 'secondary' : 'default'
                      }
                      data-testid={`badge-service-status-${vehicle.id}`}
                    >
                      {getServiceStatus(vehicle) === 'overdue' ? 'Overdue' :
                       getServiceStatus(vehicle) === 'due-soon' ? 'Due Soon' :
                       getServiceStatus(vehicle) === 'scheduled' ? 'Scheduled' : 'None'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {selectedVehicle ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Vehicle Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Make:</span> {selectedVehicle.make}
                      </div>
                      <div>
                        <span className="font-medium">Model:</span> {selectedVehicle.model}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {selectedVehicle.year}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> {selectedVehicle.color || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Mileage:</span> {selectedVehicle.mileage?.toLocaleString() || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Fuel Type:</span> {selectedVehicle.fuelType || 'Not specified'}
                      </div>
                    </div>
                    {selectedVehicle.vin && (
                      <div className="text-sm">
                        <span className="font-medium">VIN:</span> {selectedVehicle.vin}
                      </div>
                    )}
                    {selectedVehicle.notes && (
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span> 
                        <p className="mt-1 text-muted-foreground">{selectedVehicle.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : upcomingBookings?.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No upcoming bookings</p>
                    ) : (
                      <div className="space-y-2">
                        {upcomingBookings?.slice(0, 3).map((booking) => (
                          <div key={booking.id} data-testid={`booking-item-${booking.id}`} className="text-sm border-l-2 border-primary pl-3">
                            <div className="font-medium">{'Service'}</div>
                            <div className="text-muted-foreground">
                              {new Date(booking.scheduledDate).toLocaleDateString()} • {booking.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Service History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : serviceHistory?.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No service history available</p>
                    ) : (
                      <div className="space-y-3">
                        {serviceHistory?.slice(0, 5).map((record) => (
                          <div key={record.id} data-testid={`service-history-item-${record.id}`} className="border-l-2 border-green-500 pl-3">
                            <div className="text-sm font-medium">{'Service'}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(record.completedDate).toLocaleDateString()}
                              {record.totalPrice && ` • $${record.totalPrice}`}
                            </div>
                            {record.rating && (
                              <div className="text-xs">
                                Rating: {'★'.repeat(record.rating)}{'☆'.repeat(5 - record.rating)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a vehicle</h3>
                  <p className="text-muted-foreground">Choose a vehicle from the list to view details and service history</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update your vehicle information
            </DialogDescription>
          </DialogHeader>
          <Form {...editVehicleForm}>
            <form onSubmit={editVehicleForm.handleSubmit(onEditVehicle)} className="space-y-4">
              {/* Same form fields as add dialog */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editVehicleForm.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input data-testid="input-edit-vehicle-make" placeholder="Mercedes-Benz, BMW, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editVehicleForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input data-testid="input-edit-vehicle-model" placeholder="S-Class, X5, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editVehicleForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-edit-vehicle-year"
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editVehicleForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input data-testid="input-edit-vehicle-color" placeholder="Black, White, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editVehicleForm.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input 
                          data-testid="input-edit-vehicle-mileage"
                          type="number" 
                          placeholder="50000"
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button data-testid="button-cancel-edit" type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button data-testid="button-update-vehicle" type="submit" disabled={updateVehicleMutation.isPending}>
                  {updateVehicleMutation.isPending ? "Updating..." : "Update Vehicle"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleManagement;