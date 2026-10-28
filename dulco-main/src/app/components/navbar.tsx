"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCarrinho } from "./carrinhocontext";
import { whatsappMessageMaker } from "@/utils/wpp-message-maker";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre nós" },
  { href: "#como-pedir", label: "Como pedir" },
];

export default function Navbar({ contactNumber }: { contactNumber: string }) {
  const { itens, removerItem, removerUmaUnidade, adicionarItem } = useCarrinho();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const quantity = itens.reduce((sum, item) => sum + item.quantidade, 0);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <header className="relative z-50 border-b border-white/[0.06] bg-[#0b0b0b]">
      <div className="mx-auto flex h-[90px] max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="#inicio" aria-label="Dulço — início" className="inline-flex shrink-0 items-center">
          <span className="font-serif text-[27px] font-semibold italic tracking-tight text-[#f4e4d5] sm:text-[32px]">Dulço<span className="text-[#d9904e]">.</span></span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="border-b border-transparent py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e5ded7] transition hover:border-[#d9904e] hover:text-[#d9904e]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#cardapio" className="hidden rounded-full p-2 text-[#f1e5d9] transition hover:text-[#d9904e] sm:inline-flex" aria-label="Explorar o cardápio">
            <span className="text-[10px] font-semibold uppercase tracking-[0.11em]">Peça agora</span>
          </a>
          <button type="button" onClick={() => setCartOpen((v) => !v)} aria-label={cartOpen ? "Fechar sacola" : "Abrir sacola"} aria-expanded={cartOpen} className="relative rounded-full p-2 text-[#f1e5d9] transition hover:bg-[#30231b] hover:text-[#d9904e] focus-visible:outline-2 focus-visible:outline-[#d9904e]">
            <ShoppingBag size={22} strokeWidth={1.7} />
            {quantity > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9904e] px-1 text-[10px] font-bold text-black">{quantity}</span>}
          </button>
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} className="rounded-full p-2 text-[#f1e5d9] lg:hidden">
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute left-0 right-0 top-full overflow-hidden border-b border-[#785338]/50 bg-[#161310] shadow-2xl lg:hidden" aria-label="Menu mobile">
            <div className="flex flex-col px-6 py-4">
              {links.map((link) => <Link href={link.href} key={link.href} onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-4 text-sm font-semibold uppercase tracking-widest text-[#ebd8c8]">{link.label}</Link>)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <>
            <button type="button" aria-label="Fechar sacola" className="fixed inset-0 z-40 cursor-default bg-black/60" onClick={() => setCartOpen(false)} />
            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="absolute right-3 top-[80px] z-50 w-[calc(100vw-24px)] max-w-[385px] rounded-2xl border border-[#7a5033] bg-[#202020] p-5 text-[#f6efe8] shadow-2xl sm:right-8" aria-label="Sua sacola">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Sua sacola <span className="text-[#d9904e]">({quantity})</span></h2>
                <button type="button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" className="rounded-full p-1 hover:bg-white/10"><X size={20}/></button>
              </div>
              {itens.length === 0 ? <p className="py-8 text-center text-sm text-[#b4a79c]">Sua sacola está vazia. Escolha seus doces favoritos!</p> : (
                <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
                  {itens.map((item) => (
                    <li key={item.id} className="border-b border-white/10 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#f4e0cf]">{item.nome}</p>
                          <p className="mt-1 text-xs text-[#d7a77b]">{brl.format(item.preco)} / unidade</p>
                        </div>
                        <button type="button" aria-label={"Remover " + item.nome} onClick={() => removerItem(item.id)} className="rounded-full p-1 text-[#ce9472] hover:bg-white/10"><Trash2 size={17}/></button>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" aria-label={"Diminuir " + item.nome} className="rounded-full border border-white/20 p-1 hover:bg-white/10" onClick={() => removerUmaUnidade(item.id)}><Minus size={14}/></button>
                        <span className="min-w-5 text-center text-sm tabular-nums">{item.quantidade}</span>
                        <button type="button" aria-label={"Aumentar " + item.nome} className="rounded-full border border-white/20 p-1 hover:bg-white/10" onClick={() => adicionarItem({ ...item, quantidade: 1 })}><Plus size={14}/></button>
                        <span className="ml-auto text-sm font-semibold">{brl.format(item.preco * item.quantidade)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {itens.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between border-t border-white/10 py-4 text-lg font-semibold">
                    <span>Total</span><span className="text-[#e8aa73]">{brl.format(total)}</span>
                  </div>
                  <a href={"https://wa.me/" + contactNumber + "?text=" + whatsappMessageMaker(itens)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#bd753e] px-4 py-4 text-sm font-bold text-white transition hover:bg-[#d9904e]">
                    <ShoppingBag size={18} /> Enviar pedido pelo WhatsApp
                  </a>
                  <p className="mt-3 text-center text-[11px] leading-5 text-[#a79a8d]">O pedido será enviado para confirmação pelo WhatsApp.</p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
