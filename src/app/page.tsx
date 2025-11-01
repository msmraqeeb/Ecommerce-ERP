import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DollarSign,
  CheckCircle,
  Clock,
  ShoppingCart,
} from 'lucide-react';
import { OverviewChart } from '@/components/charts/overview-chart';
import { getOrders } from '@/lib/woocommerce';
import type { Order } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { subDays } from 'date-fns';

function getAvatarInfo(name: string) {
  const fallback = name
    .split(' ')
    .map((n) => n[0])
    .join('');
  // Simple hash to get a consistent image from placeholder array
  const imageIndex =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    PlaceHolderImages.length;
  const image = PlaceHolderImages[imageIndex];
  return {
    src: image.imageUrl,
    fallback,
    hint: image.imageHint,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    from?: string;
    to?: string;
  };
}) {
  const from = searchParams?.from
    ? new Date(searchParams.from)
    : subDays(new Date(), 29);
  const to = searchParams?.to ? new Date(searchParams.to) : new Date();

  // Ensure 'to' date includes the whole day
  to.setHours(23, 59, 59, 999);

  const allOrders: Order[] = await getOrders('any', {
    after: from.toISOString(),
    before: to.toISOString(),
  });

  const totalRevenue = allOrders
    .filter((order) => order.status === 'completed')
    .reduce((sum, order) => sum + parseFloat(order.total), 0);

  const completedOrders = allOrders.filter(
    (order) => order.status === 'completed'
  ).length;
  const processingOrders = allOrders.filter(
    (order) => order.status === 'processing'
  ).length;

  const totalMetrics = [
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toFixed(2)}`,
      change: 'From completed orders',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Total Orders',
      value: `+${allOrders.length}`,
      change: 'In selected period',
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Completed Orders',
      value: `+${completedOrders}`,
      change: 'In selected period',
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Processing Orders',
      value: `+${processingOrders}`,
      change: 'Currently processing',
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const recentSales = allOrders.slice(0, 5).map((order) => {
    const name = `${order.billing.first_name} ${order.billing.last_name}`;
    const avatarInfo = getAvatarInfo(name);
    return {
      id: order.id,
      name: name,
      email: order.billing.email,
      amount: `৳${order.total}`,
      avatar: {
        src: avatarInfo.src,
        fallback: avatarInfo.fallback,
        hint: avatarInfo.hint,
      },
    };
  });

  // Prepare data for the overview chart
  const salesByMonth: { [key: string]: number } = {};
  
  allOrders.forEach((order) => {
    const orderDate = new Date(order.date_created);
    if (order.status === 'completed') {
      const month = orderDate.toLocaleString('default', { month: 'short' });
      if (!salesByMonth[month]) {
        salesByMonth[month] = 0;
      }
      salesByMonth[month] += parseFloat(order.total);
    }
  });

  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const salesData = monthOrder.map((month) => ({
    name: month,
    total: salesByMonth[month] || 0,
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {totalMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={salesData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Recent Sales</CardTitle>
            <CardDescription>Your 5 most recent sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={sale.avatar.src}
                      alt="Avatar"
                      data-ai-hint={sale.avatar.hint}
                    />
                    <AvatarFallback>{sale.avatar.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
