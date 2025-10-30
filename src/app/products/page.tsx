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
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getProductCounts } from "@/lib/woocommerce";
import type { Product } from "@/lib/types";

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: {
    page?: string;
    status?: 'publish' | 'draft' | 'any';
  }
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const currentStatus = searchParams?.status || 'any';
  
  const { products, totalPages, totalProducts } = await getProducts(currentPage, currentStatus === 'any' ? 'publish' : currentStatus);
  const counts = await getProductCounts();

  const getStatusBadge = (status: 'instock' | 'outofstock' | 'onbackorder' | 'publish' | 'draft') => {
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
    }
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const getStatusCount = (status: 'any' | 'publish' | 'draft') => {
    switch(status) {
      case 'publish':
        return counts.published;
      case 'draft':
        return counts.draft;
      default:
        return counts.all;
    }
  }

  const tabValues: ('any' | 'publish' | 'draft')[] = ['any', 'publish', 'draft'];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Tabs defaultValue={currentStatus}>
        <div className="flex items-center">
          <TabsList>
            {tabValues.map(status => (
              <Link href={{ pathname: '/products', query: { status: status, page: 1 } }} key={status} passHref>
                <TabsTrigger value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({getStatusCount(status)})
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={currentStatus}>
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
                Page {currentPage} of {totalPages} ({totalProducts} products)
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="outline" size="sm" disabled={!hasPrevPage}>
                  <Link href={{ pathname: '/products', query: { ...searchParams, page: currentPage - 1 } }}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" disabled={!hasNextPage}>
                   <Link href={{ pathname: '/products', query: { ...searchParams, page: currentPage + 1 } }}>
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}