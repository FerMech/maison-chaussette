import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/categoriesStore";

export async function GET() {
  const categories = getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categories = getCategories();
    
    const newCategory = {
      id: body.name.toLowerCase().replace(/\s+/g, '-'),
      name: body.name
    };
    
    categories.push(newCategory);
    const success = saveCategories(categories);
    
    if (success) {
      return NextResponse.json(newCategory, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
