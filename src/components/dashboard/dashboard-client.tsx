'use client';

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
import { DateRangePicker } from '@/components/ui/date-range-picker';

type RecentSale = {
  id: number;
  name: string;
  email: string;
  amount: string;
  avatar: {
    src: string;
    fallback: string;
    hint: string;
  };
};

type DashboardClientProps = {
  totalRevenue: number;
  allOrdersCount: number;
  completedOrdersCount: number;
  processingOrdersCount: number;
  salesData: any[];
  recentSales: RecentSale[];
};

export function DashboardClient({
  totalRevenue,
  allOrdersCount,
  completedOrdersCount,
  processingOrdersCount,
  salesData,
  recentSales,
}: DashboardClientProps) {
  const totalMetrics = [
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toFixed(2)}`,
      change: 'From completed orders',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Total Orders',
      value: `+${allOrdersCount}`,
      change: 'In selected period',
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Completed Orders',
      value: `+${completedOrdersCount}`,
      change: 'In selected period',
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Processing Orders',
      value: `+${processingOrdersCount}`,
      change: 'Currently processing',
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
  ];

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
        {totalMetrics.map(metric => (
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
              {recentSales.map(sale => (
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
