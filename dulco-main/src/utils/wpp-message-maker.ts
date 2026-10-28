import type { Produto } from "@/app/components/carrinhocontext";

export function whatsappMessageMaker(products: Produto[]): string {
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const lines = products.map(
    (item) => "• " + item.quantidade + "x " + item.nome + " — " + money.format(item.quantidade * item.preco)
  );
  const total = products.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  return encodeURIComponent([
    "Olá! Gostaria de finalizar meu pedido da Dulço:",
    "",
    ...lines,
    "",
    "Total: " + money.format(total),
    "",
    "Podemos confirmar a disponibilidade e os detalhes do pedido?",
  ].join("\n"));
}
