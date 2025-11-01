'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import Papa from 'papaparse';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  File,
  Search,
  Loader2,
} from 'lucide-react';
import type { Product, ProductStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAllProductsForExport } from './actions';
import { format } from 'date-fns';

export function ProductsPageContent({
  products,
  totalPages,
  totalProducts,
  counts,
  isAdmin,
}: {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  counts: { all: number; published: number; draft: number };
  isAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = React.useState(searchParams.get('search') || '');
  const [query] = useDebounce(text, 500);
  const [isExporting, setIsExporting] = React.useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentStatus = (searchParams.get('status') as ProductStatus) || 'all';

  const buildQueryString = React.useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(newParams)) {
        if (value === undefined || value === null || String(value) === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      // Reset page on new filters/search, except for pagination itself
      if (!('page' in newParams)) {
        params.delete('page');
      }

      // Clean up default values
      if (params.get('status') === 'all') {
        params.delete('status');
      }
      if (params.get('page') === '1') {
        params.delete('page');
      }

      return params.toString();
    },
    [searchParams]
  );
  
  React.useEffect(() => {
    const newQueryString = buildQueryString({ search: query, page: undefined });
    router.push(`/products?${newQueryString}`);
  }, [query, buildQueryString, router]);


  const getStatusBadge = (
    status: Product['status'] | Product['stock_status']
  ) => {
    switch (status) {
      case 'instock':
        return <Badge variant="default">In Stock</Badge>;
      case 'onbackorder':
        return <Badge variant="secondary">On Backorder</Badge>;
      case 'outofstock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'publish':
        return <Badge variant="default">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const getStatusCount = (status: 'all' | 'publish' | 'draft') => {
    switch (status) {
      case 'publish':
        return counts.published;
      case 'draft':
        return counts.draft;
      default:
        return counts.all;
    }
  };

  const tabValues: ProductStatus[] = ['all', 'publish', 'draft'];
    
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const allProducts = await getAllProductsForExport();
      const dataToExport = allProducts.map(p => ({
        ID: p.id,
        Name: p.name,
        SKU: p.sku,
        Status: p.status,
        Price: p.price,
        'Stock Status': p.stock_status,
        'Stock Quantity': p.stock_quantity ?? 'N/A',
      }));

      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const date = format(new Date(), 'yyyy-MM-dd');
      link.setAttribute('download', `products-export-${date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
        console.error("Failed to export products:", error);
        // You might want to show a toast notification to the user here
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          {tabValues.map((status) => (
            <Link
              key={status}
              href={`/products?${buildQueryString({
                status: status,
              })}`}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                currentStatus === status
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-background/50'
              )}
            >
              {status === 'all'
                ? 'All'
                : status.charAt(0).toUpperCase() + status.slice(1)}{' '}
              ({getStatusCount(status)})
            </Link>
          ))}
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            placeholder="Search by name or SKU..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs">
                Stock Status
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    stock_status: undefined,
                  })}`}
                >
                  All
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    stock_status: 'instock',
                  })}`}
                >
                  In Stock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    stock_status: 'outofstock',
                  })}`}
                >
                  Out of Stock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    stock_status: 'onbackorder',
                  })}`}
                >
                  On Backorder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs">
                Sort by Price
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    orderby: undefined,
                    order: undefined,
                  })}`}
                >
                  Default
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    orderby: 'price',
                    order: 'asc',
                  })}`}
                >
                  Low to High
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="w-full"
                  href={`/products?${buildQueryString({
                    orderby: 'price',
                    order: 'desc',
                  })}`}
                >
                  High to Low
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isAdmin && (
            <>
            <Button size="sm" variant="outline" className="h-10 gap-1" onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                <File className="h-3.5 w-3.5" />
                )}
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {isExporting ? 'Exporting...' : 'Export'}
                </span>
            </Button>
            <Button size="sm" className="h-10 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
                </span>
            </Button>
            </>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Products</CardTitle>
          <CardDescription>
            Manage your products and view their inventory status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Stock Status
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="40"
                      src={
                        product.images[0]?.src ||
                        'https://picsum.photos/seed/placeholder/40/40'
                      }
                      width="40"
                      data-ai-hint="product image"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    ৳{product.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(product.stock_status)}
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
                        {isAdmin && (
                            <>
                            <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                            Delete
                            </DropdownMenuItem>
                            </>
                        )}
                        {!isAdmin && <DropdownMenuItem asChild><Link href={`/products/${product.id}/edit`}>View</Link></DropdownMenuItem>}
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
            Showing{' '}
            <strong>
              {products.length > 0 ? (currentPage - 1) * 20 + 1 : 0}-
              {Math.min(currentPage * 20, totalProducts)}
            </strong>{' '}
            of <strong>{totalProducts}</strong> products
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
            >
              <Link
                href={`/products?${buildQueryString({
                  page: currentPage - 1,
                })}`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
            >
              <Link
                href={`/products?${buildQueryString({
                  page: currentPage + 1,
                })}`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
