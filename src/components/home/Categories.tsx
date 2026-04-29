"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryImage = (name: string) => {
    if (name.includes("رسمية")) return "/images/dress_socks_1776818409215.png";
    if (name.includes("رياضية")) return "/images/sport_socks_1776818516641.png";
    if (name.includes("يومية") || name.includes("يومية")) return "/images/casual_socks_1776818539673.png";
    return "/images/casual_socks_1776818539673.png"; // Default
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            تسوق حسب الفئة
          </h2>
          <Link
            href="/shop"
            className="text-accent text-sm font-medium hover:underline flex items-center gap-1"
          >
            المزيد من الفئات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl block"
            >
              <Image
                src={getCategoryImage(category.name)}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 start-0 p-5 w-full">
                <h3 className="text-xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>تسوق الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
