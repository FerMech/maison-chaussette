import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Truck className="w-7 h-7" />,
      title: "توصيل سريع",
      description: "شحن خلال 24-48 ساعة لجميع الولايات",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "دفع آمن 100%",
      description: "معاملات محمية عبر جميع وسائل الدفع",
    },
    {
      icon: <RefreshCw className="w-7 h-7" />,
      title: "إرجاع مجاني",
      description: "30 يومًا لتغيير رأيك بدون أي تكلفة",
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: "خدمة عملاء",
      description: "فريق دعم متاح من 9 صباحاً - 10 مساءً",
    },
  ];

  return (
    <section className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm border border-primary/5">
                {feature.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[200px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
