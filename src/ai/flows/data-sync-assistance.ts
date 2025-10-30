'use server';

/**
 * @fileOverview Data synchronization assistance flow using Genkit to verify and correct data discrepancies with Kidsparadise.com.bd.
 *
 * - dataSyncAssistance - A function that initiates the data synchronization verification and correction process.
 * - DataSyncAssistanceInput - The input type for the dataSyncAssistance function.
 * - DataSyncAssistanceOutput - The return type for the dataSyncAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataSyncAssistanceInputSchema = z.object({
  productData: z.string().describe('The product data received from Kidsparadise.com.bd.'),
  existingProductData: z.string().describe('The existing product data in the ERP system.'),
});
export type DataSyncAssistanceInput = z.infer<typeof DataSyncAssistanceInputSchema>;

const DataSyncAssistanceOutputSchema = z.object({
  isDataCorrect: z.boolean().describe('Whether the product data is consistent between platforms.'),
  correctedProductData: z.string().describe('The corrected product data, if any discrepancies were found.'),
  discrepancyDetails: z.string().describe('Details of any discrepancies found and how they were corrected.'),
});
export type DataSyncAssistanceOutput = z.infer<typeof DataSyncAssistanceOutputSchema>;

export async function dataSyncAssistance(input: DataSyncAssistanceInput): Promise<DataSyncAssistanceOutput> {
  return dataSyncAssistanceFlow(input);
}

const dataSyncAssistancePrompt = ai.definePrompt({
  name: 'dataSyncAssistancePrompt',
  input: {schema: DataSyncAssistanceInputSchema},
  output: {schema: DataSyncAssistanceOutputSchema},
  prompt: `You are an expert in data synchronization and verification. Your task is to compare product data from Kidsparadise.com.bd with existing data in our ERP system and identify any discrepancies.

  Based on your analysis, determine if the data is consistent. If not, correct the product data and provide details on the discrepancies found and how they were corrected.

  Kidsparadise.com.bd Product Data: {{{productData}}}
  Existing ERP Product Data: {{{existingProductData}}}

  Return a JSON object with the following fields:
  - isDataCorrect: true if the data is consistent, false otherwise.
  - correctedProductData: The corrected product data as a JSON string, if any corrections were made. If no corrections were necessary, this should be the same as the Kidsparadise.com.bd Product Data.
  - discrepancyDetails: A detailed explanation of any discrepancies found and how they were corrected.

  Ensure that the correctedProductData field contains valid JSON.
`,
});

const dataSyncAssistanceFlow = ai.defineFlow(
  {
    name: 'dataSyncAssistanceFlow',
    inputSchema: DataSyncAssistanceInputSchema,
    outputSchema: DataSyncAssistanceOutputSchema,
  },
  async input => {
    const {output} = await dataSyncAssistancePrompt(input);
    return output!;
  }
);
