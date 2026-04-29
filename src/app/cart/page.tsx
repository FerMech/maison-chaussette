"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { wilayas, deliveryModes, DeliveryMode, getDeliveryPrice } from "@/data/wilayas";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingCart, MapPin, Truck, AlertCircle, Loader2 } from "lucide-react";

import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { items: cartItems, removeFromCart, updateQuantity, clearCart, subtotal: cartSubtotal } = useCart();

  // Form state
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const wilayaObj = wilayas.find((w) => w.id === selectedWilaya);
  const communes = wilayaObj?.communes ?? [];

  const subtotal = cartSubtotal;
  const shipping = getDeliveryPrice(deliveryMode);
  const total = subtotal + shipping;

  const handleWilayaChange = (val: string) => {
    setSelectedWilaya(val);
    setSelectedCommune("");
    setErrors((prev) => ({ ...prev, wilaya: "", commune: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "الاسم الكامل مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^(0[5-7]\d{8})$/.test(phone.trim())) e.phone = "رقم هاتف غير صالح (مثال: 0555123456)";
    if (!selectedWilaya) e.wilaya = "يرجى اختيار الولاية";
    if (!selectedCommune) e.commune = "يرجى اختيار البلدية";
    if (deliveryMode === "home" && !address.trim()) e.address = "العنوان مطلوب للتوصيل إلى المنزل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) {
      alert("سلة التسوق فارغة.");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customerName: fullName,
        phone: phone,
        wilaya: wilayaObj?.name || selectedWilaya,
        commune: communes.find(c => c.id === selectedCommune)?.name || selectedCommune,
        address: address,
        deliveryMode: deliveryMode,
        items: cartItems,
        total: total
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        alert("فشل تأكيد الطلب، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center p-10 max-w-md">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">تم تأكيد طلبك بنجاح! ✅</h1>
          <p className="text-muted-foreground mb-2">سيتم التواصل معك قريباً لتأكيد الطلب.</p>
          <p className="text-sm text-muted-foreground mb-6">
            التوصيل إلى: {wilayaObj?.name} - {communes.find(c => c.id === selectedCommune)?.name}
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
            مواصلة التسوق <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center p-10">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">سلة التسوق فارغة</h1>
        <p className="text-muted-foreground mb-8">ابدأ في استكشاف منتجاتنا وأضف ما يعجبك إلى السلة.</p>
        <Link href="/shop" className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
          اكتشف منتجاتنا
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">سلة التسوق</h1>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{cartItems.length} منتجات</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column */}
          <div className="lg:w-2/3 space-y-8">
            {/* Cart Items */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-3.5 hidden sm:grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6">المنتج</div>
                <div className="col-span-2 text-center">الكمية</div>
                <div className="col-span-2 text-end">السعر</div>
                <div className="col-span-2 text-end">إجراء</div>
              </div>
              <div className="divide-y divide-border">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center hover:bg-muted/30 transition-colors">
                    <div className="col-span-1 sm:col-span-6 flex gap-4">
                      <div className="relative w-20 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/product/${item.id}`} className="font-semibold text-foreground hover:text-accent transition-colors text-sm">{item.name}</Link>
                        <p className="text-xs text-muted-foreground mt-1">المقاس: {item.selectedSize} | اللون: {item.selectedColor}</p>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span className="font-bold text-accent text-sm">{formatPrice(item.price)}</span>
                          {item.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-2 hover:bg-muted text-muted-foreground"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-2 hover:bg-muted text-muted-foreground"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 text-end hidden sm:block font-bold text-accent">{formatPrice(item.price * item.quantity)}</div>
                    <div className="col-span-1 sm:col-span-2 text-end">
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="text-muted-foreground hover:text-accent transition-colors p-2"><Trash2 className="w-4 h-4 ms-auto sm:mx-auto" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">عنوان التوصيل</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">الاسم الكامل *</label>
                  <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setErrors(p => ({...p, fullName: ""})); }}
                    placeholder="محمد أحمد" className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none transition-colors ${errors.fullName ? "border-accent bg-accent/5" : "border-border focus:border-primary"}`} />
                  {errors.fullName && <p className="text-xs text-accent mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">رقم الهاتف *</label>
                  <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(p => ({...p, phone: ""})); }}
                    placeholder="0555123456" dir="ltr" className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none transition-colors ${errors.phone ? "border-accent bg-accent/5" : "border-border focus:border-primary"}`} />
                  {errors.phone && <p className="text-xs text-accent mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">الولاية *</label>
                  <select value={selectedWilaya} onChange={(e) => handleWilayaChange(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none transition-colors ${errors.wilaya ? "border-accent bg-accent/5" : "border-border focus:border-primary"}`}>
                    <option value="">-- اختر الولاية --</option>
                    {wilayas.map((w) => (
                      <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-xs text-accent mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.wilaya}</p>}
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">البلدية *</label>
                  <select value={selectedCommune} onChange={(e) => { setSelectedCommune(e.target.value); setErrors(p => ({...p, commune: ""})); }}
                    disabled={!selectedWilaya}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${errors.commune ? "border-accent bg-accent/5" : "border-border focus:border-primary"}`}>
                    <option value="">{selectedWilaya ? "-- اختر البلدية --" : "اختر الولاية أولاً"}</option>
                    {communes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.commune && <p className="text-xs text-accent mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.commune}</p>}
                </div>
              </div>

              {/* Address (for home delivery) */}
              {deliveryMode === "home" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-1.5">العنوان التفصيلي *</label>
                  <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setErrors(p => ({...p, address: ""})); }}
                    placeholder="الحي، الشارع، رقم العمارة..." className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none transition-colors ${errors.address ? "border-accent bg-accent/5" : "border-border focus:border-primary"}`} />
                  {errors.address && <p className="text-xs text-accent mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                </div>
              )}
            </div>

            {/* Delivery Mode */}
            <div className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">طريقة التوصيل</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryModes.map((mode) => (
                  <button key={mode.id} onClick={() => setDeliveryMode(mode.id)}
                    className={`p-5 border-2 rounded-xl text-start transition-all ${
                      deliveryMode === mode.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{mode.icon}</span>
                      <span className={`text-sm font-bold ${deliveryMode === mode.id ? "text-accent" : "text-foreground"}`}>
                        {formatPrice(mode.price)}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{mode.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mode.id === "home" ? "التوصيل مباشرة إلى باب منزلك" : "استلام من أقرب مكتب توصيل"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Summary */}
          <div className="lg:w-1/3">
            <div className="bg-muted border border-border p-6 rounded-xl sticky top-24">
              <h2 className="text-lg font-bold mb-6 pb-3 border-b border-border">ملخص الطلب</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>التوصيل ({deliveryMode === "home" ? "إلى المنزل" : "مكتب التوصيل"})</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {selectedWilaya && (
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>📍 {wilayaObj?.name}{selectedCommune ? ` - ${communes.find(c => c.id === selectedCommune)?.name}` : ""}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع الكلي</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">الدفع عند الاستلام</p>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3.5 rounded-lg font-bold text-base transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 flex items-center justify-center gap-2 mb-4 disabled:opacity-70">
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>تأكيد الطلب <ArrowLeft className="w-4 h-4" /></>
                )}
              </button>

              <div className="text-center">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground underline">مواصلة التسوق</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
