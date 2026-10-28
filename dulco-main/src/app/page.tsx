import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ProductList from "./components/product-list";

const contactNumber = "5581996169830";

export default function Home() {
  return (
    <main id="inicio" className="min-h-screen overflow-hidden bg-[#0b0b0b] text-[#f8f5f1]">
      <Navbar contactNumber={contactNumber} />

      <section className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-24 pt-12 sm:px-8 md:pt-20 lg:min-h-[650px] lg:grid-cols-[1fr_1.04fr] lg:px-12 lg:pb-28">
        <div className="pointer-events-none absolute -left-44 top-24 h-80 w-80 rounded-full bg-[#dc823e]/[0.06] blur-[90px]" />
        <div className="relative z-10 max-w-[650px]">
          <p className="section-kicker mb-8"><span /> CONFEITARIA ARTESANAL</p>
          <h1 className="text-[clamp(3.3rem,7vw,6.6rem)] font-semibold leading-[1.02] tracking-[-0.055em]">
            Um toque de <span className="text-[#d9904e]">doçura</span> em cada momento.
          </h1>
          <div className="mt-8 h-px w-48 bg-gradient-to-r from-[#c78242] to-transparent" />
          <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-[#b6b0aa] sm:text-base">
            Brownies, docinhos e sobremesas feitas para transformar pequenas pausas em grandes momentos.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#cardapio"
              className="inline-flex min-h-12 items-center gap-3 rounded-md border border-[#db9351] bg-[#bc7135] px-6 text-sm font-semibold text-white transition hover:bg-[#d58a46] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9904e]"
            >
              Explorar cardápio <ArrowRight size={17} />
            </Link>
            <Link
              href="#como-pedir"
              className="inline-flex min-h-12 items-center gap-3 rounded-md border border-[#74604d] px-6 text-sm font-semibold text-[#f2e9df] transition hover:border-[#d9904e] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9904e]"
            >
              Como fazer seu pedido <ShoppingBag size={16} />
            </Link>
          </div>
          <div className="mt-14 grid max-w-[530px] grid-cols-3 divide-x divide-[#6b462c]/80">
            <div className="pr-4">
              <Heart size={21} strokeWidth={1.6} className="mb-3 text-[#d9904e]" />
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#e2a064]">Feito com carinho</p>
              <p className="mt-1 text-xs text-[#948b83]">Cada detalhe importa</p>
            </div>
            <div className="px-4">
              <Sparkles size={21} strokeWidth={1.6} className="mb-3 text-[#d9904e]" />
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#e2a064]">Sabores especiais</p>
              <p className="mt-1 text-xs text-[#948b83]">Escolha seu favorito</p>
            </div>
            <div className="pl-4">
              <MessageCircle size={21} strokeWidth={1.6} className="mb-3 text-[#d9904e]" />
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#e2a064]">Pedido fácil</p>
              <p className="mt-1 text-xs text-[#948b83]">Direto no WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex h-[370px] w-full max-w-[610px] items-center justify-center sm:h-[550px] lg:h-[610px]">
          <div className="hero-glow absolute inset-[6%] rounded-full" />
          <div className="absolute h-[90%] w-[90%] rounded-full border border-[#d28d51]/35" />
          <div className="absolute h-[80%] w-[80%] rounded-full border border-[#d28d51]/20" />
          <div className="relative h-[76%] w-[76%] overflow-hidden rounded-full border-[8px] border-[#22201f] bg-[#171210] shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_0_1px_rgba(218,144,78,0.23)] sm:border-[12px]">
            <Image
              src="/imagens/brownie.png"
              alt="Brownie da Dulço em destaque"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 500px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute right-0 top-[13%] flex h-20 w-20 -rotate-12 items-center justify-center rounded-full border border-[#ac7547]/70 bg-[#17120f] text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.13em] text-[#d9904e] shadow-xl sm:h-28 sm:w-28 sm:text-xs">
            <span>Momentos<br />mais doces</span>
          </div>
          <div className="absolute bottom-[10%] left-[1%] flex items-center gap-2 rounded-full border border-[#5c3b25] bg-[#1d1713]/90 px-4 py-2 text-xs tracking-wide text-[#e8c2a2] shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-[#d9904e]" /> Escolha seu doce favorito
          </div>
        </div>
      </section>

      <ProductList />

      <section id="sobre" className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-12 lg:py-32">
        <div>
          <p className="section-kicker mb-5">NOSSA ESSÊNCIA</p>
          <h2 className="max-w-lg text-[clamp(2.3rem,4vw,4rem)] font-semibold leading-tight tracking-[-0.045em]">
            A felicidade mora nos <span className="text-[#d9904e]">pequenos prazeres.</span>
          </h2>
          <p className="mt-7 max-w-md text-[15px] leading-8 text-[#aaa29b]">
            A Dulço nasceu para deixar os momentos do dia a dia ainda mais especiais. Aqui, cada escolha no cardápio é um convite para aproveitar o lado doce da vida.
          </p>
          <p className="mt-8 font-serif text-3xl italic tracking-wide text-[#d9904e]">Com carinho, Dulço.</p>
          <Link href="#cardapio" className="mt-10 inline-flex items-center gap-2 border-b border-[#d9904e] pb-2 text-sm font-semibold text-[#edc19b] transition hover:gap-4">
            Conheça nossos doces <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid h-[420px] grid-cols-[1.6fr_1fr] gap-3 sm:h-[530px]">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#222]">
            <Image src="/imagens/slide1.jpg" alt="Doce da coleção Dulço" fill sizes="(max-width: 1024px) 60vw, 430px" className="object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#222]">
              <Image src="/imagens/slide3.jpg" alt="Sobremesa da Dulço" fill sizes="(max-width: 1024px) 35vw, 250px" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#222]">
              <Image src="/imagens/slide5.jpg" alt="Detalhe de outro doce da Dulço" fill sizes="(max-width: 1024px) 35vw, 250px" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      <section id="como-pedir" className="border-t border-white/[0.07] bg-[#101010] py-24 lg:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <p className="section-kicker mb-4">DO CARDÁPIO ATÉ VOCÊ</p>
          <div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="text-[clamp(2.2rem,4vw,3.6rem)] font-semibold tracking-[-0.045em]">
              Seu momento doce <span className="text-[#d9904e]">começa aqui.</span>
            </h2>
            <p className="max-w-xs text-sm leading-6 text-[#9f9790]">Um jeito simples de escolher seus favoritos e conversar com a gente.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { number: "01", title: "Explore os sabores", text: "Passeie pelo cardápio e encontre os doces que mais combinam com você." },
              { number: "02", title: "Monte sua sacola", text: "Escolha as quantidades e adicione seus favoritos ao carrinho." },
              { number: "03", title: "Finalize no WhatsApp", text: "Envie seu pedido para nossa equipe e combine os próximos detalhes." },
            ].map((step) => (
              <div key={step.number} className="relative min-h-[230px] rounded-2xl border border-[#67482f]/70 bg-[#202020] p-7 transition hover:border-[#d9904e]/80 sm:p-9">
                <div className="mb-8 flex items-start justify-between">
                  <span className="text-4xl font-light tracking-tighter text-[#d9904e]">{step.number}</span>
                  <ArrowRight size={20} className="text-[#a77d5a]" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#f3eae1]">{step.title}</h3>
                <p className="max-w-[290px] text-sm leading-6 text-[#aca39b]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer contactNumber={contactNumber} />
    </main>
  );
}
