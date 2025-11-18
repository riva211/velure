"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Sparkles, CheckCircle2, ArrowRight, Shield, Truck, Gift } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are identical",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Sign up failed", {
          description: data.error || "Something went wrong",
        });
        return;
      }

      toast.success("Account created successfully!", {
        description: "Redirecting to login page...",
      });
      router.push("/login?registered=true");
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case "weak":
        return "w-1/3";
      case "medium":
        return "w-2/3";
      case "strong":
        return "w-full";
      default:
        return "w-0";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-parchment-50 via-seashell-50 to-khaki-beige-50 dark:from-dark-coffee-950 dark:via-dim-grey-950 dark:to-khaki-beige-950 relative overflow-hidden py-8">
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
              <span className="text-sm font-medium text-dark-coffee-800 dark:text-parchment-200">Join Velure today</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-dark-coffee-900 dark:text-parchment-50 leading-tight">
              Begin Your<br />
              <span className="text-seashell-700 dark:text-seashell-300">
                Fashion Story
              </span>
            </h1>

            <p className="text-lg text-dim-grey-700 dark:text-dim-grey-300 leading-relaxed max-w-md">
              Create your account and unlock exclusive access to premium collections, personalized recommendations, and more.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-parchment-50/70 dark:bg-dark-coffee-900/70 backdrop-blur-sm rounded-2xl border border-parchment-200/50 dark:border-dark-coffee-700/50">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-seashell-500 to-parchment-500 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-dark-coffee-900 dark:text-parchment-50">Free Shipping</div>
                <div className="text-sm text-dim-grey-700 dark:text-dim-grey-300">On orders above $99</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-parchment-50/70 dark:bg-dark-coffee-900/70 backdrop-blur-sm rounded-2xl border border-parchment-200/50 dark:border-dark-coffee-700/50">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-dark-coffee-500 to-khaki-beige-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-dark-coffee-900 dark:text-parchment-50">Secure Payments</div>
                <div className="text-sm text-dim-grey-700 dark:text-dim-grey-300">100% protected transactions</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-parchment-50/70 dark:bg-dark-coffee-900/70 backdrop-blur-sm rounded-2xl border border-parchment-200/50 dark:border-dark-coffee-700/50">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-parchment-600 to-seashell-600 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-dark-coffee-900 dark:text-parchment-50">Member Perks</div>
                <div className="text-sm text-dim-grey-700 dark:text-dim-grey-300">Exclusive deals & early access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-coffee-900 dark:text-parchment-50 mb-2">
                Create account
              </h2>
              <p className="text-dim-grey-700 dark:text-dim-grey-300 text-sm">
                Start your journey with Velure
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-dark-coffee-800 dark:text-parchment-200">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim-grey-500 group-focus-within:text-seashell-600 dark:group-focus-within:text-seashell-400 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-12 h-12 bg-white dark:bg-dark-coffee-950 border-parchment-300 dark:border-dark-coffee-700 focus:border-seashell-500 dark:focus:border-seashell-500 focus:ring-2 focus:ring-seashell-500/20 rounded-xl transition-all text-dark-coffee-900 dark:text-parchment-50 placeholder:text-dim-grey-400 dark:placeholder:text-dim-grey-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <Label htmlFor="password" className="text-sm font-semibold text-dark-coffee-800 dark:text-parchment-200">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim-grey-500 group-focus-within:text-seashell-600 dark:group-focus-within:text-seashell-400 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-12 bg-white dark:bg-dark-coffee-950 border-parchment-300 dark:border-dark-coffee-700 focus:border-seashell-500 dark:focus:border-seashell-500 focus:ring-2 focus:ring-seashell-500/20 rounded-xl transition-all text-dark-coffee-900 dark:text-parchment-50 placeholder:text-dim-grey-400 dark:placeholder:text-dim-grey-500"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      checkPasswordStrength(e.target.value);
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
                {formData.password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1 h-1.5">
                      <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthWidth()} ${getPasswordStrengthColor()}`} />
                      <div className={`h-full flex-1 rounded-full bg-parchment-200 dark:bg-dark-coffee-800`} />
                    </div>
                    <p className="text-xs text-dim-grey-600 dark:text-dim-grey-400 flex items-center gap-1.5">
                      {passwordStrength === "weak" && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Weak - Use 6+ characters
                        </>
                      )}
                      {passwordStrength === "medium" && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          Medium - Try 10+ characters
                        </>
                      )}
                      {passwordStrength === "strong" && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Strong password!
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-dark-coffee-800 dark:text-parchment-200">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim-grey-500 group-focus-within:text-seashell-600 dark:group-focus-within:text-seashell-400 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-12 bg-white dark:bg-dark-coffee-950 border-parchment-300 dark:border-dark-coffee-700 focus:border-seashell-500 dark:focus:border-seashell-500 focus:ring-2 focus:ring-seashell-500/20 rounded-xl transition-all text-dark-coffee-900 dark:text-parchment-50 placeholder:text-dim-grey-400 dark:placeholder:text-dim-grey-500"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-seashell-600 via-dark-coffee-700 to-parchment-700 hover:from-seashell-700 hover:via-dark-coffee-800 hover:to-parchment-800 text-parchment-50 font-semibold rounded-xl shadow-lg shadow-dark-coffee-500/30 hover:shadow-xl hover:shadow-dark-coffee-500/40 transition-all duration-300 group mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create Account
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
                    Have an account?
                  </span>
                </div>
              </div>

              <Link href="/login" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-parchment-300 dark:border-dark-coffee-700 hover:border-seashell-500 dark:hover:border-seashell-500 hover:bg-seashell-50 dark:hover:bg-seashell-950/20 rounded-xl font-semibold transition-all duration-300 text-dark-coffee-800 dark:text-parchment-200"
                >
                  Sign In
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
