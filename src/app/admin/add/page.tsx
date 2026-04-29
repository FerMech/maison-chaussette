import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h1>
              <p className="text-gray-500 text-sm">املأ النموذج أدناه لإضافة خيار جديد إلى متجرك</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <ProductForm mode="add" />
      </div>
    </div>
  );
}
