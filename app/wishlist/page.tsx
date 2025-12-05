"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WishlistItem {
  _id?: string;
  product: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  addedAt: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch wishlist data
  useEffect(() => {
    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist");

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setIsUpdating(productId);
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      setWishlistItems(data.items);
      toast.success("Item removed from wishlist");

      // Trigger wishlist update event for other components
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(null);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      setIsUpdating(item.product);

      // Check stock
      if (item.stock <= 0) {
        toast.error("This item is out of stock");
        return;
      }

      // Add to cart
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.product,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      toast.success("Added to cart");

      // Trigger cart update event for navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsUpdating(null);
    }
  };

  const addAllToCart = async () => {
    try {
      setIsUpdating("all");

      const inStockItems = wishlistItems.filter((item) => item.stock > 0);

      if (inStockItems.length === 0) {
        toast.error("No items in stock");
        return;
      }

      // Add all items to cart
      const promises = inStockItems.map((item) =>
        fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.product,
            quantity: 1,
          }),
        })
      );

      const results = await Promise.allSettled(promises);

      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successCount > 0) {
        toast.success(`Added ${successCount} item${successCount > 1 ? "s" : ""} to cart`);
        window.dispatchEvent(new Event("cartUpdated"));
      }

      if (failCount > 0) {
        toast.error(`Failed to add ${failCount} item${failCount > 1 ? "s" : ""}`);
      }
    } catch (error) {
      console.error("Error adding all to cart:", error);
      toast.error("Failed to add items to cart");
    } finally {
      setIsUpdating(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold tracking-tight">My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <Button
                onClick={addAllToCart}
                disabled={isUpdating === "all"}
                size="lg"
              >
                {isUpdating === "all" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                Add All to Cart
              </Button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card
                  key={item._id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-square">
                    <Link href={`/products/${item.product}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(item.product)}
                      disabled={isUpdating === item.product}
                    >
                      {isUpdating === item.product ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                    {item.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <p className="text-white font-semibold text-lg">
                          Out of Stock
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <Link
                        href={`/products/${item.product}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => addToCart(item)}
                      disabled={item.stock <= 0 || isUpdating === item.product}
                    >
                      {isUpdating === item.product ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
