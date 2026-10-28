export type CatalogProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type ProductFormValues = Omit<CatalogProduct, "id">;

export const initialProducts: CatalogProduct[] = [
  { id: 1, name: "Brownie", description: "Um clássico para adoçar qualquer pausa.", price: 15, image_url: "/imagens/brownie.png", category: "Brownies", is_available: true, is_visible: true, is_featured: true, sort_order: 1 },
  { id: 2, name: "Bolo de Pote", description: "Um momento doce para aproveitar de colher.", price: 15, image_url: "/imagens/bolonopote.png", category: "Bolos de pote", is_available: true, is_visible: true, is_featured: true, sort_order: 2 },
  { id: 3, name: "Bombom de Brownie", description: "Brownie em uma versão para saborear a cada mordida.", price: 6, image_url: "/imagens/bombombrownie.png", category: "Brownies", is_available: true, is_visible: true, is_featured: false, sort_order: 3 },
  { id: 4, name: "Morango do Amor", description: "Uma escolha especial para quem ama morango.", price: 28, image_url: "/imagens/morangodoamor.png", category: "Doces especiais", is_available: true, is_visible: true, is_featured: false, sort_order: 4 },
  { id: 5, name: "Bora com Chocolate", description: "Uma opção deliciosa para a hora da sobremesa.", price: 28, image_url: "/imagens/boracomchocolate.png", category: "Doces especiais", is_available: true, is_visible: true, is_featured: false, sort_order: 5 },
  { id: 6, name: "Bombom no Pote de Morango", description: "Uma combinação em pote para fãs de morango.", price: 28, image_url: "/imagens/potemorango.png", category: "Bolos de pote", is_available: true, is_visible: true, is_featured: false, sort_order: 6 },
  { id: 7, name: "Bombom no Pote de Uva", description: "Um docinho de pote para quem ama uva.", price: 28, image_url: "/imagens/poteuva.png", category: "Bolos de pote", is_available: true, is_visible: true, is_featured: false, sort_order: 7 },
  { id: 8, name: "Caixa com Quatro Docinhos", description: "Quatro motivos para deixar o dia mais doce.", price: 28, image_url: "/imagens/quatrodoces.png", category: "Docinhos", is_available: true, is_visible: true, is_featured: false, sort_order: 8 },
  { id: 9, name: "Coxinha de Morango", description: "Mais uma forma de se apaixonar por morango.", price: 28, image_url: "/imagens/coxinhamorango.png", category: "Doces especiais", is_available: true, is_visible: true, is_featured: false, sort_order: 9 },
];

export const blankProduct: ProductFormValues = {
  name: "", description: "", price: 0, image_url: "", category: "Doces especiais",
  is_available: true, is_visible: true, is_featured: false, sort_order: 0,
};

export function publicProducts(products: CatalogProduct[]) {
  return products.filter((product) => product.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}
