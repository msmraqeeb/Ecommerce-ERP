import Image from "next/image"
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight, ListFilter, File, Search } from 'lucide-react';
import { getProducts, getProductCounts } from "@/lib/woocommerce";
import type { Product, ProductStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: {
    page?: string;
    status?: ProductStatus;
    stock_status?: StockStatus;
    orderby?: 'price';
    order?: 'asc' | 'desc';
    search?: string;
  }
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const currentStatus = searchParams?.status || 'all';
  const stockStatus = searchParams?.stock_status;
  const orderby = searchParams?.orderby;
  const order = searchParams?.order;
  const search = searchParams?.search || '';
  
  const { products, totalPages, totalProducts } = await getProducts({
    page: currentPage, 
    status: currentStatus, 
    stock_status: stockStatus, 
    orderby: orderby, 
    order: order,
    search: search
  });
  const counts = await getProductCounts();

  const getStatusBadge = (status: Product['status'] | Product['stock_status']) => {
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
        return <Badge variant="outline">{status}</Badge>
    }
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const getStatusCount = (status: 'all' | 'publish' | 'draft') => {
    switch(status) {
      case 'publish':
        return counts.published;
      case 'draft':
        return counts.draft;
      default:
        return counts.all;
    }
  }

  const tabValues: ProductStatus[] = ['all', 'publish', 'draft'];

  const buildQuery = (newParams: object) => {
    const query = {
      ...searchParams,
      ...newParams
    };
    // Clean up query params
    if (query.status === 'all') delete query.status;
    if (!query.page || query.page === '1') delete query.page;
    if ('search' in newParams && newParams.search) {
      query.page = undefined; // Reset page on new search
    } else if ('search' in newParams && !newParams.search) {
      delete query.search;
    }
    
    if (query.search === '') {
      delete query.search;
    }


    return query;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center gap-4">
           <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
             {tabValues.map(status => (
                <Link 
                  key={status} 
                  href={{ pathname: '/products', query: buildQuery({ status: status, page: undefined }) }}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    currentStatus === status ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50"
                  )}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({getStatusCount(status)})
                </Link>
              ))}
            </div>
            <form method="get" className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                placeholder="Search by name or SKU..."
                defaultValue={search}
              />
            </form>
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
                 <DropdownMenuLabel className="font-normal text-xs">Status</DropdownMenuLabel>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ status: 'all', page: undefined }) }}>All</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ status: 'publish', page: undefined }) }}>Published</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ status: 'draft', page: undefined }) }}>Draft</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuLabel className="font-normal text-xs">Stock Status</DropdownMenuLabel>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ stock_status: undefined }) }}>All</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ stock_status: 'instock' }) }}>In Stock</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ stock_status: 'outofstock' }) }}>Out of Stock</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ stock_status: 'onbackorder' }) }}>On Backorder</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal text-xs">Sort by Price</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ orderby: undefined, order: undefined }) }}>Default</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ orderby: 'price', order: 'asc' }) }}>Low to High</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link className="w-full" href={{ pathname: '/products', query: buildQuery({ orderby: 'price', order: 'desc' }) }}>High to Low</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-10 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-10 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
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
                          src={product.images[0]?.src || "https://picsum.photos/seed/placeholder/40/40"}
                          width="40"
                          data-ai-hint="product image"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">৳{product.price}</TableCell>
                      <TableCell className="hidden md:table-cell">{getStatusBadge(product.stock_status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
                Showing <strong>{products.length > 0 ? ((currentPage - 1) * 20) + 1 : 0}-{Math.min(currentPage * 20, totalProducts)}</strong> of <strong>{totalProducts}</strong> products
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="outline" size="sm" disabled={!hasPrevPage}>
                  <Link href={{ pathname: '/products', query: buildQuery({ page: currentPage - 1 }) }}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" disabled={!hasNextPage}>
                  <Link href={{ pathname: '/products', query: buildQuery({ page: currentPage + 1 }) }}>
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
