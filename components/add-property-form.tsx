// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { useToast } from "@/hooks/use-toast";
// // import { apiPost } from "@/lib/axiosInstance";
// // import { Loader2 } from "lucide-react";
// // import { useCategories } from "@/app/context/CategoryContext";

// // export function AddPropertyForm() {
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     price: "",
// //     propertyType: "",
// //     category: "",
// //     subcategory: "",
// //     address: "",
// //     city: "",
// //     state: "",
// //     country: "India", // Set default country to India
// //     pincode: "",
// //     bedrooms: "",
// //     projectStatus: "",
// //   });

// //   const [imageFiles, setImageFiles] = useState<File[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isLoadingCountries, setIsLoadingCountries] = useState(true);
// //   const [isLoadingStates, setIsLoadingStates] = useState(false);
// //   const [countries, setCountries] = useState<any[]>([]);
// //   const [states, setStates] = useState<any[]>([]);
// //   const { toast } = useToast();
  
// //   // Use category context
// //   const { categories } = useCategories();
// //   const [subcategories, setSubcategories] = useState<string[]>([]);

// //   // Fetch countries on mount
// //   useEffect(() => {
// //     const fetchCountries = async () => {
// //       try {
// //         const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
// //         const data = await response.json();
        
// //         // Sort countries alphabetically
// //         const sortedCountries = data.sort((a: any, b: any) => 
// //           a.name.common.localeCompare(b.name.common)
// //         );
        
// //         setCountries(sortedCountries);
// //       } catch (error) {
// //         console.error("Error fetching countries:", error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to load countries",
// //           variant: "destructive",
// //         });
// //       } finally {
// //         setIsLoadingCountries(false);
// //       }
// //     };

// //     fetchCountries();
// //   }, []);

// //   // Fetch states when country changes
// //   useEffect(() => {
// //     const fetchStates = async () => {
// //       if (!formData.country) return;
      
// //       setIsLoadingStates(true);
// //       try {
// //         const response = await fetch(
// //           "https://countriesnow.space/api/v0.1/countries/states",
// //           {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //               country: formData.country
// //             }),
// //           }
// //         );
        
// //         const data = await response.json();
// //         if (data.error === false && data.data?.states) {
// //           setStates(data.data.states);
// //           // Reset state when country changes
// //           setFormData(prev => ({ ...prev, state: "" }));
// //         } else {
// //           setStates([]);
// //           toast({
// //             title: "Error",
// //             description: data.msg || "Failed to load states",
// //             variant: "destructive",
// //           });
// //         }
// //       } catch (error) {
// //         console.error("Error fetching states:", error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to load states",
// //           variant: "destructive",
// //         });
// //       } finally {
// //         setIsLoadingStates(false);
// //       }
// //     };

// //     if (formData.country) {
// //       fetchStates();
// //     }
// //   }, [formData.country]);

// //   const handleInputChange = (field: string, value: string) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: value,
// //     }));

// //     if (field === "category") {
// //       const selected = categories.find(cat => cat._id === value);
// //       setSubcategories(selected?.subcategories || []);
// //       setFormData(prev => ({ ...prev, subcategory: "" }));
// //     }
// //   };

// //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files) {
// //       setImageFiles(Array.from(e.target.files));
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsLoading(true);

// //     try {
// //       const formDataToSend = new FormData();
      
// //       // Append core property data
// //       formDataToSend.append("title", formData.title);
// //       formDataToSend.append("description", formData.description);
// //       formDataToSend.append("price", formData.price);
// //       formDataToSend.append("propertyType", formData.propertyType);
// //       formDataToSend.append("category", formData.category);
// //       formDataToSend.append("bedrooms", formData.bedrooms);
// //       formDataToSend.append("projectStatus", formData.projectStatus);
      
// //       // Append subcategory if exists
// //       if (formData.subcategory) {
// //         formDataToSend.append("subcategory", formData.subcategory);
// //       }

// //       // Append location as nested object
// //       formDataToSend.append("location[address]", formData.address);
// //       formDataToSend.append("location[city]", formData.city);
// //       formDataToSend.append("location[state]", formData.state);
// //       formDataToSend.append("location[country]", formData.country);
// //       formDataToSend.append("location[pincode]", formData.pincode);
      
// //       // Append image files
// //       imageFiles.forEach(file => {
// //         formDataToSend.append("images", file);
// //       });

// //       const response = await apiPost("api/properties", formDataToSend, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //         },
// //       });

// //       // Check for success message from API
// //       if (response.data.message === "Property listed successfully") {
// //         toast({
// //           title: "Success",
// //           description: "Property added successfully!",
// //         });
// //         // Reset form
// //         setFormData({
// //           title: "",
// //           description: "",
// //           price: "",
// //           propertyType: "",
// //           category: "",
// //           subcategory: "",
// //           address: "",
// //           city: "",
// //           state: "",
// //           country: "India", // Reset to India
// //           pincode: "",
// //           bedrooms: "",
// //           projectStatus: "",
// //         });
// //         setImageFiles([]);
// //         setSubcategories([]);
// //       } else {
// //         toast({
// //           title: "Error",
// //           description: response.data.message || "Failed to add property",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error adding property:", error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to add property",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-3xl font-bold">Add New Property</h1>
// //         <p className="text-muted-foreground">Create a new property listing</p>
// //       </div>

// //       <Card className="max-w-2xl">
// //         <CardHeader>
// //           <CardTitle>Property Details</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="title">Title</Label>
// //                 <Input
// //                   id="title"
// //                   value={formData.title}
// //                   onChange={(e) => handleInputChange("title", e.target.value)}
// //                   placeholder="Property title"
// //                   required
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="price">Price (₹)</Label>
// //                 <Input
// //                   id="price"
// //                   type="number"
// //                   value={formData.price}
// //                   onChange={(e) => handleInputChange("price", e.target.value)}
// //                   placeholder="Property price"
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="description">Description</Label>
// //               <Textarea
// //                 id="description"
// //                 value={formData.description}
// //                 onChange={(e) => handleInputChange("description", e.target.value)}
// //                 placeholder="Property description"
// //                 rows={3}
// //                 required
// //               />
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label>Property Type</Label>
// //                 <Select
// //                   value={formData.propertyType}
// //                   onValueChange={(value) => handleInputChange("propertyType", value)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select property type" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="Villa">Villa</SelectItem>
// //                     <SelectItem value="Apartment">Apartment</SelectItem>
// //                     <SelectItem value="House">House</SelectItem>
// //                     <SelectItem value="Plot">Plot</SelectItem>
// //                     <SelectItem value="Commercial">Commercial</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>Category</Label>
// //                 <Select
// //                   value={formData.category}
// //                   onValueChange={(value) => handleInputChange("category", value)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select category" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {categories?.map((category) => (
// //                       <SelectItem key={category._id} value={category._id}>
// //                         {category?.name}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             {subcategories.length > 0 && (
// //               <div className="space-y-2">
// //                 <Label>Subcategory</Label>
// //                 <Select
// //                   value={formData.subcategory}
// //                   onValueChange={(value) => handleInputChange("subcategory", value)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select subcategory" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {subcategories.map((sub, index) => (
// //                       <SelectItem key={index} value={sub}>
// //                         {sub}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             )}
            
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="bedrooms">Bedrooms</Label>
// //                 <Input
// //                   id="bedrooms"
// //                   type="number"
// //                   value={formData.bedrooms}
// //                   onChange={(e) => handleInputChange("bedrooms", e.target.value)}
// //                   placeholder="Number of bedrooms"
// //                   required
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>Project Status</Label>
// //                 <Select
// //                   value={formData.projectStatus}
// //                   onValueChange={(value) => handleInputChange("projectStatus", value)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select project status" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="Under Construction">Under Construction</SelectItem>
// //                     <SelectItem value="Ready to Move">Ready to Move</SelectItem>
// //                     <SelectItem value="New Launch">New Launch</SelectItem>
// //                     <SelectItem value="Partially Ready To Move">Partially Ready To Move</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div className="space-y-4">
// //               <Label className="text-base font-medium">Location</Label>
              
// //               <div className="space-y-2">
// //                 <Label htmlFor="address">Address</Label>
// //                 <Input
// //                   id="address"
// //                   value={formData.address}
// //                   onChange={(e) => handleInputChange("address", e.target.value)}
// //                   placeholder="Street address"
// //                   required
// //                 />
// //               </div>
              
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Country</Label>
// //                   {isLoadingCountries ? (
// //                     <div className="flex items-center justify-center h-10 border rounded-md">
// //                       <Loader2 className="h-5 w-5 animate-spin" />
// //                     </div>
// //                   ) : (
// //                     <Select
// //                       value={formData.country}
// //                       onValueChange={(value) => handleInputChange("country", value)}
// //                     >
// //                       <SelectTrigger>
// //                         <SelectValue placeholder="Select country" />
// //                       </SelectTrigger>
// //                       <SelectContent className="max-h-60 overflow-y-auto">
// //                         {countries.map((country, index) => (
// //                           <SelectItem key={index} value={country.name.common}>
// //                             {country.name.common}
// //                           </SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   )}
// //                 </div>
                
// //                 <div className="space-y-2">
// //                   <Label>State</Label>
// //                   {isLoadingStates ? (
// //                     <div className="flex items-center justify-center h-10 border rounded-md">
// //                       <Loader2 className="h-5 w-5 animate-spin" />
// //                     </div>
// //                   ) : states.length > 0 ? (
// //                     <Select
// //                       value={formData.state}
// //                       onValueChange={(value) => handleInputChange("state", value)}
// //                     >
// //                       <SelectTrigger>
// //                         <SelectValue placeholder="Select state" />
// //                       </SelectTrigger>
// //                       <SelectContent className="max-h-60 overflow-y-auto">
// //                         {states.map((state, index) => (
// //                           <SelectItem key={index} value={state.name}>
// //                             {state.name}
// //                           </SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   ) : (
// //                     <Input
// //                       value={formData.state}
// //                       onChange={(e) => handleInputChange("state", e.target.value)}
// //                       placeholder="State"
// //                       required
// //                     />
// //                   )}
// //                 </div>
                
// //                 <div className="space-y-2">
// //                   <Label htmlFor="city">City</Label>
// //                   <Input
// //                     id="city"
// //                     value={formData.city}
// //                     onChange={(e) => handleInputChange("city", e.target.value)}
// //                     placeholder="City"
// //                     required
// //                   />
// //                 </div>
                
// //                 <div className="space-y-2">
// //                   <Label htmlFor="pincode">Pincode</Label>
// //                   <Input
// //                     id="pincode"
// //                     type="number"
// //                     value={formData.pincode}
// //                     onChange={(e) => handleInputChange("pincode", e.target.value)}
// //                     placeholder="Pincode"
// //                     required
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="images">Property Images</Label>
// //              <Input 
// //   id="images"
// //   type="file"
// //   multiple
// //   onChange={handleImageChange}
// //   accept="image/*"
// // />{imageFiles.length > 0 && (
// //   <div className="flex gap-2 flex-wrap mt-2">
// //     {imageFiles.map((file, index) => (
// //       <img
// //         key={index}
// //         src={URL.createObjectURL(file)}
// //         alt={`preview-${index}`}
// //         className="w-24 h-24 object-cover rounded border"
// //       />
// //     ))}
// //   </div>
// // )}


// //               {imageFiles.length > 0 && (
// //                 <p className="text-sm text-muted-foreground">
// //                   {imageFiles.length} file(s) selected
// //                 </p>
// //               )}
// //             </div>

// //             <Button type="submit" className="w-full" disabled={isLoading}>
// //               {isLoading ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Adding Property...
// //                 </>
// //               ) : (
// //                 "Add Property"
// //               )}
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }





// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { apiPost } from "@/lib/axiosInstance";
// import { Loader2 } from "lucide-react";
// import { useCategories } from "@/app/context/CategoryContext";

// export function AddPropertyForm() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     price: "",
//     propertyType: "",
//     category: "",
//     subcategories: [] as string[], // 👈 changed to array
//     address: "",
//     city: "",
//     state: "",
//     country: "India",
//     pincode: "",
//     bedrooms: "",
//     projectStatus: "",
//   });

//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingCountries, setIsLoadingCountries] = useState(true);
//   const [isLoadingStates, setIsLoadingStates] = useState(false);
//   const [countries, setCountries] = useState<any[]>([]);
//   const [states, setStates] = useState<any[]>([]);
//   const { toast } = useToast();
//   const { categories } = useCategories();
//   const [subcategories, setSubcategories] = useState<string[]>([]);

//   // Fetch countries on mount
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
//         const data = await response.json();
//         const sortedCountries = data.sort((a: any, b: any) =>
//           a.name.common.localeCompare(b.name.common)
//         );
//         setCountries(sortedCountries);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load countries",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoadingCountries(false);
//       }
//     };
//     fetchCountries();
//   }, []);

//   // Fetch states when country changes
//   useEffect(() => {
//     const fetchStates = async () => {
//       if (!formData.country) return;
//       setIsLoadingStates(true);
//       try {
//         const response = await fetch(
//           "https://countriesnow.space/api/v0.1/countries/states",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ country: formData.country }),
//           }
//         );
//         const data = await response.json();
//         if (data.error === false && data.data?.states) {
//           setStates(data.data.states);
//           setFormData((prev) => ({ ...prev, state: "" }));
//         } else {
//           setStates([]);
//           toast({
//             title: "Error",
//             description: data.msg || "Failed to load states",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching states:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load states",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoadingStates(false);
//       }
//     };
//     if (formData.country) {
//       fetchStates();
//     }
//   }, [formData.country]);

//   const handleInputChange = (field: string, value: string) => {
//     if (field === "category") {
//       const selected = categories.find((cat) => cat._id === value);
//       setSubcategories(selected?.subcategories || []);
//       setFormData((prev) => ({
//         ...prev,
//         category: value,
//         subcategories: [], // reset when category changes
//       }));
//       return;
//     }

//     if (field === "subcategory") {
//       setFormData((prev) => ({
//         ...prev,
//         subcategories: [value], // always wrap in array
//       }));
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImageFiles(Array.from(e.target.files));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("propertyType", formData.propertyType);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("bedrooms", formData.bedrooms);
//       formDataToSend.append("projectStatus", formData.projectStatus);

//     if (formData.subcategories.length > 0) {
//   formData.subcategories.forEach((sub) => {
//     formDataToSend.append("subcategories", sub);
//   });
// }


//       formDataToSend.append("location[address]", formData.address);
//       formDataToSend.append("location[city]", formData.city);
//       formDataToSend.append("location[state]", formData.state);
//       formDataToSend.append("location[country]", formData.country);
//       formDataToSend.append("location[pincode]", formData.pincode);

//       imageFiles.forEach((file) => {
//         formDataToSend.append("images", file);
//       });

//       const response = await apiPost("api/properties", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data.message === "Property listed successfully") {
//         toast({ title: "Success", description: "Property added successfully!" });
//         setFormData({
//           title: "",
//           description: "",
//           price: "",
//           propertyType: "",
//           category: "",
//           subcategories: [],
//           address: "",
//           city: "",
//           state: "",
//           country: "India",
//           pincode: "",
//           bedrooms: "",
//           projectStatus: "",
//         });
//         setImageFiles([]);
//         setSubcategories([]);
//       } else {
//         toast({
//           title: "Error",
//           description: response.data.message || "Failed to add property",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error adding property:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add property",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Add New Property</h1>
//         <p className="text-muted-foreground">Create a new property listing</p>
//       </div>

//       <Card className="max-w-2xl">
//         <CardHeader>
//           <CardTitle>Property Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title + Price */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   placeholder="Property title"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="price">Price (₹)</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => handleInputChange("price", e.target.value)}
//                   placeholder="Property price"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => handleInputChange("description", e.target.value)}
//                 placeholder="Property description"
//                 rows={3}
//                 required
//               />
//             </div>

//             {/* Type + Category */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Property Type</Label>
//                 <Select
//                   value={formData.propertyType}
//                   onValueChange={(value) => handleInputChange("propertyType", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select property type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Villa">Villa</SelectItem>
//                     <SelectItem value="Apartment">Apartment</SelectItem>
//                     <SelectItem value="House">House</SelectItem>
//                     <SelectItem value="Plot">Plot</SelectItem>
//                     <SelectItem value="Commercial">Commercial</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Category</Label>
//                 <Select
//                   value={formData.category}
//                   onValueChange={(value) => handleInputChange("category", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories?.map((category) => (
//                       <SelectItem key={category._id} value={category._id}>
//                         {category?.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Subcategories */}
//             {subcategories.length > 0 && (
//               <div className="space-y-2">
//                 <Label>Subcategory</Label>
//                 <Select
//                   value={formData.subcategories[0] || ""}
//                   onValueChange={(value) => handleInputChange("subcategory", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select subcategory" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {subcategories.map((sub, index) => (
//                       <SelectItem key={index} value={sub}>
//                         {sub}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {/* Bedrooms + Status */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="bedrooms">Bedrooms</Label>
//                 <Input
//                   id="bedrooms"
//                   type="number"
//                   value={formData.bedrooms}
//                   onChange={(e) => handleInputChange("bedrooms", e.target.value)}
//                   placeholder="Number of bedrooms"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Project Status</Label>
//                 <Select
//                   value={formData.projectStatus}
//                   onValueChange={(value) => handleInputChange("projectStatus", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select project status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Under Construction">Under Construction</SelectItem>
//                     <SelectItem value="Ready to Move">Ready to Move</SelectItem>
//                     <SelectItem value="New Launch">New Launch</SelectItem>
//                     <SelectItem value="Partially Ready To Move">
//                       Partially Ready To Move
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="space-y-4">
//               <Label className="text-base font-medium">Location</Label>
//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Input
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => handleInputChange("address", e.target.value)}
//                   placeholder="Street address"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Country</Label>
//                   {isLoadingCountries ? (
//                     <div className="flex items-center justify-center h-10 border rounded-md">
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                     </div>
//                   ) : (
//                     <Select
//                       value={formData.country}
//                       onValueChange={(value) => handleInputChange("country", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent className="max-h-60 overflow-y-auto">
//                         {countries.map((country, index) => (
//                           <SelectItem key={index} value={country.name.common}>
//                             {country.name.common}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label>State</Label>
//                   {isLoadingStates ? (
//                     <div className="flex items-center justify-center h-10 border rounded-md">
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                     </div>
//                   ) : states.length > 0 ? (
//                     <Select
//                       value={formData.state}
//                       onValueChange={(value) => handleInputChange("state", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent className="max-h-60 overflow-y-auto">
//                         {states.map((state, index) => (
//                           <SelectItem key={index} value={state.name}>
//                             {state.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     <Input
//                       value={formData.state}
//                       onChange={(e) => handleInputChange("state", e.target.value)}
//                       placeholder="State"
//                       required
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="city">City</Label>
//                   <Input
//                     id="city"
//                     value={formData.city}
//                     onChange={(e) => handleInputChange("city", e.target.value)}
//                     placeholder="City"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="pincode">Pincode</Label>
//                   <Input
//                     id="pincode"
//                     type="number"
//                     value={formData.pincode}
//                     onChange={(e) => handleInputChange("pincode", e.target.value)}
//                     placeholder="Pincode"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Images */}
//             <div className="space-y-2">
//               <Label htmlFor="images">Property Images</Label>
//               <Input
//                 id="images"
//                 type="file"
//                 multiple
//                 onChange={handleImageChange}
//                 accept="image/*"
//               />
//               {imageFiles.length > 0 && (
//                 <div className="flex gap-2 flex-wrap mt-2">
//                   {imageFiles.map((file, index) => (
//                     <img
//                       key={index}
//                       src={URL.createObjectURL(file)}
//                       alt={`preview-${index}`}
//                       className="w-24 h-24 object-cover rounded border"
//                     />
//                   ))}
//                 </div>
//               )}
//               {imageFiles.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   {imageFiles.length} file(s) selected
//                 </p>
//               )}
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Adding Property...
//                 </>
//               ) : (
//                 "Add Property"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/app/context/CategoryContext";

export function AddPropertyForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "",
    category: "",
    subcategories: [] as string[],
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    bedrooms: "",
    projectStatus: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const { toast } = useToast();
  const { categories } = useCategories();
  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        const sortedCountries = data.sort((a: any, b: any) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast({
          title: "Error",
          description: "Failed to load countries",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) return;
      setIsLoadingStates(true);
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ country: formData.country }),
          }
        );
        const data = await response.json();
        if (data.error === false && data.data?.states) {
          setStates(data.data.states);
          setFormData((prev) => ({ ...prev, state: "" }));
        } else {
          setStates([]);
          toast({
            title: "Error",
            description: data.msg || "Failed to load states",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        toast({
          title: "Error",
          description: "Failed to load states",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStates(false);
      }
    };
    if (formData.country) {
      fetchStates();
    }
  }, [formData.country]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "category") {
      const selected = categories.find((cat) => cat._id === value);
      setSubcategories(selected?.subcategories || []);
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategories: [], // reset
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubcategoryChange = (sub: string, checked: boolean) => {
    setFormData((prev) => {
      let updated = [...prev.subcategories];
      if (checked) {
        updated.push(sub);
      } else {
        updated = updated.filter((s) => s !== sub);
      }
      return { ...prev, subcategories: updated };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("propertyType", formData.propertyType);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("bedrooms", formData.bedrooms);
      formDataToSend.append("projectStatus", formData.projectStatus);

      if (formData.subcategories.length > 0) {
        formData.subcategories.forEach((sub) => {
          formDataToSend.append("subcategories", sub);
        });
      }

      formDataToSend.append("location[address]", formData.address);
      formDataToSend.append("location[city]", formData.city);
      formDataToSend.append("location[state]", formData.state);
      formDataToSend.append("location[country]", formData.country);
      formDataToSend.append("location[pincode]", formData.pincode);

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await apiPost("api/properties", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.message === "Property listed successfully") {
        toast({ title: "Success", description: "Property added successfully!" });
        setFormData({
          title: "",
          description: "",
          price: "",
          propertyType: "",
          category: "",
          subcategories: [],
          address: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
          bedrooms: "",
          projectStatus: "",
        });
        setImageFiles([]);
        setSubcategories([]);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add property",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground">Create a new property listing</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Property title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Property price"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Property description"
                rows={3}
                required
              />
            </div>

            {/* Type + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
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
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ✅ Multiple Subcategories (checkboxes) */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Subcategories</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {subcategories.map((sub, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`sub-${index}`}
                        checked={formData.subcategories.includes(sub)}
                        onChange={(e) =>
                          handleSubcategoryChange(sub, e.target.checked)
                        }
                      />
                      <label htmlFor={`sub-${index}`} className="text-sm">
                        {sub}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bedrooms + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  placeholder="Number of bedrooms"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Project Status</Label>
                <Select
                  value={formData.projectStatus}
                  onValueChange={(value) => handleInputChange("projectStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under Construction">Under Construction</SelectItem>
                    <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                    <SelectItem value="New Launch">New Launch</SelectItem>
                    <SelectItem value="Partially Ready To Move">
                      Partially Ready To Move
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Location</Label>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  {isLoadingCountries ? (
                    <div className="flex items-center justify-center h-10 border rounded-md">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {countries.map((country, index) => (
                          <SelectItem key={index} value={country.name.common}>
                            {country.name.common}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  {isLoadingStates ? (
                    <div className="flex items-center justify-center h-10 border rounded-md">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : states.length > 0 ? (
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {states.map((state, index) => (
                          <SelectItem key={index} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    type="number"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label htmlFor="images">Property Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
              {imageFiles.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {imageFiles.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {imageFiles.length} file(s) selected
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Property...
                </>
              ) : (
                "Add Property"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
