"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SlidersHorizontal, Loader2 } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | "الكل">(
    initialCategory || "الكل"
  );
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: "الكل", label: "الكل", count: products.length },
    {
      id: "رسمية",
      label: "رسمية",
      count: products.filter((p) => p.category === "رسمية").length,
    },
    {
      id: "رياضية",
      label: "رياضية",
      count: products.filter((p) => p.category === "رياضية").length,
    },
    {
      id: "يومية",
      label: "يومية",
      count: products.filter((p) => p.category === "يومية").length,
    },
  ];

  let filteredProducts =
    activeCategory === "الكل"
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p>جاري تحميل المنتجات...</p>
      </div>
    );
  }

  return (
    <>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as Category | "الكل")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                ? "bg-primary text-white shadow-md"
                : "bg-muted text-foreground hover:bg-border"
              }`}
          >
            {cat.label}
            <span
              className={`mr-1.5 text-xs ${activeCategory === cat.id ? "text-white/70" : "text-muted-foreground"
                }`}
            >
              ({cat.count})
            </span>
          </button>
        ))}
      </div>

      {/* Results bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <p className="text-sm text-muted-foreground">
          تم العثور على{" "}
          <span className="font-bold text-foreground">
            {filteredProducts.length}
          </span>{" "}
          منتج
        </p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
          >
            <option value="default">ترتيب حسب</option>
            <option value="price-asc">السعر: من الأقل</option>
            <option value="price-desc">السعر: من الأعلى</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30">
          <p className="text-lg text-muted-foreground mb-3">
            لم يتم العثور على أي منتج يطابق بحثك.
          </p>
          <button
            onClick={() => setActiveCategory("الكل")}
            className="text-accent font-medium hover:underline"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      )}
    </>
  );
}

export default function ShopPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-accent text-sm font-bold uppercase tracking-widest mb-2 block">
            مجموعتنا
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            كل المنتجات
          </h1>
          <p className="text-muted-foreground">
            اكتشف الكتالوج الخاص بنا بالكامل. جوارب مصممة لكل لحظة من حياتك.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-20 text-center text-muted-foreground">
              جاري تحميل المنتجات...
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
