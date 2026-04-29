"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function Hero() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          const featuredProducts = data.filter((p: Product) => p.isFeatured).slice(0, 3);
          setFeatured(featuredProducts);
        }
      } catch (error) {
        console.error("Failed to fetch hero products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroProducts();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || featured.length === 0) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning, featured.length]
  );

  const next = useCallback(() => {
    if (featured.length === 0) return;
    goTo((current + 1) % featured.length);
  }, [current, featured.length, goTo]);

  const prev = useCallback(() => {
    if (featured.length === 0) return;
    goTo((current - 1 + featured.length) % featured.length);
  }, [current, featured.length, goTo]);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, featured.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] bg-secondary flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white/20" />
      </section>
    );
  }

  if (featured.length === 0) return null;

  const slide = featured[current];

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden bg-secondary">
      {featured.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image src={item.image} alt={item.name} fill sizes="100vw" priority={index === 0} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/20" />
        </div>
      ))}

      <div className="relative z-20 container mx-auto px-4 md:px-6 h-full flex items-center">
        <div key={current} className="max-w-xl text-white">
          {slide.badge && (
            <span className="sale-badge animate-slide-up animate-pulse-badge inline-block mb-4 text-sm">
              🔥 {slide.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 animate-slide-up">
            {slide.name}
          </h1>
          <p className="text-base md:text-lg text-white/80 mb-6 animate-slide-up-delay max-w-md">
            {slide.description.substring(0, 80)}...
          </p>
          <div className="flex items-center gap-4 mb-8 animate-slide-up-delay">
            {slide.originalPrice && (
              <span className="text-xl text-white/50 line-through">{formatPrice(slide.originalPrice)}</span>
            )}
            <span className="text-3xl md:text-4xl font-bold text-white">{formatPrice(slide.price)}</span>
          </div>
          <div className="flex gap-4 animate-slide-up-delay-2">
            <Link
              href={`/product/${slide.id}`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3.5 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-accent/30"
            >
              التفاصيل الكاملة <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3.5 rounded-lg font-medium border border-white/20 transition-all"
            >
              كل المنتجات
            </Link>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
