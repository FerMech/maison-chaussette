"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useCart } from "@/lib/CartContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "الصفحة الرئيسية" },
    { href: "/shop", label: "المنتجات" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background shadow-md"
          : "bg-background border-b border-border"
      }`}
    >
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium tracking-wide">
        🚚 توصيل لجميع أنحاء الجزائر | ⏰ شحن خلال 24-48 ساعة | 58 ولاية
      </div>

      <div className="container mx-auto px-4 md:px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="BENYO STOR"
            width={240}
            height={90}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent relative py-1 ${
                pathname === link.href
                  ? "text-accent"
                  : "text-foreground"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors p-2">
            <User className="w-5 h-5" />
            <span className="hidden lg:inline">تسجيل الدخول</span>
          </button>

          <ThemeToggle />

          <Link
            href="/cart"
            className="relative p-2 text-foreground hover:text-accent transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -start-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </Link>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full start-0 w-full bg-background border-b border-border py-4 px-4 flex flex-col gap-1 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-muted text-accent"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-3">
            <button className="flex items-center gap-2 text-base font-medium py-3 px-4 text-foreground hover:bg-muted rounded-lg w-full">
              <User className="w-5 h-5" />
              تسجيل الدخول
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
