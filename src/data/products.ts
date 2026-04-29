export type Category = "رسمية" | "رياضية" | "يومية";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  images: string[];
  colors: string[];
  sizes: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  stock?: number; // Added stock field as requested
}

/**
 * Initial products data. 
 * Note: Use API routes /api/products for dynamic data management.
 */
export const products: Product[] = [
  {
    id: "dress-1",
    name: "الأناقة الرمادية",
    description: "جوارب رسمية من القطن المصري، رقيقة ومتينة. مثالية لمرافقة بدلاتك وملابسك الرسمية بلمسة من الرقي.",
    price: 1200,
    originalPrice: 2400,
    category: "رسمية",
    image: "/images/dress_socks_1776818409215.png",
    images: ["/images/dress_socks_1776818409215.png"],
    colors: ["رمادي داكن", "أسود", "أزرق بحري"],
    sizes: ["39-42", "43-46"],
    isFeatured: true,
    badge: "وفر 1,200 د.ج",
    stock: 50
  }
];
