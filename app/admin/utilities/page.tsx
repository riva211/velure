"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UtilitiesPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      setSeedResult(null);

      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed database");
      }

      setSeedResult(data);
      toast.success(`Database seeded! ${data.count} products added.`);
    } catch (error: any) {
      console.error("Error seeding database:", error);
      toast.error(error.message || "Failed to seed database");
      setSeedResult({ error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Utilities</h1>
        <p className="text-muted-foreground">
          Database management and utility tools
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Database
          </CardTitle>
          <CardDescription>
            Populate the database with dummy products for testing. This will clear existing products and create new ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Products
              </>
            )}
          </Button>

          {seedResult && (
            <div className={`p-4 rounded-lg border ${seedResult.error ? 'bg-destructive/10 border-destructive' : 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'}`}>
              <div className="flex items-start gap-3">
                {seedResult.error ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-destructive">Error</h4>
                      <p className="text-sm text-destructive/80">{seedResult.error}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Success!
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                        {seedResult.message} - {seedResult.count} products created
                      </p>
                      {seedResult.products && (
                        <div className="mt-2 max-h-40 overflow-y-auto">
                          <p className="text-xs font-medium text-green-900 dark:text-green-100 mb-1">
                            Created Products:
                          </p>
                          <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                            {seedResult.products.slice(0, 5).map((p: any) => (
                              <li key={p.id}>• {p.name}</li>
                            ))}
                            {seedResult.products.length > 5 && (
                              <li>... and {seedResult.products.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Note:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>This will delete all existing products</li>
              <li>Creates {16} dummy products with realistic data</li>
              <li>Products will have proper MongoDB ObjectIds</li>
              <li>After seeding, the cart functionality will work properly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
