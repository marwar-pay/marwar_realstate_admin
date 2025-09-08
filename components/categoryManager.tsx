"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/axiosInstance";

export function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", subcategoryInput: "", subcategories: [] });
  const [editingCategory, setEditingCategory] = useState(null);
  const { toast } = useToast();

  const API_BASE = "api/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiGet(API_BASE);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddSubcategory = () => {
    const trimmed = editingCategory 
      ? editingCategory.subcategoryInput?.trim() 
      : newCategory.subcategoryInput?.trim();

    if (trimmed) {
      if (editingCategory) {
        setEditingCategory((prev) => ({
          ...prev,
          subcategories: [...(prev.subcategories || []), trimmed],
          subcategoryInput: "",
        }));
      } else {
        setNewCategory((prev) => ({
          ...prev,
          subcategories: [...(prev.subcategories || []), trimmed],
          subcategoryInput: "",
        }));
      }
    }
  };

  const handleRemoveSubcategory = (index) => {
    if (editingCategory) {
      const updated = [...editingCategory.subcategories];
      updated.splice(index, 1);
      setEditingCategory({ ...editingCategory, subcategories: updated });
    } else {
      const updated = [...newCategory.subcategories];
      updated.splice(index, 1);
      setNewCategory({ ...newCategory, subcategories: updated });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    const payload = {
      name: newCategory.name,
      subcategories: newCategory.subcategories,
    };

    try {
      await apiPost(API_BASE, payload);
      toast({ title: "Success", description: "Category created" });
      setNewCategory({ name: "", subcategoryInput: "", subcategories: [] });
      fetchCategories();
    } catch (error) {
      console.error("Create error:", error);
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({
      ...category,
      subcategoryInput: "",
      subcategories: category.subcategories || [],
    });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }

    const payload = {
      name: editingCategory.name,
      subcategories: editingCategory.subcategories,
    };

    try {
      await apiPut(`${API_BASE}/${editingCategory._id}`, payload);
      toast({ title: "Success", description: "Category updated" });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Update error:", error);
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await apiDelete(`${API_BASE}/${id}`);
      toast({ title: "Success", description: "Category deleted" });
      fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Category Manager</h2>

      {/* Create or Edit Form */}
      <div className="space-y-4 max-w-xl border p-4 rounded-md">
        <h3 className="text-xl font-semibold">{editingCategory ? "Edit Category" : "Create Category"}</h3>
        <div className="space-y-2">
          <Label>Category Name</Label>
          <Input
            value={editingCategory ? editingCategory.name : newCategory.name}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, name: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
            placeholder="e.g. Residential"
          />
        </div>

        <div className="space-y-2">
          <Label>Subcategory</Label>
          <div className="flex gap-2">
            <Input
              value={editingCategory ? editingCategory.subcategoryInput || "" : newCategory.subcategoryInput}
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({ ...editingCategory, subcategoryInput: e.target.value })
                  : setNewCategory({ ...newCategory, subcategoryInput: e.target.value })
              }
              placeholder="e.g. Apartment"
            />
            <Button type="button" onClick={handleAddSubcategory}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(editingCategory ? editingCategory.subcategories : newCategory.subcategories)?.map((sub, i) => (
              <div key={i} className="flex items-center gap-1 border px-2 py-1 rounded bg-gray-100">
                {sub}
                <button
                  type="button"
                  onClick={() => handleRemoveSubcategory(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {editingCategory ? (
            <>
              <Button onClick={handleUpdateCategory}>Update</Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateCategory}>Create</Button>
          )}
        </div>
      </div>

      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Subcategories</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td className="border px-4 py-2" colSpan={3}>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="border px-4 py-2">{cat.name}</td>
                  <td className="border px-4 py-2">{cat.subcategories?.join(", ") || "—"}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Button size="sm" onClick={() => handleEditCategory(cat)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(cat._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
