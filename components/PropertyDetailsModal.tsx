"use client"

import { Property } from "./types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Helper function to format location
const formatLocation = (location: Property['location']) => {
  const parts = [
    location?.address,
    location?.city,
    location?.state,
    location?.pincode && `- ${location.pincode}`,
    location?.country
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'NA';
};

export function PropertyDetailsModal({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={property.images?.[0] || "/placeholder.svg"}
              className="w-full sm:w-60 h-40 object-cover rounded"
              alt={property.title || "Property image"}
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">{property.title || "NA"}</h2>
              <p className="text-sm text-gray-500">
                {property.description || "No description available"}
              </p>
              
              <Badge variant="outline">
                {property.propertyType || "NA"}
              </Badge>
              
              <p className="text-sm">
                {property.price ? `₹${property.price.toLocaleString()}` : "NA"}
              </p>
              
              <p className="text-sm">
                Location: {formatLocation(property.location)}
              </p>
              
              <p className="text-sm">
                Created at: {property.createdAt 
                  ? new Date(property.createdAt).toLocaleString() 
                  : "NA"}
              </p>
              
              <p className="text-sm">
                Sold To: {property.soldTo || "NA"}
              </p>
              
              <p className={`text-sm font-medium ${property.isSold ? "text-red-600" : "text-green-600"}`}>
                Sold/Sale: {property.isSold ? "Sold" : "Sale"}
              </p>
              
              <p className="text-sm">
                Listed by: {property.listedBy?.fullName || "NA"}
              </p>
              
              <p className="text-sm">
                Email: {property.listedBy?.email || "NA"}
              </p>
              
              <p className={`text-sm font-medium ${property.isActive ? "text-green-600" : "text-red-600"}`}>
                {property.isActive ? "Active" : "Deactive"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}