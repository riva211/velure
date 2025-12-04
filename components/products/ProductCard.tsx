"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useMarket } from "@/components/market-provider";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    priceINR: number;
    priceUSD: number;
    category: string;
    images: string[];
    stock: number;
    averageRating: number;
    numReviews: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const { market, currencySymbol } = useMarket();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!session?.user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          market,
        }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          error = { error: "Server error - invalid response format" };
        }

        console.error("Server error:", error);

        // Show specific error message
        if (error.error === "Product not found") {
          toast.error("Product not found in database", {
            description: "Please seed the database first. Visit /seed-database"
          });
        } else if (error.error === "Unauthorized") {
          toast.error("Please login to continue");
          router.push("/login");
        } else {
          toast.error(error.error || "Failed to add to cart");
        }
        throw new Error(error.error || "Failed to add to cart");
      }

      toast.success("Added to cart!");

      // Trigger a refresh of cart count in navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
    console.log("Toggle wishlist:", product._id);
  };

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
              isWishlisted ? "text-red-500" : ""
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart
              className="h-4 w-4"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </Button>
          {product.stock === 0 && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              Only {product.stock} left
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.numReviews})
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{currencySymbol}{" "}{market === "IN" ? product.priceINR?.toFixed(2) : product.priceUSD?.toFixed(2)}</p>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
