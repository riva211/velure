"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Package, ImageIcon, DollarSign, Sparkles, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    productDetails: "",
    priceINR: "",
    priceUSD: "",
    metal: "",
    category: "Rings",
    stock: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    featured: false,
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!newProduct.productDetails.trim()) {
      toast.error("Product details are required");
      return;
    }
    if (!newProduct.priceINR || parseFloat(newProduct.priceINR) <= 0) {
      toast.error("Please enter a valid INR price");
      return;
    }
    if (!newProduct.priceUSD || parseFloat(newProduct.priceUSD) <= 0) {
      toast.error("Please enter a valid USD price");
      return;
    }
    if (!newProduct.metal) {
      toast.error("Please select a metal type");
      return;
    }
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (!newProduct.image1.trim() || !newProduct.image2.trim() || !newProduct.image3.trim()) {
      toast.error("Please provide at least 3 product images");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      toast.success("Product added successfully!");

      // Add the new product to the list
      setProducts([data.product, ...products]);

      // Reset form and close dialog
      setIsAddDialogOpen(false);
      setNewProduct({
        name: "",
        productDetails: "",
        priceINR: "",
     priceUSD: "",
        metal: "",
        category: "Rings",
        stock: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        featured: false,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add product");
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    productDetails: "",
    priceINR: "",
    priceUSD: "",
    metal: "",
    category: "Rings",
    stock: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    featured: false,
  });

  const openEditDialog = (product: any) => {
    setEditingProductId(product._id);
    setEditProduct({
      name: product.name || "",
      productDetails: product.description || "",
      priceINR: String(product.priceINR ?? ""),
      priceUSD: String(product.priceUSD ?? ""),
      metal: product.metal || "",
      category: product.category || "Rings",
      stock: String(product.stock ?? ""),
      image1: product.images?.[0] || "",
      image2: product.images?.[1] || "",
      image3: product.images?.[2] || "",
      image4: product.images?.[3] || "",
      featured: Boolean(product.featured),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;

    // Basic validation similar to add
    if (!editProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!editProduct.productDetails.trim()) {
      toast.error("Product details are required");
      return;
    }
    if (!editProduct.priceINR || parseFloat(editProduct.priceINR) <= 0) {
      toast.error("Please enter a valid INR price");
      return;
    }
    if (!editProduct.priceUSD || parseFloat(editProduct.priceUSD) <= 0) {
      toast.error("Please enter a valid USD price");
      return;
    }
    if (!editProduct.metal) {
      toast.error("Please select a metal type");
      return;
    }
    if (!editProduct.stock || parseInt(editProduct.stock) < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (!editProduct.image1.trim() || !editProduct.image2.trim() || !editProduct.image3.trim()) {
      toast.error("Please provide at least 3 product images");
      return;
    }

    try {
      const response = await fetch(`/api/products/${editingProductId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }
      toast.success("Product updated successfully!");
      // Update in local state
      setProducts((prev) => prev.map((p) => (p._id === editingProductId ? data.product : p)));
      setIsEditDialogOpen(false);
      setEditingProductId(null);
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border border-amber-200 bg-amber-50">
            <DialogHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    Add New Product
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-1">
                    Fill in the details to add a new product to your jewelry collection
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

           <div className="space-y-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              {/* Basic Information Section */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="e.g., Diamond Engagement Ring"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productDetails" className="text-sm font-medium">
                      Product Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="productDetails"
                      value={newProduct.productDetails}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          productDetails: e.target.value,
                        })
                      }
                      placeholder="Describe your product in detail - materials, craftsmanship, unique features..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images Section */}
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Product Images</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Add 3-4 high-quality images showcasing different angles of your product
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image1" className="text-sm font-medium">
                      Image 1 (Main) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image1"
                      value={newProduct.image1}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image1: e.target.value })
                      }
                      placeholder="https://example.com/image1.jpg"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image2" className="text-sm font-medium">
                      Image 2 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image2"
                      value={newProduct.image2}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image2: e.target.value })
                      }
                      placeholder="https://example.com/image2.jpg"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image3" className="text-sm font-medium">
                      Image 3 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image3"
                      value={newProduct.image3}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image3: e.target.value })
                      }
                      placeholder="https://example.com/image3.jpg"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image4" className="text-sm font-medium">
                      Image 4 <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="image4"
                      value={newProduct.image4}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image4: e.target.value })
                      }
                      placeholder="https://example.com/image4.jpg"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceINR" className="text-sm font-medium">
                      Price (₹ INR) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="priceINR"
                      type="number"
                      step="0.01"
                      value={newProduct.priceINR}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, priceINR: e.target.value })
                      }
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceUSD" className="text-sm font-medium">
                      Price ($ USD) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="priceUSD"
                      type="number"
                      step="0.01"
                      value={newProduct.priceUSD}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, priceUSD: e.target.value })
                      }
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      placeholder="0"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Product Specifications Section */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Product Specifications</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metal" className="text-sm font-medium">
                      Metal Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.metal}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, metal: value })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                        <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                        <SelectItem value="White Gold">White Gold</SelectItem>
                        <SelectItem value="Brass">Brass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rings">Rings</SelectItem>
                        <SelectItem value="Necklaces">Necklaces</SelectItem>
                        <SelectItem value="Earrings">Earrings</SelectItem>
                        <SelectItem value="Bracelets">Bracelets</SelectItem>
                        <SelectItem value="Anklets">Anklets</SelectItem>
                        <SelectItem value="Chains">Chains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Featured Product Section */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Display Settings</h3>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-100/60">
                  <Checkbox
                    id="featured"
                    checked={newProduct.featured}
                    onCheckedChange={(checked) =>
                      setNewProduct({ ...newProduct, featured: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="featured"
                      className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show as Featured Product
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Featured products will be displayed prominently in the featured section on the home page
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="min-w-24"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                className="min-w-24 bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white shadow-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border border-amber-200 bg-amber-50">
          <DialogHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
                <DialogDescription className="text-sm mt-1">Update product details and save changes</DialogDescription>
              </div>
            </div>
          </DialogHeader>

         <div className="space-y-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            {/* Basic Information Section */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name" className="text-sm font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit_name"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    placeholder="e.g., Diamond Engagement Ring"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_productDetails" className="text-sm font-medium">
                    Product Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="edit_productDetails"
                    value={editProduct.productDetails}
                    onChange={(e) => setEditProduct({ ...editProduct, productDetails: e.target.value })}
                    placeholder="Describe your product in detail - materials, craftsmanship, unique features..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Images Section */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Product Images</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Add 3-4 high-quality images showcasing different angles of your product</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_image1" className="text-sm font-medium">
                    Image 1 (Main) <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_image1" value={editProduct.image1} onChange={(e) => setEditProduct({ ...editProduct, image1: e.target.value })} placeholder="https://example.com/image1.jpg" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_image2" className="text-sm font-medium">
                    Image 2 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_image2" value={editProduct.image2} onChange={(e) => setEditProduct({ ...editProduct, image2: e.target.value })} placeholder="https://example.com/image2.jpg" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_image3" className="text-sm font-medium">
                    Image 3 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_image3" value={editProduct.image3} onChange={(e) => setEditProduct({ ...editProduct, image3: e.target.value })} placeholder="https://example.com/image3.jpg" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_image4" className="text-sm font-medium">
                    Image 4 <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input id="edit_image4" value={editProduct.image4} onChange={(e) => setEditProduct({ ...editProduct, image4: e.target.value })} placeholder="https://example.com/image4.jpg" className="h-11" />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_priceINR" className="text-sm font-medium">
                    Price (₹ INR) <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_priceINR" type="number" step="0.01" value={editProduct.priceINR} onChange={(e) => setEditProduct({ ...editProduct, priceINR: e.target.value })} placeholder="0.00" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_priceUSD" className="text-sm font-medium">
                    Price ($ USD) <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_priceUSD" type="number" step="0.01" value={editProduct.priceUSD} onChange={(e) => setEditProduct({ ...editProduct, priceUSD: e.target.value })} placeholder="0.00" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_stock" className="text-sm font-medium">
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input id="edit_stock" type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} placeholder="0" className="h-11" />
                </div>
              </div>
            </div>

            {/* Product Specifications Section */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Product Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_metal" className="text-sm font-medium">
                    Metal Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={editProduct.metal} onValueChange={(value) => setEditProduct({ ...editProduct, metal: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                      <SelectItem value="White Gold">White Gold</SelectItem>
                      <SelectItem value="Brass">Brass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={editProduct.category} onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rings">Rings</SelectItem>
                      <SelectItem value="Necklaces">Necklaces</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Bracelets">Bracelets</SelectItem>
                      <SelectItem value="Anklets">Anklets</SelectItem>
                      <SelectItem value="Chains">Chains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Display Settings</h3>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-100/60">
                <Checkbox id="edit_featured" checked={editProduct.featured} onCheckedChange={(checked) => setEditProduct({ ...editProduct, featured: checked as boolean })} className="mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="edit_featured" className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show as Featured Product</Label>
                  <p className="text-xs text-muted-foreground">Featured products will be displayed prominently in the featured section on the home page</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-6 gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="min-w-24">Cancel</Button>
            <Button onClick={handleUpdateProduct} className="min-w-24 bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white shadow-md">
              <Edit className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No products found matching your search"
                : "No products yet. Add your first product to get started!"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{product.name}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{product.category}</Badge>
                      {product.metal && <Badge variant="outline">{product.metal}</Badge>}
                      {product.featured && (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                          Featured
                        </Badge>
                      )}
                      <span>Stock: {product.stock}</span>
                      <span className="font-semibold text-foreground">
                        {`₹ ${product.priceINR?.toFixed(2)} • $ ${product.priceUSD?.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge
                      variant={
                        product.stock > 0 ? "default" : "destructive"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
