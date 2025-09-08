'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '@/lib/axiosInstance';
import { 
  Home, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Trash2,
  X,
  MapPin,
  Building2,
  IndianRupee,
  User,
  BadgeCheck,
  Calendar,
  Loader2,
  Phone,
  Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Image from 'next/image';
import { useUsers } from '@/app/context/UserContext';
import { useCategories } from '@/app/context/CategoryContext';


interface PropertyLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: number;
}

interface UnsoldProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  propertyType: string;
  location: PropertyLocation | string;
  listedBy: string; // Seller ID
  soldTo?: string | null;
  isSold: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

const UnsoldPropertyList = () => {
  const [properties, setProperties] = useState<UnsoldProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<UnsoldProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalUnsold, setTotalUnsold] = useState(0);
  
  // Use context for users and categories
  const { getUserById } = useUsers();
  const { getCategoryById } = useCategories();

  useEffect(() => {
    fetchUnsoldProperties();
  }, []);

  const fetchUnsoldProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet('api/admin/properties/unsold');
      setProperties(res.data.data || []);
      setTotalUnsold(res.data.totalDocs || 0);
    } catch (err) {
      setError('Failed to load unsold properties. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location: PropertyLocation | string): string => {
    if (!location) return 'N/A';
    
    if (typeof location === 'string') {
      return location.trim() || 'N/A';
    }
    
    const { address, city, state, country, pincode } = location;
    const parts = [address, city, state, country].filter(Boolean);
    const result = parts.join(', ');
    return `${result}${result && pincode ? ` - ${pincode}` : ''}` || 'N/A';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price ? new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price) : 'N/A';
  };

  const getDisplayValue = (value: any, fallback: string = 'N/A'): string => {
    if (value === null || value === undefined) return fallback;
    const str = value.toString().trim();
    return str ? str : fallback;
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'N/A';
  };

  const openPropertyModal = (property: UnsoldProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(propertyId);
      await apiDelete(`api/admin/properties/${propertyId}`);
      
      setProperties(properties.filter(property => property._id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error('Failed to delete property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <span>Unsold Properties</span>
            </CardTitle>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              Total Unsold: {totalUnsold}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-16 rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-destructive flex flex-col items-center">
              <AlertCircle className="w-10 h-10 mb-2 stroke-current" />
              <p className="mb-4">{error}</p>
              <Button 
                onClick={fetchUnsoldProperties}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-inherit">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? (
                  properties.map((property, idx) => {
                    const seller = getUserById(property.listedBy);
                    
                    return (
                      <TableRow key={property._id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {getDisplayValue(property.title)}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {getDisplayValue(property.description)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            <Building2 className="w-4 h-4 mr-1" />
                            {getDisplayValue(property.propertyType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {formatPrice(property.price)}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {formatLocation(property.location)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {seller ? getDisplayValue(seller.fullName) : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={property.isActive ? 'default' : 'destructive'} 
                              className="w-min"
                            >
                              {property.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge 
                              variant={property.isSold ? 'default' : 'outline'} 
                              className="w-min"
                            >
                              {property.isSold ? 'Sold' : 'Available'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openPropertyModal(property)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProperty(property._id)}
                            disabled={deletingId === property._id}
                            className="text-red-500 hover:text-red-700"
                          >
                            {deletingId === property._id ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Home className="w-10 h-10" />
                        <span>No unsold properties found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Unsold Property Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Property Details</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedProperty && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                    <p className="font-medium text-lg">
                      {getDisplayValue(selectedProperty.title)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="whitespace-pre-wrap">
                      {getDisplayValue(selectedProperty.description)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p className="font-medium text-xl flex items-center">
                      <IndianRupee className="w-5 h-5 mr-1" />
                      {formatPrice(selectedProperty.price)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p className="flex items-start gap-1">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{formatLocation(selectedProperty.location)}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Property Type</h3>
                    <p className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="capitalize">
                        {getDisplayValue(selectedProperty.propertyType)}
                      </span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                      <p>
                        {selectedProperty.category 
                          ? getCategoryName(selectedProperty.category) 
                          : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={selectedProperty.isActive ? 'default' : 'destructive'} 
                          className="flex items-center"
                        >
                          {selectedProperty.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        
                        <Badge 
                          variant={selectedProperty.isSold ? 'default' : 'outline'} 
                          className="flex items-center"
                        >
                          {selectedProperty.isSold ? 'Sold' : 'Available'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Seller Details */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Seller Details
                </h3>
                
                {(() => {
                  const seller = getUserById(selectedProperty.listedBy);
                  return seller ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                        <p className="font-medium">{getDisplayValue(seller.fullName)}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <Mail className="w-4 h-4" /> Email
                          </h4>
                          <p>{getDisplayValue(seller.email)}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <Phone className="w-4 h-4" /> Contact
                          </h4>
                          <p>{getDisplayValue(seller.mobileNumber)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Address
                        </h4>
                        <p>{formatLocation(seller?.address)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Seller details not available</p>
                  );
                })()}
              </div>
              
              <Separator />
              
              {/* Property Images */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedProperty.images.length > 0 ? (
                    selectedProperty.images.map((img, idx) => (
                      <div key={idx} className="aspect-video relative rounded-md overflow-hidden border">
                        <Image
                          src={img}
                          alt={`Property image ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-muted flex items-center justify-center">
                                <span class="text-muted-foreground">Image not available</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 h-32 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">No images available</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p>{formatDate(selectedProperty.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{formatDate(selectedProperty.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Property ID</h3>
                  <p className="truncate font-mono text-sm">
                    {getDisplayValue(selectedProperty._id)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteProperty(selectedProperty._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Property
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnsoldPropertyList;