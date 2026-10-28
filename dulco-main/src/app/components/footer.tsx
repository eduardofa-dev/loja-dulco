import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, MapPin, MessageCircle } from "lucide-react";

export default function Footer({ contactNumber }: { contactNumber: string }) {
  return (
    <footer id="contato" className="border-t border-[#815638]/50 bg-[#0b0b0b] px-5 pt-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1320px] gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-20">
        <div>
          <Link href="#inicio" className="inline-flex items-center gap-3">
            <Image src="/imagens/logo.png" alt="Logo Dulço" width={66} height={66} className="h-[66px] w-[66px] object-contain" />
            <span className="font-serif text-3xl italic text-[#f1dfce]">Dulço</span>
          </Link>
          <p className="mt-5 max-w-[290px] text-sm leading-7 text-[#a69d95]">Transformando ingredientes em momentos de felicidade. Um doce de cada vez.</p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.instagram.com/doce.dulcor/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Dulço" className="rounded-full border border-[#855b3d] p-3 text-[#d9904e] transition hover:bg-[#d9904e] hover:text-black"><Instagram size={17} /></a>
            <a href={"https://wa.me/" + contactNumber} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Dulço" className="rounded-full border border-[#855b3d] p-3 text-[#d9904e] transition hover:bg-[#d9904e] hover:text-black"><MessageCircle size={17} /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-7 text-xs font-bold uppercase tracking-[0.15em] text-white">Navegação</h3>
          <nav className="flex flex-col items-start gap-4 text-sm text-[#a69d95]" aria-label="Navegação do rodapé">
            <Link href="#inicio" className="hover:text-[#d9904e]">Início</Link>
            <Link href="#cardapio" className="hover:text-[#d9904e]">Cardápio</Link>
            <Link href="#sobre" className="hover:text-[#d9904e]">Sobre nós</Link>
            <Link href="#como-pedir" className="hover:text-[#d9904e]">Como pedir</Link>
          </nav>
        </div>
        <div>
          <h3 className="mb-7 text-xs font-bold uppercase tracking-[0.15em] text-white">Entre em contato</h3>
          <p className="mb-5 flex items-start gap-3 text-sm text-[#a69d95]"><MapPin size={17} className="mt-0.5 shrink-0 text-[#d9904e]" /> Caruaru — Pernambuco</p>
          <a href={"https://wa.me/" + contactNumber} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#e6c4a5] transition hover:text-[#d9904e]"><MessageCircle size={17} /> Converse pelo WhatsApp <ArrowUpRight size={16} /></a>
          <p className="mt-7 max-w-[280px] text-xs leading-6 text-[#8f847c]">Consulte disponibilidade e detalhes do pedido diretamente com nossa equipe.</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 border-t border-[#67432d]/65 py-6 text-xs text-[#8b8178] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Dulço. Todos os direitos reservados.</p>
        <p>Feito para adoçar seus dias.</p>
      </div>
    </footer>
  );
}
