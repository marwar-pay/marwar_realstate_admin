'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '@/lib/axiosInstance';
import { 
  Users, 
  UserX, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Address {
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  mobileNumber: string;
  memberType: string;
  address?: Address;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet('api/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError('Failed to load user data. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address?: Address) => {
    if (!address) return 'N/A';
    
    const { area, city, state, country, pincode } = address;
    const parts = [area, city, state, country].filter(Boolean);
    return `${parts.join(', ')}${pincode ? ` - ${pincode}` : ''}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(userId);
      await apiDelete(`api/admin/users/${userId}`);
      
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error('Failed to delete user. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-12 rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-destructive flex flex-col items-center">
              <AlertCircle className="w-10 h-10 mb-2 stroke-current" />
              <p className="mb-4">{error}</p>
              <Button 
                onClick={fetchUsers}
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <TableRow key={user._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>@{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.isActive ? 'default' : 'destructive'} 
                          className="min-w-[70px] justify-center"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openUserModal(user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="text-red-500 hover:text-red-700"
                        >
                          {deletingId === user._id ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UserX className="w-10 h-10" />
                        <span>No users found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>User Details</span>
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

          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                  <p className="font-medium">{selectedUser.fullName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                  <p className="font-medium">@{selectedUser.userName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{selectedUser.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mobile</h3>
                  <p>{selectedUser.mobileNumber || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Member Type</h3>
                  <p>{selectedUser.memberType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                  <Badge 
                    variant={selectedUser.isActive ? 'default' : 'destructive'} 
                    className="mt-1"
                  >
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{formatAddress(selectedUser.address)}</p>
                </div>
              </div>
              
              <Separator className="md:col-span-2 my-2" />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p>{formatDate(selectedUser.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{formatDate(selectedUser.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                  <p>{formatDate(selectedUser.lastLogin) || 'N/A'}</p>
                </div>
              </div>
              
              <Separator className="md:col-span-2 my-2" />
              
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteUser(selectedUser._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
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

export default UserList;