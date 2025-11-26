"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    productDetails: "",
    price: "",
    metal: "",
    category: "Rings",
    stock: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
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
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      toast.error("Please enter a valid price");
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
        body: JSON.stringify(newProduct),
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
        price: "",
        metal: "",
        category: "Rings",
        stock: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add product");
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Product
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Fill in the details below to add a new product to your inventory
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDetails" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Product Details <span className="text-red-500">*</span>
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
                    placeholder="Enter detailed product description, features, specifications, etc."
                    rows={5}
                    className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Product Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Product Images
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add 3-4 high-quality images from different angles
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image1" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Main Image <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image1"
                      value={newProduct.image1}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image1: e.target.value })
                      }
                      placeholder="https://example.com/image1.jpg"
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image2" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Image 2 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image2"
                      value={newProduct.image2}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image2: e.target.value })
                      }
                      placeholder="https://example.com/image2.jpg"
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image3" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Image 3 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image3"
                      value={newProduct.image3}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image3: e.target.value })
                      }
                      placeholder="https://example.com/image3.jpg"
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image4" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Image 4 <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="image4"
                      value={newProduct.image4}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image4: e.target.value })
                      }
                      placeholder="https://example.com/image4.jpg"
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                      className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Product Specifications Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Product Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metal" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Metal Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.metal}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, metal: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800">
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
                    <Label htmlFor="category" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800">
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
            </div>

            <DialogFooter className="border-t pt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                      <span>Stock: {product.stock}</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(product.price)}
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
                    <Button variant="ghost" size="icon">
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
