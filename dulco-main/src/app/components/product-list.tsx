"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./product-card";
import { initialProducts, publicProducts, type CatalogProduct } from "@/lib/catalog";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ProductList() {
  const [products, setProducts] = useState<CatalogProduct[]>(isSupabaseConfigured ? [] : initialProducts);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let active = true;
    async function load() {
      const { data, error: requestError } = await db!.from("products")
        .select("id,name,description,price,image_url,category,is_available,is_visible,is_featured,sort_order")
        .eq("is_visible", true).order("sort_order").order("id");
      if (!active) return;
      if (requestError) { setError("Não foi possível carregar o cardápio. Tente novamente."); }
      else { setProducts((data || []) as CatalogProduct[]); setError(""); }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);
  return (
    <section id="cardapio" className="scroll-mt-24 border-t border-white/[0.06] bg-[#101010] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 text-center">
          <p className="section-kicker justify-center">ESCOLHAS QUE ENCANTAM</p>
          <h2 className="mt-5 text-[clamp(2.35rem,4.5vw,4rem)] font-semibold leading-tight tracking-[-0.045em]">
            Nossa coleção de <span className="text-[#d9904e]">sabores</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#aaa29b] sm:text-base">
            Descubra nossos doces, escolha seus favoritos e monte sua sacola com praticidade.
          </p>
        </div>
        {loading && <p role="status" className="py-12 text-center text-[#c9b6a5]">Carregando cardápio...</p>}
        {error && <p role="alert" className="py-12 text-center text-red-300">{error}</p>}
        {!loading && !error && publicProducts(products).length === 0 &&
          <p className="py-12 text-center text-[#c9b6a5]">Nenhum produto disponível no momento.</p>}
        {!error && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publicProducts(products).map(p => <ProductCard key={p.id} id={p.id} productName={p.name}
            description={p.description} price={Number(p.price)} imageUrl={p.image_url}
            available={p.is_available} />)}
        </div>}
        <div className="mt-12 flex justify-center">
          <Link href="#como-pedir" className="inline-flex items-center gap-3 rounded-md border border-[#775134] px-6 py-3 text-xs font-semibold uppercase tracking-[0.09em] text-[#f1d1b8] transition hover:border-[#d9904e] hover:bg-[#d9904e]/10">
            Como fazer seu pedido <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
