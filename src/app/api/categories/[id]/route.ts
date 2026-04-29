import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/categoriesStore";

type Params = Promise<{ id: string }>;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const categories = getCategories();
  const filteredCategories = categories.filter((c) => c.id !== id);

  if (categories.length !== filteredCategories.length) {
    const success = saveCategories(filteredCategories);
    if (success) {
      return NextResponse.json({ message: "Category deleted successfully" });
    } else {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
}
