import { Produto } from "@/app/components/carrinhocontext";

export function whatsappMessageMaker(products: Produto[]): string {
  const header =
    `Olá, tudo bem?%0A` +
    `Acabei de fazer um pedido pela lojinha online, e queria finalizar o meu pedido!%0A` +
    `Os produtos que eu peguei foram:%0A%0A`;

  const productLines = products.map((produto) => {
    const totalProduto = produto.preco * produto.quantidade;
    return `• ${produto.quantidade} x ${produto.nome} — ${
      produto.quantidade
    } x R$ ${produto.preco.toFixed(2)} = R$ ${totalProduto.toFixed(2)}`;
  });

  const allProductsTotal = products.reduce(
    (acc, produto) => acc + produto.preco * produto.quantidade,
    0
  );

  const footer = `%0A%0ATotal = R$ ${allProductsTotal.toFixed(2)}`;

  return `${header}${productLines.join("%0A")}${footer}`;
}
