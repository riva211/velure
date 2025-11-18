"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

// Mock product data
const productData = {
  _id: "1",
  name: "Premium Wireless Headphones",
  description:
    "Experience superior sound quality with our premium wireless headphones. Featuring advanced active noise cancellation technology, these headphones deliver an immersive audio experience perfect for music lovers and professionals alike.",
  price: 299.99,
  category: "Electronics",
  images: [
    "/placeholder-product.jpg",
    "/placeholder-product.jpg",
    "/placeholder-product.jpg",
  ],
  stock: 15,
  averageRating: 4.5,
  numReviews: 124,
  features: [
    "Active Noise Cancellation",
    "40-hour battery life",
    "Premium sound quality",
    "Comfortable over-ear design",
    "Bluetooth 5.0 connectivity",
  ],
  reviews: [
    {
      _id: "1",
      userName: "John Doe",
      rating: 5,
      comment: "Amazing sound quality! Worth every penny.",
      createdAt: new Date("2024-01-15"),
    },
    {
      _id: "2",
      userName: "Jane Smith",
      rating: 4,
      comment: "Great headphones, but a bit pricey.",
      createdAt: new Date("2024-01-10"),
    },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const handleAddToCart = () => {
    console.log("Add to cart:", productData._id, quantity);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= productData.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit review:", newReview);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productData.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2">{productData.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {productData.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(productData.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {productData.averageRating} ({productData.numReviews}{" "}
                    reviews)
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {formatPrice(productData.price)}
                </p>
              </div>

              <p className="text-muted-foreground">{productData.description}</p>

              {/* Stock Status */}
              <div>
                {productData.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600">
                    In Stock ({productData.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= productData.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={productData.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="reviews">
                Reviews ({productData.numReviews})
              </TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              {/* Write Review */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <Select
                      value={newReview.rating.toString()}
                      onValueChange={(value) =>
                        setNewReview({ ...newReview, rating: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Your Review</Label>
                    <Textarea
                      placeholder="Share your thoughts about this product..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              </div>

              {/* Existing Reviews */}
              <div className="space-y-4">
                {productData.reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="border rounded-lg p-6">
                <p className="text-muted-foreground">
                  Detailed specifications will be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
