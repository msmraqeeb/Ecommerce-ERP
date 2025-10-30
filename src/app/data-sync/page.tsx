'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataSyncAssistance, DataSyncAssistanceOutput } from '@/ai/flows/data-sync-assistance';
import { exampleErpData, exampleProductData } from '@/lib/data';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DataSyncPage() {
  const [productData, setProductData] = useState(
    JSON.stringify(exampleProductData, null, 2)
  );
  const [existingData, setExistingData] = useState(
    JSON.stringify(exampleErpData, null, 2)
  );
  const [result, setResult] = useState<DataSyncAssistanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDataSync() {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await dataSyncAssistance({
        productData: productData,
        existingProductData: existingData,
      });
      setResult(output);
    } catch (error) {
      console.error('Data sync failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sync data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Data Sync Assistance</CardTitle>
            <CardDescription>
              Verify and correct product data discrepancies between Kidsparadise.com.bd and your ERP system using AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid w-full gap-2">
                <Label htmlFor="product-data">Kidsparadise.com.bd Product Data (JSON)</Label>
                <Textarea
                  id="product-data"
                  value={productData}
                  onChange={(e) => setProductData(e.target.value)}
                  rows={15}
                  className="font-code"
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="existing-data">Existing ERP Product Data (JSON)</Label>
                <Textarea
                  id="existing-data"
                  value={existingData}
                  onChange={(e) => setExistingData(e.target.value)}
                  rows={15}
                  className="font-code"
                />
              </div>
            </div>
            <Button onClick={handleDataSync} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Correct Data'
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                {result.isDataCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                )}
                Verification Result
              </CardTitle>
              <CardDescription>
                {result.isDataCorrect
                  ? 'Data is consistent between both platforms.'
                  : 'Discrepancies found. See details below.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!result.isDataCorrect && (
                <>
                 <div>
                    <Label className="font-semibold">Discrepancy Details</Label>
                    <p className="text-sm text-muted-foreground mt-1">{result.discrepancyDetails}</p>
                 </div>
                 <div>
                    <Label className="font-semibold">Corrected Product Data</Label>
                    <Textarea
                        readOnly
                        value={result.correctedProductData}
                        rows={15}
                        className="font-code mt-1 bg-muted"
                    />
                 </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
