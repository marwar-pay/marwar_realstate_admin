 "use client"
 import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiGet } from '@/lib/axiosInstance';

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
  address?: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  getUserById: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType>({
  users: [],
  loading: true,
  error: null,
  getUserById: () => undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiGet('api/admin/users');
        setUsers(res.data.data || []);
      } catch (err) {
        setError('Failed to load users');
        console.error('User API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUserById = (id: string) => {
    return users.find(user => user._id === id);
  };

  return (
    <UserContext.Provider value={{ users, loading, error, getUserById }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);