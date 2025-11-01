import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, File } from 'lucide-react';
import { getOrders } from '@/lib/woocommerce';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

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

const OrderTable = ({ orders }: { orders: Order[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="font-headline">Orders</CardTitle>
      <CardDescription>
        Manage your orders and view their sales details.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Order
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="hidden sm:table-cell font-medium">#{order.id}</TableCell>
              <TableCell>
                <div className="font-medium">{order.billing.first_name} {order.billing.last_name}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {order.billing.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(order.date_created), 'MMMM dd, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                ৳{order.total}
              </TableCell>
               <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup="true"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/orders/${order.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
     <CardFooter>
      <div className="text-xs text-muted-foreground">
        Showing <strong>1-{orders.length}</strong> of <strong>{orders.length}</strong> orders
      </div>
    </CardFooter>
  </Card>
);

export default async function OrdersPage() {
  const allOrders = await getOrders('any');
  const processingOrders = await getOrders('processing');
  const completedOrders = await getOrders('completed');
  const refundedOrders = await getOrders('refunded');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="refunded" className="hidden sm:flex">Refunded</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <OrderTable orders={allOrders} />
        </TabsContent>
        <TabsContent value="processing">
          <OrderTable orders={processingOrders} />
        </TabsContent>
        <TabsContent value="completed">
          <OrderTable orders={completedOrders} />
        </TabsContent>
        <TabsContent value="refunded">
          <OrderTable orders={refundedOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
