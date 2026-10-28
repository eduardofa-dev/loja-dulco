import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { type ProductCardProps } from "./product-card";

const products: ProductCardProps[] = [
  { id: 1, productName: "Brownie", price: 15, imageUrl: "/imagens/brownie.png", description: "Um clássico para adoçar qualquer pausa." },
  { id: 2, productName: "Bolo de Pote", price: 15, imageUrl: "/imagens/bolonopote.png", description: "Um momento doce para aproveitar de colher." },
  { id: 3, productName: "Bombom de Brownie", price: 6, imageUrl: "/imagens/bombombrownie.png", description: "Brownie em uma versão para saborear a cada mordida." },
  { id: 4, productName: "Morango do Amor", price: 28, imageUrl: "/imagens/morangodoamor.png", description: "Uma escolha especial para quem ama morango." },
  { id: 5, productName: "Bora com Chocolate", price: 28, imageUrl: "/imagens/boracomchocolate.png", description: "Uma opção deliciosa para a hora da sobremesa." },
  { id: 6, productName: "Bombom no Pote de Morango", price: 28, imageUrl: "/imagens/potemorango.png", description: "Uma combinação em pote para fãs de morango." },
  { id: 7, productName: "Bombom no Pote de Uva", price: 28, imageUrl: "/imagens/poteuva.png", description: "Um docinho de pote para quem ama uva." },
  { id: 8, productName: "Caixa com Quatro Docinhos", price: 28, imageUrl: "/imagens/quatrodoces.png", description: "Quatro motivos para deixar o dia mais doce." },
  { id: 9, productName: "Coxinha de Morango", price: 28, imageUrl: "/imagens/coxinhamorango.png", description: "Mais uma forma de se apaixonar por morango." },
];

export default function ProductList() {
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="#como-pedir" className="inline-flex items-center gap-3 rounded-md border border-[#775134] px-6 py-3 text-xs font-semibold uppercase tracking-[0.09em] text-[#f1d1b8] transition hover:border-[#d9904e] hover:bg-[#d9904e]/10">
            Como fazer seu pedido <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
