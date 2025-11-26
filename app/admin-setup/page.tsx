"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCog, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [createResult, setCreateResult] = useState<any>(null);

  const handleCheck = async () => {
    try {
      setIsChecking(true);
      setCheckResult(null);

      const response = await fetch("/api/admin/setup");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check admin user");
      }

      setCheckResult(data);
    } catch (error: any) {
      console.error("Error:", error);
      setCheckResult({ error: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      setCreateResult(null);

      const response = await fetch("/api/admin/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user");
      }

      setCreateResult(data);
      // Refresh the check result
      handleCheck();
    } catch (error: any) {
      console.error("Error:", error);
      setCreateResult({ error: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCog className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Account Setup</h1>
            <p className="text-muted-foreground">
              Check if admin account exists or create a new one
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleCheck}
              disabled={isChecking}
              size="lg"
              variant="outline"
              className="w-full max-w-xs mx-auto text-lg h-14"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <UserCog className="mr-2 h-5 w-5" />
                  Check Admin Status
                </>
              )}
            </Button>

            {checkResult && !checkResult.error && (
              <div className={`p-4 rounded-lg border ${
                checkResult.exists
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {checkResult.exists ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <h3 className="font-bold">
                    {checkResult.exists ? "Admin Exists" : "Admin Not Found"}
                  </h3>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> {checkResult.email}</p>
                  {checkResult.exists && (
                    <>
                      <p><strong>Name:</strong> {checkResult.name}</p>
                      <p><strong>Role:</strong> {checkResult.role}</p>
                      <p><strong>Created:</strong> {new Date(checkResult.createdAt).toLocaleString()}</p>
                    </>
                  )}
                  {!checkResult.exists && (
                    <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                      Click "Create Admin Account" below to set up the admin user.
                    </p>
                  )}
                </div>
              </div>
            )}

            {checkResult?.error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-bold">Error</h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{checkResult.error}</p>
              </div>
            )}

            {(!checkResult || !checkResult.exists) && (
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                size="lg"
                className="w-full max-w-xs mx-auto text-lg h-14"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserCog className="mr-2 h-5 w-5" />
                    Create Admin Account
                  </>
                )}
              </Button>
            )}

            {createResult && !createResult.error && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                    Success!
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  {createResult.existed
                    ? "Admin account already exists"
                    : "Admin account created successfully!"}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  <strong>Email:</strong> {createResult.email}
                  <br />
                  <strong>Password:</strong> admin123
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/login">
                      Login Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Go Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {createResult?.error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-bold">Error</h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{createResult.error}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-left">
            <p className="font-semibold mb-2">Admin Credentials:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Email:</strong> admin@velure.com</li>
              <li><strong>Password:</strong> admin123</li>
            </ul>
            <p className="mt-3 text-xs">
              These credentials are set in your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
