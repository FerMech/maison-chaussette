import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-muted rounded-lg mb-3">
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="sale-badge text-xs animate-pulse-badge">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-success text-white text-xs font-bold px-2.5 py-1 rounded">
              جديد
            </span>
          )}
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg">
            عرض سريع
          </button>
        </div>
      </div>
      <div className="space-y-1.5 px-1">
        <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold price-sale">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="price-original text-sm">{formatPrice(product.originalPrice!)}</span>
          )}
        </div>
        {product.badge && (
          <p className="text-xs text-accent font-medium">💰 {product.badge}</p>
        )}
      </div>
    </Link>
  );
}
