"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCarrinho } from "./carrinhocontext";

export type ProductCardProps = {
  id: number;
  productName: string;
  price: number;
  originalPrice?: number;
  category?: string;
  imageUrl: string;
  description?: string;
  available?: boolean;
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProductCard({ id, productName, price, originalPrice, imageUrl, description, category, available = true }: ProductCardProps) {
  const { adicionarItem } = useCarrinho();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    if (!available) return;
    adicionarItem({ id, nome: productName, preco: price, quantidade: quantity });
    setQuantity(1);
    setAdded(true);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#785338]/60 bg-[#252525] p-3 transition duration-300 hover:-translate-y-1 hover:border-[#d9904e]/90 hover:shadow-[0_22px_45px_rgba(0,0,0,0.3)]">
      <div className="relative aspect-[1.17/1] overflow-hidden rounded-xl bg-[#151515]">
        {originalPrice !== undefined && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#bd753e] px-3 py-1.5 text-xs font-bold text-white">OFERTA</span>}
        <Image
          src={imageUrl}
          alt={productName}
          fill
          unoptimized={imageUrl.startsWith("https://")}
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, (max-width: 1280px) 31vw, 290px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        {category && <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#a89584]">{category}</span>}
        <h3 className="min-h-[47px] text-[17px] font-semibold leading-snug text-[#e3a16a]">{productName}</h3>
        <p className="mt-1 min-h-[43px] text-[12px] leading-[1.6] text-[#aaa29b]">{description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-6">
          <div>
            <span className="mb-2 block text-[11px] uppercase tracking-[0.09em] text-[#9a9088]">Valor</span>
            {originalPrice !== undefined && <span className="block text-xs text-[#aaa09a] line-through">{priceFormatter.format(originalPrice)}</span>}
            <span className="text-lg font-bold tracking-tight text-white">{priceFormatter.format(price)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center rounded-full border border-[#62564c] bg-[#171717]">
              <button
                type="button"
                onClick={() => { setQuantity((value) => Math.max(1, value - 1)); setAdded(false); }}
                className="flex h-9 w-7 items-center justify-center rounded-l-full text-[#e6c3a8] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#d9904e]"
                aria-label={`Diminuir quantidade de ${productName}`}
                disabled={quantity === 1}
              >
                <Minus size={13} />
              </button>
              <span className="min-w-5 text-center text-xs font-semibold tabular-nums text-white" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => { setQuantity((value) => value + 1); setAdded(false); }}
                className="flex h-9 w-7 items-center justify-center rounded-r-full text-[#e6c3a8] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#d9904e]"
                aria-label={`Aumentar quantidade de ${productName}`}
              >
                <Plus size={13} />
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={!available}
              title={`Adicionar ${productName} ao carrinho`}
              aria-label={`Adicionar ${quantity} unidade(s) de ${productName} ao carrinho`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#df9c60] bg-[#be753e] text-white transition hover:bg-[#d99250] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9904e]"
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <div className="mt-2 min-h-4 text-right text-[11px] text-[#e6b085]" aria-live="polite">
          {!available ? "Esgotado" : added ? "Adicionado à sacola!" : ""}
        </div>
      </div>
    </article>
  );
}
