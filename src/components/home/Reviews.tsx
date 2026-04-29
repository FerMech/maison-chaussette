import { Star, Quote } from "lucide-react";

export function Reviews() {
  const reviews = [
    {
      name: "أحمد د.",
      content: "الجودة استثنائية. أرتدي 'الأناقة الرمادية' كل يوم في المكتب، ولا تتغير بعد عدة غسلات.",
      rating: 5,
      date: "منذ أسبوع",
    },
    {
      name: "سارة م.",
      content: "اشتريت صندوق الأسبوع لزوجي، وهو سعيد جدًا. التغليف رائع، إنها هدية مثالية.",
      rating: 5,
      date: "منذ أسبوعين",
    },
    {
      name: "طارق ل.",
      content: "جوارب رياضية جيدة جدًا. تحافظ على ثبات القدم ولا تسبب التعرق. أوصي بها دون تردد.",
      rating: 4,
      date: "منذ شهر",
    },
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-bold uppercase tracking-widest mb-2 block">
            آراء العملاء
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            ماذا يقول عملاؤنا
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            بناءً على أكثر من 200+ تقييم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote className="w-8 h-8 text-accent/20 absolute top-4 end-4" />
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-current" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-5">
                &ldquo;{review.content}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    {review.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
