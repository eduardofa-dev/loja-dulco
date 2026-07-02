import ProductCard, { ProductCardProps } from "./product-card";

export default function ProductList() {
  const products: ProductCardProps[] = [
    {
      id: 1,
      productName: "Brownie",
      price: 15.00,
      imageUrl: "/imagens/brownie.png",
    },
    {
      id: 2,
      productName: "Bolo de Pote",
      price: 15.00,
      imageUrl: "/imagens/bolonopote.png",
    },
    {
      id: 3,
      productName: "Bombom de Brownie",
      price: 6.00,
      imageUrl: "/imagens/bombombrownie.png",
    },
    {
      id: 4,
      productName: "Morango do Amor",
      price: 28.0,
      imageUrl: "/imagens/morangodoamor.png",
    },
    {
      id: 5,
      productName: "Bora com Chocolate",
      price: 28.0,
      imageUrl: "/imagens/boracomchocolate.png",
    },
    {
      id: 6,
      productName: "Bombom no Pote de Morango",
      price: 28.0,
      imageUrl: "/imagens/potemorango.png",
    },
    {
      id: 7,
      productName: "Bombom no Pote de Uva",
      price: 28.0,
      imageUrl: "/imagens/poteuva.png",
    },
    {
      id: 8,
      productName: "Caixa com Quatro Docinhos",
      price: 28.0,
      imageUrl: "/imagens/quatrodoces.png",
    },
    {
      id: 9,
      productName: "Coxinha de Morango",
      price: 28.0,
      imageUrl: "/imagens/morangodoamor.png",
    },
  ];
  return (
    <div>
      <h1 id="produtos" className="text-[#633F6E] font-bold text-[4vh] text-center mb-[4vh] mt-30">Produtos</h1>

      <div className="flex flex-wrap gap-5 items-center justify-center px-15 mb-35">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}