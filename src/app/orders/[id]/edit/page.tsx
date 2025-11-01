'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOrderById } from '@/lib/woocommerce';
import { updateOrder } from '@/app/orders/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Order, OrderStatus } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const orderStatuses: Exclude<OrderStatus, 'any'>[] = [
  'pending',
  'processing',
  'on-hold',
  'completed',
  'cancelled',
  'refunded',
  'failed',
];

const formSchema = z.object({
  status: z.enum(orderStatuses),
});

type FormData = z.infer<typeof formSchema>;

export default function OrderEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const orderId = Number(params.id);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    async function fetchOrder() {
      if (isNaN(orderId)) return;
      const order = await getOrderById(orderId);
      if (order) {
        reset({
          status: order.status,
        });
      }
    }
    fetchOrder();
  }, [orderId, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await updateOrder(orderId, data);
    if (result.success) {
      toast({
        title: 'Order Updated',
        description: `Order #${orderId} has been updated to "${data.status}".`,
      });
      router.push(`/orders/${orderId}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline">Edit Order #{orderId}</CardTitle>
              <CardDescription>Update the order status.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
