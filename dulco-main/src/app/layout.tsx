import type { Metadata } from "next";
import { CarrinhoProvider } from "./components/carrinhocontext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dulço | Cardápio de doces",
  description: "Conheça os doces da Dulço, monte sua sacola e peça diretamente pelo WhatsApp em Caruaru, Pernambuco.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <CarrinhoProvider>{children}</CarrinhoProvider>
      </body>
    </html>
  );
}
