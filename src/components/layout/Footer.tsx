import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-4 border-t border-black/5">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="BENYO STOR"
              width={160}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-primary-foreground/60 text-xs hidden lg:block">
            📍 بابا علي - الجزائر | 📞 0667183105
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium">
          <Link href="/shop" className="hover:underline">المتجر</Link>
          <Link href="#" className="hover:underline">الشروط والأحكام</Link>
          <Link href="#" className="hover:underline">سياسة الخصوصية</Link>
          <p className="text-primary-foreground/40 font-normal ms-2">
            &copy; {new Date().getFullYear()} BENYO STORE
          </p>
        </div>
      </div>
    </footer>
  );
}
