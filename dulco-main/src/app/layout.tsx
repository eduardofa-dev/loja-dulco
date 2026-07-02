import { CarrinhoProvider } from "./components/carrinhocontext";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <CarrinhoProvider>
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  );
}
