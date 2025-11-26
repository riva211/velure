"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      setResult(null);

      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed database");
      }

      setResult({ success: true, data });
    } catch (error: any) {
      console.error("Error:", error);
      setResult({ success: false, error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Setup Database</h1>
            <p className="text-muted-foreground">
              Click the button below to populate the database with sample products and create the admin account
            </p>
          </div>

          {!result && (
            <Button
              onClick={handleSeed}
              disabled={isSeeding}
              size="lg"
              className="w-full max-w-xs mx-auto text-lg h-14"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Seed Database Now
                </>
              )}
            </Button>
          )}

          {result && (
            <div className="space-y-4">
              {result.success ? (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                      Success!
                    </h3>
                  </div>
                  <div className="text-green-700 dark:text-green-300 mb-4 space-y-2">
                    <p>Database seeded with {result.data.count} products!</p>
                    {result.data.admin && (
                      <p className="text-sm">
                        Admin account created: <strong>{result.data.admin.email}</strong>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/products">
                        View Products
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Home
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                      Error
                    </h3>
                  </div>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    {result.error}
                  </p>
                  <Button onClick={() => setResult(null)} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}

          {!result && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-left">
              <p className="font-semibold mb-2">This will:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Clear existing products from the database</li>
                <li>Add 16 sample products with realistic data</li>
                <li>Create admin account (admin@velure.com / admin123)</li>
                <li>Enable cart functionality to work properly</li>
                <li>Allow you to test the complete shopping experience</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
