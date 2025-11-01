import { subDays } from 'date-fns';
import { getOrders } from '@/lib/woocommerce';
import type { Order } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

function getAvatarInfo(name: string) {
  const fallback = name
    .split(' ')
    .map(n => n[0])
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
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + parseFloat(order.total), 0);

  const completedOrders = allOrders.filter(
    order => order.status === 'completed'
  ).length;
  const processingOrders = allOrders.filter(
    order => order.status === 'processing'
  ).length;

  const recentSales = allOrders.slice(0, 5).map(order => {
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

  allOrders.forEach(order => {
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
  const salesData = monthOrder.map(month => ({
    name: month,
    total: salesByMonth[month] || 0,
  }));

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      allOrdersCount={allOrders.length}
      completedOrdersCount={completedOrders}
      processingOrdersCount={processingOrders}
      salesData={salesData}
      recentSales={recentSales}
    />
  );
}
