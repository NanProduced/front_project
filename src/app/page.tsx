import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import SolutionsSection from "@/components/SolutionsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050b1f] text-white">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <SolutionsSection />
      <Footer />
    </main>
  );
}
