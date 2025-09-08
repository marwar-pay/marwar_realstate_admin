"use client"; 
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { apiPut } from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/app/context/CategoryContext";
import { ImageIcon, Trash2 } from "lucide-react";

interface EditPropertyModalProps {
  open: boolean;
  onClose: () => void;
  property: any;
  onUpdated: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  open,
  onClose,
  property,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({ ...property });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { categories } = useCategories();

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const data = await response.json();
        const countryNames = data
          .map((country: any) => country.name.common)
          .sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        toast({
          title: "Error",
          description: "Failed to load country list",
          variant: "destructive",
        });
      }
    };

    fetchCountries();
  }, [toast]);

  // Initialize form data and fetch states if country exists
  useEffect(() => {
    // Normalize images to array
    const normalizedImages = Array.isArray(property.images) 
      ? property.images 
      : [property.images].filter(Boolean);
      
    setFormData(prev => ({ 
      ...prev, 
      images: normalizedImages,
      location: {
        ...prev.location,
        country: property.location?.country || "",
        state: property.location?.state || "",
      }
    }));
    
    // Reset file state when modal opens
    setImageFiles([]);
    setImagePreviews([]);
    
    if (categories && property?.category) {
      const selectedCategory = categories.find(cat => cat._id === property.category);
      setSubcategories(selectedCategory?.subcategories || []);
    }
    
    // Fetch states if country exists
    if (property.location?.country) {
      fetchStates(property.location.country);
    }
  }, [property, categories]);

  // Clean up image previews when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  // Fetch states for selected country
  const fetchStates = async (country: string) => {
    setLoadingStates(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        }
      );
      
      const data = await response.json();
      if (data.data && data.data.states) {
        setStates(data.data.states.map((state: any) => state.name));
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error("Failed to fetch states", error);
      toast({
        title: "Error",
        description: "Failed to load state list",
        variant: "destructive",
      });
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    // Revoke object URL for the removed image
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === "category") {
      const selected = categories.find(cat => cat._id === value);
      setSubcategories(selected?.subcategories || []);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  };

  // Handle country change
  const handleCountryChange = (country: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        country,
        state: "", // Reset state when country changes
      },
    }));
    fetchStates(country);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('propertyType', formData.propertyType);
      formDataToSend.append('category', formData.category);
      if (formData.subcategory) {
        formDataToSend.append('subcategory', formData.subcategory);
      }
      formDataToSend.append("bedrooms", formData.bedrooms);
      formDataToSend.append("projectStatus", formData.projectStatus);
      
      // Append location as nested fields
      formDataToSend.append("location[address]", formData.location?.address || '');
      formDataToSend.append("location[city]", formData.location?.city || '');
      formDataToSend.append("location[state]", formData.location?.state || '');
      formDataToSend.append("location[country]", formData.location?.country || '');
      formDataToSend.append("location[pincode]", formData.location?.pincode || '');
      
      // Append all images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await apiPut(`api/properties/${property._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Property updated",
        description: "The property details were successfully updated.",
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Clean up preview URLs
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleChange("title", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={(e) => handleChange("price", e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              rows={3} 
              value={formData.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
                placeholder="Number of bedrooms"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Project Status</Label>
              <Select
                value={formData.projectStatus}
                onValueChange={(val) => handleChange("projectStatus", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="New Launch">New Launch</SelectItem>
                  <SelectItem value="Partially Ready To Move">Partially Ready To Move</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(val) => handleChange("propertyType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => handleChange("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {subcategories.length > 0 && (
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={(val) => handleChange("subcategory", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub, index) => (
                    <SelectItem key={index} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={formData.location?.address || ""} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { 
                    ...formData.location, 
                    address: e.target.value 
                  } 
                })} 
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                value={formData.location?.city || ""} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { 
                    ...formData.location, 
                    city: e.target.value 
                  } 
                })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={formData.location?.country || ""}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={formData.location?.state || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      state: value,
                    },
                  })
                }
                disabled={loadingStates || !formData.location?.country}
              >
                <SelectTrigger>
                  {loadingStates ? (
                    <span>Loading states...</span>
                  ) : (
                    <SelectValue placeholder="Select state" />
                  )}
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input 
                type="number" 
                value={formData.location?.pincode || ""} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { 
                    ...formData.location, 
                    pincode: e.target.value 
                  } 
                })} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            
            <div className="flex flex-wrap gap-3">
              {/* Existing images */}
              {formData.images.map((img: string, index: number) => (
                <div key={`existing-${index}`} className="relative group">
                  <img 
                    src={img} 
                    alt={`Existing ${index+1}`} 
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    Existing
                  </div>
                </div>
              ))}
              
              {/* New image previews */}
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index+1}`} 
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {/* Upload button */}
              <div className="relative">
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <Label 
                  htmlFor="image-upload" 
                  className="border border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center p-4 gap-2 w-24 h-24"
                >
                  <ImageIcon className="w-6 h-6 text-gray-500" />
                  <span className="text-xs text-center">Upload</span>
                </Label>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              {imageFiles.length > 0 
                ? `${imageFiles.length} new image(s) selected` 
                : formData.images.length > 0 
                  ? "Using existing images" 
                  : "No images selected"}
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};