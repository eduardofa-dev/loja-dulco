"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
};

type CarrinhoContextType = {
  itens: Produto[];
  adicionarItem: (produto: Produto) => void;
  removerUmaUnidade: (id: number) => void;
  removerItem: (id: number) => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Produto[]>([]);

  const adicionarItem = (produto: Produto) => {
    setItens((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + produto.quantidade }
            : item
        );
      } else {
        return [...prev, produto];
      }
    });
  };

  const removerUmaUnidade = (id: number) => {
    setItens((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const removerItem = (id: number) => {
    setItens((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, removerUmaUnidade, removerItem }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
}
