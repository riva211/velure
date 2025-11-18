"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (registered === "true") {
      toast.success("Account created successfully!", {
        description: "Please sign in to continue",
      });
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error("Sign in failed", {
          description: result.error,
        });
      } else {
        toast.success("Welcome back!", {
          description: "Redirecting to your dashboard...",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-parchment-50 via-seashell-50 to-khaki-beige-50 dark:from-dark-coffee-950 dark:via-dim-grey-950 dark:to-khaki-beige-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-seashell-200/40 via-parchment-200/40 to-dark-coffee-200/40 dark:from-seashell-800/20 dark:via-parchment-800/20 dark:to-dark-coffee-800/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-linear-to-tr from-khaki-beige-200/40 via-dim-grey-200/40 to-parchment-200/40 dark:from-khaki-beige-800/20 dark:via-dim-grey-800/20 dark:to-parchment-800/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-linear-to-tl from-parchment-300/40 via-seashell-300/40 to-dark-coffee-300/40 dark:from-parchment-900/20 dark:via-seashell-900/20 dark:to-dark-coffee-900/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Main content container */}
      <div className="w-full max-w-6xl mx-4 lg:mx-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-parchment-50/90 dark:bg-dark-coffee-900/90 backdrop-blur-sm rounded-full border border-parchment-300/50 dark:border-dark-coffee-700/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-seashell-600 dark:text-seashell-400" />
              <span className="text-sm font-medium text-dark-coffee-800 dark:text-parchment-200">Welcome back to Velure</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-dark-coffee-900 dark:text-parchment-50 leading-tight">
              Your Style,<br />
              <span className="text-seashell-700 dark:text-seashell-300">
                Redefined
              </span>
            </h1>

            <p className="text-lg text-dim-grey-700 dark:text-dim-grey-300 leading-relaxed max-w-md">
              Access your personalized fashion journey, exclusive collections, and seamless shopping experience.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-parchment-50/70 dark:bg-dark-coffee-900/70 backdrop-blur-sm rounded-2xl border border-parchment-200/50 dark:border-dark-coffee-700/50">
              <div className="text-3xl font-bold text-dark-coffee-900 dark:text-parchment-50 mb-1">10K+</div>
              <div className="text-sm text-dim-grey-700 dark:text-dim-grey-300">Premium Products</div>
            </div>
            <div className="p-4 bg-parchment-50/70 dark:bg-dark-coffee-900/70 backdrop-blur-sm rounded-2xl border border-parchment-200/50 dark:border-dark-coffee-700/50">
              <div className="text-3xl font-bold text-dark-coffee-900 dark:text-parchment-50 mb-1">50K+</div>
              <div className="text-sm text-dim-grey-700 dark:text-dim-grey-300">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-seashell-700 dark:text-seashell-300 mb-2">
              Velure
            </h1>
            <p className="text-sm text-dim-grey-700 dark:text-dim-grey-300">Premium Fashion Store</p>
          </div>

          {/* Form Card */}
          <div className="bg-parchment-50/90 dark:bg-dark-coffee-900/90 backdrop-blur-xl rounded-3xl border border-parchment-200/50 dark:border-dark-coffee-700/50 shadow-2xl shadow-dark-coffee-900/10 dark:shadow-dark-coffee-950/50 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark-coffee-900 dark:text-parchment-50 mb-2">
                Welcome back
              </h2>
              <p className="text-dim-grey-700 dark:text-dim-grey-300">
                Sign in to continue your shopping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-dark-coffee-800 dark:text-parchment-200">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim-grey-500 group-focus-within:text-seashell-600 dark:group-focus-within:text-seashell-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-12 h-12 bg-white dark:bg-dark-coffee-950 border-parchment-300 dark:border-dark-coffee-700 focus:border-seashell-500 dark:focus:border-seashell-500 focus:ring-2 focus:ring-seashell-500/20 rounded-xl transition-all text-dark-coffee-900 dark:text-parchment-50 placeholder:text-dim-grey-400 dark:placeholder:text-dim-grey-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-dark-coffee-800 dark:text-parchment-200">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-seashell-600 hover:text-seashell-700 dark:text-seashell-400 dark:hover:text-seashell-300 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim-grey-500 group-focus-within:text-seashell-600 dark:group-focus-within:text-seashell-400 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-12 bg-white dark:bg-dark-coffee-950 border-parchment-300 dark:border-dark-coffee-700 focus:border-seashell-500 dark:focus:border-seashell-500 focus:ring-2 focus:ring-seashell-500/20 rounded-xl transition-all text-dark-coffee-900 dark:text-parchment-50 placeholder:text-dim-grey-400 dark:placeholder:text-dim-grey-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-seashell-600 via-dark-coffee-700 to-parchment-700 hover:from-seashell-700 hover:via-dark-coffee-800 hover:to-parchment-800 text-parchment-50 font-semibold rounded-xl shadow-lg shadow-dark-coffee-500/30 hover:shadow-xl hover:shadow-dark-coffee-500/40 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-parchment-300 dark:border-dark-coffee-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-parchment-50/90 dark:bg-dark-coffee-900/90 px-3 text-dim-grey-600 uppercase tracking-wider">
                    New here?
                  </span>
                </div>
              </div>

              <Link href="/signup" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-parchment-300 dark:border-dark-coffee-700 hover:border-seashell-500 dark:hover:border-seashell-500 hover:bg-seashell-50 dark:hover:bg-seashell-950/20 rounded-xl font-semibold transition-all duration-300 text-dark-coffee-800 dark:text-parchment-200"
                >
                  Create Account
                </Button>
              </Link>
            </form>

            <p className="text-center text-xs text-dim-grey-600 dark:text-dim-grey-400 mt-6">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-dark-coffee-800 dark:hover:text-parchment-200">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="underline hover:text-dark-coffee-800 dark:hover:text-parchment-200">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
