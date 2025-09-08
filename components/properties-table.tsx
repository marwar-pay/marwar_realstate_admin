"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { apiDelete, apiGet, apiPut } from "@/lib/axiosInstance"
import { PropertyDetailsModal } from "./PropertyDetailsModal"
import { EditPropertyModal } from "./editPropertyModal"

interface Property {
  _id: string
  title: string
  description: string
  price: number
  propertyType: string
  category?: string
  location: {
    address: string
    city: string
    state: string
    pincode: number
  }
  images: string[]
  createdAt: string
}

interface Category {
  _id: string
  name: string
}

export function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()
  const [viewProperty, setViewProperty] = useState<Property | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProperties(filtered)
  }, [searchTerm, properties])

  // const fetchAll = async () => {
  //   try {
  //     setIsLoading(true)
  //     const [propRes, catRes] = await Promise.all([
  //       apiGet("api/properties"),
  //       apiGet("api/categories"),
  //     ])
  //     const propData = propRes.data.properties || []
  //     const catData = catRes.data.categories || []
  //     setProperties(propData)
  //     setFilteredProperties(propData)
  //     setCategories(catData)
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch properties or categories",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }


  const fetchAll = async (page = 1) => {
  try {
    setIsLoading(true)
    const [propRes, catRes] = await Promise.all([
      apiGet(`api/properties?page=${page}&limit=10`),
      apiGet("api/categories"),
    ])
    const propData = propRes.data.properties || []
    const catData = catRes.data.categories || []

    setProperties(propData)
    setFilteredProperties(propData)
    setCategories(catData)
    setTotalPages(propRes.data.totalPages || 1)
    setCurrentPage(page)
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch properties or categories",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}


  const deleteProperty = async (id: string) => {
    try {
      await apiDelete(`api/properties/${id}`)
      toast({
        title: "Success",
        description: "Property deleted successfully",
      })
      fetchAll()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "N/A"
    const cat = categories.find((c) => c._id === categoryId)
    return cat ? cat.name : "N/A"
  }

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property)
    setEditModalOpen(true)
  }

  const handleUpdated = () => {
    fetchAll()
    setEditModalOpen(false)
    setSelectedProperty(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage all properties</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {property.images?.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title || "Property image"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.onerror = null
                                target.src = "/placeholder.svg"
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 text-xs text-center p-1">
                              N/A
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {property.title || "N/A"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {property.propertyType || "N/A"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge>
                          {getCategoryName(property.category)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {property.location 
                          ? `${property.location.city || "N/A"}, ${property.location.state || "N/A"}`
                          : "N/A"}
                      </TableCell>

                      <TableCell className="font-medium">
                        {property.price 
                          ? `₹${property.price.toLocaleString()}` 
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewProperty(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the property.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProperty(property._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Property Details Modal */}
      {viewProperty && (
        <PropertyDetailsModal
          property={viewProperty}
          onClose={() => setViewProperty(null)}
        />
      )}

      {/* Edit Property Modal */}
      {selectedProperty && (
        <EditPropertyModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSelectedProperty(null)
          }}
          property={selectedProperty}
          onUpdated={handleUpdated}
        />
      )}
      <div className="flex justify-end mt-4 space-x-2">
  <Button
    variant="outline"
    size="sm"
    disabled={currentPage === 1}
    onClick={() => fetchAll(currentPage - 1)}
  >
    Previous
  </Button>
  <span className="text-sm text-muted-foreground pt-2">
    Page {currentPage} of {totalPages}
  </span>
  <Button
    variant="outline"
    size="sm"
    disabled={currentPage === totalPages}
    onClick={() => fetchAll(currentPage + 1)}
  >
    Next
  </Button>
</div>

    </div>
    
  )
}