import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/productsStore";
import { Product } from "@/data/products";

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = getProducts();
    
    const newProduct: Product = {
      ...body,
      id: body.id || `product-${Date.now()}`,
    };

    products.push(newProduct);
    const success = saveProducts(products);

    if (success) {
      return NextResponse.json(newProduct, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
