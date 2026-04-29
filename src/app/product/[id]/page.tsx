"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { ShoppingCart, Check, Shield, Truck, Star, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

import { useCart } from "@/lib/CartContext";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch("/api/products")
        ]);

        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData);

          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            const relatedProducts = allProducts
              .filter((p: Product) => p.category === productData.category && p.id !== productData.id)
              .slice(0, 4);
            setRelated(relatedProducts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p>جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          العودة إلى المتجر
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("الرجاء تحديد المقاس واللون.");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/cart");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("الرجاء تحديد المقاس واللون.");
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3 flex-shrink-0" />
          <Link href="/shop" className="hover:text-foreground transition-colors">المنتجات</Link>
          <ChevronLeft className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
              {hasDiscount && (
                <span className="absolute top-4 start-4 z-10 sale-badge text-sm animate-pulse-badge">-{discountPercent}%</span>
              )}
              {product.isNew && (
                <span className="absolute top-4 end-4 z-10 bg-success text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm">جديد</span>
              )}
              <Image src={allImages[activeImage]} alt={product.name} fill className="object-cover transition-all duration-500" priority />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {allImages.map((img, index) => (
                  <button key={index} onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === index ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    }`}>
                    <Image src={img} alt={`${product.name} - ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.badge && <span className="text-[10px] font-bold text-accent">💰 {product.badge}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-muted-foreground">(47 تقييم)</span>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice!)}</span>
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded">
                    وفر {formatPrice(product.originalPrice! - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground text-base leading-relaxed mb-8">{product.description}</p>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-foreground text-sm">اللون</span>
                  <span className="text-sm text-muted-foreground">{selectedColor || "اختر اللون"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${
                        selectedColor === color ? "border-primary bg-primary text-white shadow-md" : "border-border hover:border-primary/50 text-foreground/80"
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-foreground text-sm">المقاس</span>
                  <button className="text-accent text-xs hover:underline font-bold">دليل المقاسات</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`min-w-[4rem] h-12 flex items-center justify-center border rounded-xl text-sm font-bold transition-all ${
                        selectedSize === size ? "border-primary bg-primary text-white shadow-md" : "border-border hover:border-primary/50 text-foreground/80"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/50 self-start sm:self-auto">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-muted-foreground hover:bg-muted transition-colors font-bold">−</button>
                <span className="w-12 text-center font-bold text-sm text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-muted-foreground hover:bg-muted transition-colors font-bold">+</button>
              </div>
              <div className="flex-1 flex gap-3">
                <button onClick={handleAddToCart} disabled={added}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all ${
                    added ? "bg-green-600 text-white" : "border-2 border-accent text-accent hover:bg-accent/5"
                  }`}>
                  {added ? (<><Check className="w-5 h-5" /> تمت الإضافة</>) : (<><ShoppingCart className="w-5 h-5" /> أضف إلى السلة</>)}
                </button>
                <button onClick={handleBuyNow}
                  className="flex-1 bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02]">
                  اشتري الآن
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5 bg-muted/30 rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">توصيل سريع</p>
                  <p className="text-[10px] text-muted-foreground">لجميع الولايات</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">الدفع عند الاستلام</p>
                  <p className="text-[10px] text-muted-foreground">ضمان 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">منتجات ذات صلة</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
