import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Categories } from "@/components/home/Categories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <WhyChooseUs />
      <FeaturedProducts />
      <Categories />
      <Reviews />
    </div>
  );
}
