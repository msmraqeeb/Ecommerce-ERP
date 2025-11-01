import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getOrderById } from '@/lib/woocommerce';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import type { Order } from '@/lib/types';
import { getSession } from '@/lib/auth';

const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'refunded':
    case 'failed':
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    notFound();
  }

  const order: Order | null = await getOrderById(orderId);
  const session = await getSession();
  const isAdmin = session?.user?.role === 'admin';

  if (!order) {
    notFound();
  }

  const {
    id,
    status,
    date_created,
    total,
    currency,
    billing,
    shipping,
    line_items,
    payment_method_title,
    shipping_total
  } = order;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/orders">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Orders</span>
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline tracking-tight">
                    Order #{id}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {format(new Date(date_created), 'MMMM dd, yyyy, h:mm a')}
                </p>
            </div>
        </div>
        <div className='flex items-center gap-2'>
            <Badge variant={getBadgeVariant(status)} className="capitalize text-base py-1 px-3">
              {status}
            </Badge>
            {isAdmin && (
                <Button asChild size="sm" className="h-8 gap-1">
                <Link href={`/orders/${id}/edit`}>
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Edit Status
                    </span>
                </Link>
                </Button>
            )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>Customer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-semibold">{billing.first_name} {billing.last_name}</p>
            <p className="text-muted-foreground">{billing.email}</p>
            <p className="text-muted-foreground">{billing.phone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{shipping.first_name} {shipping.last_name}</p>
            <p>{shipping.address_1}</p>
            {shipping.address_2 && <p>{shipping.address_2}</p>}
            <p>{shipping.city}, {shipping.state} {shipping.postcode}</p>
            <p>{shipping.country}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className='font-headline'>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{billing.first_name} {billing.last_name}</p>
            <p>{billing.address_1}</p>
            {billing.address_2 && <p>{billing.address_2}</p>}
            <p>{billing.city}, {billing.state} {billing.postcode}</p>
            <p>{billing.country}</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className='hidden sm:table-cell'>SKU</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {line_items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className='hidden sm:table-cell'>{item.sku || 'N/A'}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">{currency} {item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{currency} {Number(item.total).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <p><strong>Method:</strong> {payment_method_title}</p>
            <p><strong>Status:</strong> <span className='capitalize'>{status}</span></p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{currency} {(Number(total) - Number(shipping_total)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{currency} {Number(shipping_total).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>{currency} {Number(total).toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
