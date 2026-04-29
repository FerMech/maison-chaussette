"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/data/products";
import {
  ArrowRight,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  mode: "add" | "edit";
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "يومية" as Category,
    image: "",
    images: [],
    colors: [],
    sizes: [],
    isFeatured: false,
    isNew: false,
    badge: "",
    ...initialData
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          // Set default category if adding new
          if (mode === "add" && data.length > 0) {
            setFormData(prev => ({ ...prev, category: data[0].name }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [mode]);

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setMessage({ type: "success", text: "تم رفع الصورة بنجاح" });
      } else {
        setMessage({ type: "error", text: "فشل رفع الصورة" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الرفع" });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const addItem = (field: "colors" | "sizes", value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    if (field === "colors") setColorInput("");
    else setSizeInput("");
  };

  const removeItem = (field: "colors" | "sizes", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول الإجبارية" });
      return;
    }

    setLoading(true);
    try {
      const url = mode === "add" ? "/api/products" : `/api/products/${formData.id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: "success", text: mode === "add" ? "تم إضافة المنتج بنجاح" : "تم تحديث المنتج بنجاح" });
        setTimeout(() => router.push("/admin"), 1500);
      } else {
        setMessage({ type: "error", text: "فشل حفظ المنتج" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ غير متوقع" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Alert */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">معلومات المنتج</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج *</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  placeholder="مثال: جوارب رياضية ممتازة"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                  placeholder="اكتب وصفاً مفصلاً للمنتج هنا..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">السعر (د.ج) *</label>
                  <input
                    type="number" name="price" value={formData.price} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">السعر الأصلي (اختياري)</label>
                  <input
                    type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants (Sizes & Colors) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">المقاسات والألوان</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الألوان المتاحة</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    placeholder="مثال: أسود، أزرق..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem("colors", colorInput))}
                  />
                  <button
                    type="button" onClick={() => addItem("colors", colorInput)}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors?.map((color, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {color}
                      <button type="button" onClick={() => removeItem("colors", i)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المقاسات المتاحة</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    placeholder="مثال: 39-42, L, XL..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem("sizes", sizeInput))}
                  />
                  <button
                    type="button" onClick={() => addItem("sizes", sizeInput)}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes?.map((size, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {size}
                      <button type="button" onClick={() => removeItem("sizes", i)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">التصنيف والحالة</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الفئة *</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">منتج مميز (يظهر في الرئيسية)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox" name="isNew" checked={formData.isNew} onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">منتج جديد</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">شارة ترويجية (اختياري)</label>
                <input
                  type="text" name="badge" value={formData.badge} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all"
                  placeholder="مثال: خصم 20%، عرض خاص"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">صور المنتج</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصورة الأساسية *</label>

                <div className="flex flex-col gap-4">
                  {/* Upload Button */}
                  <label className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploading ? "bg-gray-50 border-gray-300" : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-accent"
                    }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 font-bold">اضغط لرفع صورة من جهازك</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text" name="image" value={formData.image} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-sm"
                      placeholder="أو ضع رابط الصورة هنا..."
                    />
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-4 relative aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit" disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {mode === "add" ? "إضافة المنتج" : "حفظ التغييرات"}
            </button>
            <button
              type="button" onClick={() => router.back()}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
