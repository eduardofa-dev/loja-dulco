import Navbar from "./components/navbar";
import Carrossel from "./components/carrossel";
import Footer from "./components/footer";
import ProductList from "./components/product-list";

export default function Home() {
  const contactNumber = "5581996169830";

  return (
    <main className="flex flex-col">
      <Navbar contactNumber={contactNumber} />
      <Carrossel />
      <ProductList />
      <Footer contactNumber={contactNumber} />
    </main>
  );
}
