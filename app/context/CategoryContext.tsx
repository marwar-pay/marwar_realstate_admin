"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiGet } from '@/lib/axiosInstance';

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true,
  error: null,
  getCategoryById: () => undefined,
});

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGet('api/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Category API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id: string) => {
    return categories.find(category => category._id === id);
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, getCategoryById }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);