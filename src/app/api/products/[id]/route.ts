import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/productsStore";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      products[index] = { ...products[index], ...body };
      const success = saveProducts(products);
      if (success) {
        return NextResponse.json(products[index]);
      } else {
        return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const products = getProducts();
  const filteredProducts = products.filter((p) => p.id !== id);

  if (products.length !== filteredProducts.length) {
    const success = saveProducts(filteredProducts);
    if (success) {
      return NextResponse.json({ message: "Product deleted successfully" });
    } else {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
