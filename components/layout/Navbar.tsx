"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, Search, Heart, Store, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import type { Session } from "next-auth";

interface NavbarProps {
  serverSession?: Session | null;
}

export function Navbar({ serverSession }: NavbarProps = {}) {
  const { data: clientSession } = useSession();
  const session = serverSession ?? clientSession;
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch cart count
  useEffect(() => {
    if (session?.user) {
      fetchCartCount();
    } else {
      setCartItemsCount(0);
    }
  }, [session]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (session?.user) {
        fetchCartCount();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        const count = data.cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        setCartItemsCount(count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors relative group ${
          isActive("/") && !pathname?.includes("/products") && !pathname?.includes("/about")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Home
        {isActive("/") && !pathname?.includes("/products") && !pathname?.includes("/about") && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      <Link
        href="/products"
        className={`text-sm font-medium transition-colors relative group ${
          isActive("/products")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Products
        {isActive("/products") && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      <Link
        href="/about"
        className={`text-sm font-medium transition-colors relative group ${
          isActive("/about")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        About
        {isActive("/about") && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      {session?.user?.role === "admin" && (
        <Link
          href="/admin/dashboard"
          className={`text-sm font-medium transition-colors relative group ${
            isActive("/admin")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            Admin
          </span>
          {isActive("/admin") && (
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
          )}
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-seashell-500 rounded-lg p-1.5">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-seashell-600 to-parchment-500 bg-clip-text text-transparent">
              Velure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden sm:flex relative hover:bg-primary/10"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:bg-primary/10"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          <Store className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-destructive cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10"
                    />
                  </div>

                  {/* Mobile Nav Links */}
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive("/") && !pathname?.includes("/products") && !pathname?.includes("/about")
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive("/products") ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                    >
                      Products
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                    >
                      About
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      Cart
                      {mounted && cartItemsCount > 0 && (
                        <Badge variant="secondary">{cartItemsCount}</Badge>
                      )}
                    </Link>
                    {session?.user?.role === "admin" && (
                      <>
                        <div className="border-t pt-4 mt-4" />
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          className={`text-lg font-medium transition-colors ${
                            isActive("/admin") ? "text-primary" : "text-foreground hover:text-primary"
                          }`}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Mobile Auth */}
                  {!session && (
                    <div className="pt-4 border-t space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
