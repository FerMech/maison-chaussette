"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Package,
  LayoutGrid,
  ShoppingCart,
  Phone,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Category form state
  const [newCatName, setNewCatName] = useState("");
  const [catActionLoading, setCatActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/orders")
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCatActionLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName })
      });

      if (res.ok) {
        setNewCatName("");
        setMessage({ type: "success", text: "تم إضافة الفئة بنجاح" });
        fetchData();
      } else {
        setMessage({ type: "error", text: "فشل إضافة الفئة" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ ما" });
    } finally {
      setCatActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    setCatActionLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: "تم حذف الفئة بنجاح" });
        fetchData();
      } else {
        setMessage({ type: "error", text: "فشل حذف الفئة" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ ما" });
    } finally {
      setCatActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage({ type: "success", text: "تم حذف المنتج بنجاح" });
        setProducts(products.filter((p) => p.id !== id));
        setConfirmDelete(null);
      } else {
        setMessage({ type: "error", text: "فشل حذف المنتج" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الحذف" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "الكل" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted pb-20 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-background border-b border-border py-6 mb-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm">إدارة BENYO STORE</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> عرض المتجر
            </Link>
            <Link
              href="/admin/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> إضافة منتج جديد
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-xl w-fit border border-border">
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "products" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            المنتجات
          </button>
          <button 
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "categories" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            الفئات
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "orders" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            الطلبات
            {orders.length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full mr-2">{orders.length}</span>
            )}
          </button>
        </div>

        {/* Alerts */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {activeTab === "products" && (
          <>
            {/* Filters & Search */}
            <div className="bg-background p-4 rounded-xl border border-border shadow-sm mb-8 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="البحث عن منتج (الاسم أو ID)..."
                  className="w-full pr-10 pl-4 py-2.5 border border-border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {["الكل", ...categories.map(c => c.name)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat ? "bg-foreground text-background shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-muted-foreground">المنتج</th>
                      <th className="px-6 py-4 text-sm font-bold text-muted-foreground">الفئة</th>
                      <th className="px-6 py-4 text-sm font-bold text-muted-foreground">السعر</th>
                      <th className="px-6 py-4 text-sm font-bold text-muted-foreground text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                        </td>
                      </tr>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-muted border border-border">
                                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                              </div>
                              <div>
                                <div className="font-bold text-foreground">{product.name}</div>
                                <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-bold">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/edit/${product.id}`}
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => setConfirmDelete(product.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          لم يتم العثور على أي منتجات.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">إضافة فئة جديدة</h3>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input 
                  type="text" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="اسم الفئة الجديد..."
                  className="flex-1 px-4 py-3 border border-border bg-background text-foreground rounded-xl focus:outline-none focus:border-primary"
                  required
                />
                <button 
                  type="submit" 
                  disabled={catActionLoading}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {catActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة"}
                </button>
              </form>
            </div>

            <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground">اسم الفئة</th>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground">{cat.name}</span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-background p-12 rounded-2xl border border-border text-center text-muted-foreground">
                لا توجد طلبات حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/50">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-foreground">{order.id}</span>
                          <span className="px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 rounded-full text-[10px] font-bold uppercase">قيد الانتظار</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString('ar-DZ')}</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">معلومات الزبون</h4>
                        <div className="space-y-2">
                          <p className="font-bold text-foreground text-lg">{order.customerName}</p>
                          <p className="flex items-center gap-2 text-muted-foreground font-medium">
                            <Phone className="w-4 h-4 text-muted-foreground" /> {order.phone}
                          </p>
                          <div className="p-3 bg-muted rounded-xl border border-border text-sm text-muted-foreground">
                            <p className="font-bold text-foreground">{order.wilaya} - {order.commune}</p>
                            <p className="mt-1">{order.address}</p>
                            <p className="mt-2 text-[10px] bg-background border border-border w-fit px-2 py-0.5 rounded text-muted-foreground">طريقة التوصيل: {order.deliveryMode === 'home' ? 'للمنزل' : 'مكتب التوصيل'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">المنتجات ({order.items.length})</h4>
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border">
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                  <p className="font-bold text-foreground text-sm">{item.name}</p>
                                  <p className="text-[10px] text-muted-foreground">اللون: {item.selectedColor} | المقاس: {item.selectedSize}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground text-sm">{formatPrice(item.price)}</p>
                                <p className="text-[10px] text-muted-foreground">الكمية: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-2">هل أنت متأكد؟</h3>
            <p className="text-muted-foreground text-center text-sm mb-6">
              سيتم حذف هذا المنتج نهائياً من المتجر.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
