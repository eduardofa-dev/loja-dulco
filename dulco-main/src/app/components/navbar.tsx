"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCarrinho } from "./carrinhocontext";
import { whatsappMessageMaker } from "@/utils/wpp-message-maker";
import { Plus, Minus, Trash2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ contactNumber }: { contactNumber: string }) {
  const { itens, removerItem, removerUmaUnidade, adicionarItem } = useCarrinho();
  const [hoverSacola, setHoverSacola] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <nav className="bg-[#F0D4F3] w-full px-6 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <Link href="/">
        <Image src="/imagens/logo.png" alt="Logo" width={90} height={90} />
      </Link>

      {/* Menu Desktop */}
      <ul className="hidden md:flex gap-6 font-semibold rounded-full text-[#633F6E]">
        {["Início", "Produtos"].map((texto, index) => (
          <li key={index}>
            <a
              href={["/", "#produtos"][index]}
              className="flex items-center justify-center w-28 h-10 rounded-lg hover:text-[#F0D4F3] hover:bg-[#633F6E] transition-colors duration-300"
            >
              {texto}
            </a>
          </li>
        ))}
      </ul>

      {/* Menu Mobile */}
      <div className="md:hidden flex items-center gap-2">
        <button onClick={() => setMenuMobile(!menuMobile)}>
          {menuMobile ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sacola com contador */}
      <div className="relative ml-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          onMouseEnter={() => setHoverSacola(true)}
          onMouseLeave={() => setHoverSacola(false)}
          className="p-2 rounded-full transition-colors duration-300 hover:bg-[#633F6E] flex items-center justify-center"
        >
          <Image
            src={hoverSacola ? "/icons/bag-icon rosa.svg" : "/icons/bag-icon copiar.svg"}
            alt="Sacola"
            width={26}
            height={26}
          />
          {quantidadeTotal > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF4B91] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {quantidadeTotal}
            </span>
          )}
        </button>

        {/* Dropdown animado do carrinho */}
        <AnimatePresence>
          {menuAberto && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-12 right-0 w-80 bg-white shadow-lg rounded-lg p-4 z-50"
            >
              <h3 className="font-semibold text-lg mb-2 text-[#633F6E]">Seu Carrinho</h3>
              {itens.length === 0 ? (
                <p className="text-gray-500">Carrinho vazio</p>
              ) : (
                <ul className="space-y-4 max-h-60 overflow-y-auto">
                  {itens.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[#633F6E]">{item.nome}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantidade} x R$ {item.preco.toFixed(2).replace(".", ",")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => removerUmaUnidade(item.id)}
                            className="p-1 bg-[#633F6E] text-white rounded hover:bg-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm">{item.quantidade}</span>
                          <button
                            onClick={() => adicionarItem({ ...item, quantidade: 1 })}
                            className="p-1 bg-[#633F6E] text-white rounded hover:bg-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removerItem(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                            title="Remover todos"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {itens.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="font-semibold text-[#633F6E]">
                    Total: R$ {total.toFixed(2).replace(".", ",")}
                  </p>
                  <Link
                    href={`https://wa.me/${contactNumber}?text=${whatsappMessageMaker(itens)}`}
                    target="_blank"
                    onClick={() => itens.forEach((item) => removerItem(item.id))}
                    className="block mt-2 bg-[#633F6E] text-white text-center py-2 rounded hover:bg-[#82528c] transition-colors"
                  >
                    Finalizar Compra no WhatsApp
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Mobile Dropdown */}
      <AnimatePresence>
        {menuMobile && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-[#F0D4F3] flex flex-col items-center gap-4 py-4 md:hidden z-40 shadow"
          >
            {["Início", "Produtos"].map((texto, index) => (
              <li key={index}>
                <Link
                  href={["/", "#produtos"][index]}
                  onClick={() => setMenuMobile(false)}
                  className="text-[#633F6E] font-semibold text-lg"
                >
                  {texto}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
