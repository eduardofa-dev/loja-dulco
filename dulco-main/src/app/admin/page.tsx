"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgePercent, Boxes, ImagePlus, Layers3, LogOut, Pencil, Plus, Save, Search, ShoppingBag, Trash2, X } from "lucide-react";
import CategoryManager from "./components/category-manager";
import type { User } from "@supabase/supabase-js";
import { blankProduct, effectivePrice, isOnSale, type CatalogCategory, type CatalogProduct, type ProductFormValues } from "@/lib/catalog";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const priceFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminPage() {
  const db = getSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [productSearch, setProductSearch] = useState("");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<ProductFormValues>({ ...blankProduct });

  const loadProducts = useCallback(async () => {
    if (!db) return;
    const { data, error } = await db.from("products").select("*").order("sort_order").order("id");
    if (error) { setMessage(error.message); return; }
    setProducts((data || []) as CatalogProduct[]);
  }, [db]);

  const loadCategories = useCallback(async () => {
    if (!db) return;
    const { data, error } = await db.from("categories").select("name,sort_order,is_active").order("sort_order").order("name");
    if (error) { setMessage(error.message); return; }
    setCategories((data || []) as CatalogCategory[]);
  }, [db]);

  const refreshCatalog = useCallback(async () => {
    await Promise.all([loadProducts(), loadCategories()]);
  }, [loadProducts, loadCategories]);

  const checkAccess = useCallback(async (nextUser: User | null) => {
    setLoading(true);
    setUser(nextUser);
    setAuthorized(false);
    if (!nextUser || !db) { setProducts([]); setCategories([]); setLoading(false); return; }
    const { data, error } = await db.rpc("is_admin");
    if (error || data !== true) {
      setMessage("Este usuário não tem acesso administrativo. Solicite a liberação da conta.");
      setLoading(false);
      return;
    }
    setMessage("");
    setAuthorized(true);
    await refreshCatalog();
    setLoading(false);
  }, [db, refreshCatalog]);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    let mounted = true;
    db.auth.getUser().then(({ data }) => { if (mounted) void checkAccess(data.user); });
    const { data: sub } = db.auth.onAuthStateChange((_event, session) => {
      if (mounted && !session) void checkAccess(null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [db, checkAccess]);

  async function login(event: FormEvent) {
    event.preventDefault();
    if (!db) return;
    setBusy(true); setMessage("");
    const { data, error } = await db.auth.signInWithPassword({ email: email.trim(), password });
    setPassword("");
    if (error) { setMessage("Login não autorizado. Confira seus dados."); setBusy(false); return; }
    await checkAccess(data.user);
    setBusy(false);
  }

  async function logout() {
    if (!db) return;
    await db.auth.signOut();
    setEditing(null);
    await checkAccess(null);
  }

  function newProduct() {
    setForm({ ...blankProduct, category: categories.find(c => c.is_active)?.name ?? categories[0]?.name ?? "", sort_order: products.length + 1 });
    setEditing("new");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editProduct(p: CatalogProduct) {
    setForm({
      name: p.name, description: p.description, price: Number(p.price),
      image_url: p.image_url, category: p.category, promotional_price: p.promotional_price ?? null,
      promotion_enabled: p.promotion_enabled ?? false, is_available: p.is_available,
      is_visible: p.is_visible, is_featured: p.is_featured, sort_order: p.sort_order,
    });
    setEditing(p.id); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function change<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !db || !authorized) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) {
      setMessage("Selecione uma imagem PNG, JPG, WebP ou AVIF."); return;
    }
    if (file.size > 5 * 1024 * 1024) { setMessage("A foto deve ter no máximo 5 MB."); return; }
    setBusy(true); setMessage("");
    const ext = ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" } as Record<string,string>)[file.type];
    const path = crypto.randomUUID() + "." + ext;
    const { error } = await db.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
    if (error) setMessage("Falha ao enviar foto: " + error.message);
    else {
      const { data } = db.storage.from("product-images").getPublicUrl(path);
      change("image_url", data.publicUrl);
      setMessage("Imagem enviada.");
    }
    setBusy(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!db || !authorized || editing === null) return;
    if (!form.name.trim() || !form.category.trim() || !Number.isFinite(form.price) || form.price <= 0 || form.price > 99999.99) {
      setMessage("Preencha nome, categoria e preço válido maior que zero."); return;
    }
    if (!categories.some(c => c.name === form.category)) { setMessage("Selecione uma categoria cadastrada."); return; }
    if (form.promotional_price != null && (!Number.isFinite(Number(form.promotional_price)) || Number(form.promotional_price) <= 0 || Number(form.promotional_price) >= Number(form.price))) {
      setMessage("O preço promocional deve ser maior que zero e menor que o preço original."); return;
    }
    if (form.promotion_enabled && form.promotional_price == null) {
      setMessage("Informe um preço promocional para ativar a oferta."); return;
    }
    if (!form.image_url.trim()) { setMessage("Envie ou informe a imagem do produto."); return; }
    setBusy(true); setMessage("");
    const payload = { ...form, name: form.name.trim(), description: form.description.trim(), category: form.category.trim(), image_url: form.image_url.trim(), promotional_price: form.promotional_price == null ? null : Number(form.promotional_price) };
    const result = editing === "new"
      ? await db.from("products").insert(payload).select("id")
      : await db.from("products").update(payload).eq("id", editing).select("id");
    if (result.error) setMessage(result.error.message);
    else if (!result.data?.length) setMessage("O banco não confirmou a gravação. Verifique suas permissões.");
    else { await loadProducts(); setEditing(null); setMessage("Produto salvo com sucesso."); }
    setBusy(false);
  }

  async function remove(product: CatalogProduct) {
    if (!db || !authorized || !window.confirm('Excluir "' + product.name + '"?')) return;
    setBusy(true); setMessage("");
    const { error } = await db.from("products").delete().eq("id", product.id);
    if (error) setMessage(error.message);
    else { await loadProducts(); setMessage("Produto excluído."); }
    setBusy(false);
  }

  async function toggle(product: CatalogProduct, key: "is_available" | "is_visible") {
    if (!db || !authorized) return;
    setBusy(true); setMessage("");
    const { error } = await db.from("products").update({ [key]: !product[key] }).eq("id", product.id);
    if (error) setMessage(error.message);
    else await loadProducts();
    setBusy(false);
  }

  const featured = products.filter(p => p.is_visible && p.is_available).length;
  const offers = products.filter(isOnSale).length;
  const outOfStock = products.filter(p => !p.is_available).length;
  const filteredProducts = products.filter(p => (p.name + " " + p.category).toLocaleLowerCase("pt-BR").includes(productSearch.toLocaleLowerCase("pt-BR").trim()));
  const field = "mt-1 w-full rounded-lg border border-[#644934] bg-[#171717] px-3 py-3 text-sm text-white outline-none focus:border-[#d9904e]";
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-9 text-[#f8f5f1] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#d9904e] hover:text-[#ffd7a9]"><ArrowLeft size={17} /> Voltar ao cardápio</Link>
        <div className="mt-8 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9904e]">DULÇO / ADMIN</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Painel administrativo</h1>
          </div>
          {authorized && <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-[#765338] px-4 py-3 text-sm hover:bg-white/10"><LogOut size={16}/> Sair</button>}
        </div>
        {!isSupabaseConfigured && <div className="rounded-xl border border-amber-600 bg-amber-900/20 p-6">O painel precisa da conexão com Supabase. Configure as variáveis da Vercel e execute a migração SQL antes de usar.</div>}
        {isSupabaseConfigured && loading && <p role="status">Verificando acesso...</p>}
        {isSupabaseConfigured && !loading && !authorized && (
          <form onSubmit={login} className="mx-auto max-w-md space-y-4 rounded-2xl border border-[#765338] bg-[#202020] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Entrar na administração</h2>
            <p className="text-sm text-[#a99b90]">Apenas contas autorizadas podem alterar o catálogo.</p>
            <label className="block text-sm">E-mail
              <input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className={field} />
            </label>
            <label className="block text-sm">Senha
              <input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={field} />
            </label>
            <button disabled={busy} className="w-full rounded-lg bg-[#bd753e] px-4 py-3 font-semibold text-white disabled:opacity-50">Entrar</button>
          </form>
        )}
        {message && <p role="status" className="my-5 rounded-lg border border-[#765338] bg-[#251c18] p-4 text-sm text-[#edc6a6]">{message}</p>}
        {authorized && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Produtos cadastrados", total: products.length, Icon: Boxes },
                { label: "Disponíveis e visíveis", total: featured, Icon: ShoppingBag },
                { label: "Em promoção", total: offers, Icon: BadgePercent },
                { label: "Categorias", total: categories.length, Icon: Layers3 },
              ].map(card => (
                <div key={card.label} className="rounded-xl border border-[#6a4b36] bg-[#202020] p-4 sm:p-5">
                  <card.Icon className="mb-4 text-[#d9904e]" size={23}/>
                  <p className="text-3xl font-bold text-white">{card.total}</p>
                  <p className="mt-2 text-xs text-[#b2a397]">{card.label}</p>
                </div>
              ))}
            </div>
            <nav aria-label="Seções administrativas" className="mb-8 flex gap-2 border-b border-[#60432e] pb-4">
              <button type="button" onClick={() => { setTab("products"); setEditing(null); }} aria-pressed={tab === "products"}
                className={"rounded-lg px-5 py-3 text-sm font-semibold " + (tab === "products" ? "bg-[#bd753e] text-white" : "bg-[#27211d] text-[#d0b39a] hover:bg-[#382b21]")}>Produtos</button>
              <button type="button" onClick={() => { setTab("categories"); setEditing(null); }} aria-pressed={tab === "categories"}
                className={"rounded-lg px-5 py-3 text-sm font-semibold " + (tab === "categories" ? "bg-[#bd753e] text-white" : "bg-[#27211d] text-[#d0b39a] hover:bg-[#382b21]")}>Categorias</button>
            </nav>
            {tab === "categories" ? (
              <CategoryManager db={db!} categories={categories} products={products} onUpdated={refreshCatalog}/>
            ) : editing === null ? (
              <>
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-sm text-[#b9aaa0]">{products.length} cadastrados · {outOfStock} esgotados</p>
                    <label className="relative block">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a99b90]" size={16}/>
                      <span className="sr-only">Buscar produtos cadastrados</span>
                      <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Buscar produtos..." type="search"
                        className="w-full rounded-lg border border-[#6e4d33] bg-[#171717] py-2 pl-9 pr-3 text-sm text-white placeholder:text-[#82766d] sm:w-72"/>
                    </label>
                  </div>
                  <button onClick={newProduct} className="inline-flex items-center gap-2 rounded-lg bg-[#bd753e] px-5 py-3 text-sm font-bold text-white hover:bg-[#d9904e]"><Plus size={18} /> Novo produto</button>
                </div>
                <div className="grid gap-4">
                  {filteredProducts.map(p => (
                    <article key={p.id} className="flex flex-col gap-4 rounded-xl border border-[#5a4334] bg-[#202020] p-4 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#2c2927]">
                        {p.image_url && <Image src={p.image_url} alt={p.name} fill unoptimized className="object-cover" sizes="96px" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-[#eab68c]">{p.name}</h2>
                        <p className="text-sm text-[#ab9f96]">{p.category} · {isOnSale(p) ? (
                          <><span className="mr-2 text-xs line-through">{priceFormat.format(Number(p.price))}</span>
                            <span className="font-semibold text-[#eeaf77]">{priceFormat.format(effectivePrice(p))}</span> <span className="text-xs text-[#eeaf77]">OFERTA</span></>
                        ) : priceFormat.format(Number(p.price))}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs">
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input type="checkbox" checked={p.is_available} disabled={busy} onChange={() => void toggle(p,"is_available")} /> Disponível
                          </label>
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input type="checkbox" checked={p.is_visible} disabled={busy} onChange={() => void toggle(p,"is_visible")} /> Visível
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editProduct(p)} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-[#876044] px-4 py-2 text-sm hover:bg-white/10"><Pencil size={15}/> Editar</button>
                        <button onClick={() => void remove(p)} disabled={busy} aria-label={"Excluir " + p.name} className="rounded-lg border border-red-800 px-3 py-2 text-red-300 hover:bg-red-900/20"><Trash2 size={17}/></button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={save} className="space-y-5 rounded-2xl border border-[#765338] bg-[#202020] p-5 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{editing === "new" ? "Novo produto" : "Editar produto"}</h2>
                  <button type="button" onClick={() => setEditing(null)} aria-label="Cancelar" className="rounded-lg p-2 hover:bg-white/10"><X size={20}/></button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">Nome *
                    <input required maxLength={120} value={form.name} onChange={e => change("name",e.target.value)} className={field} />
                  </label>
                  <label className="block text-sm">Preço (R$) *
                    <input required type="number" step="0.01" min="0.01" max="99999.99" value={form.price || ""} onChange={e => change("price",Number(e.target.value))} className={field} />
                  </label>
                  <label className="block text-sm">Categoria *
                    <select required value={form.category} onChange={e => change("category",e.target.value)} className={field}>
                      <option value="" disabled>Selecione uma categoria</option>
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}{!c.is_active ? " (oculta)" : ""}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm">Ordem de exibição
                    <input type="number" step="1" value={form.sort_order} onChange={e => change("sort_order",Number(e.target.value))} className={field} />
                  </label>
                </div>
                <label className="block text-sm">Descrição
                  <textarea rows={3} maxLength={500} value={form.description} onChange={e => change("description",e.target.value)} className={field} />
                </label>
                <div className="space-y-4 rounded-xl border border-[#765338] bg-[#191716] p-4">
                  <div className="flex items-center gap-2 text-[#e9b080]">
                    <BadgePercent size={20}/><h3 className="font-semibold">Preço promocional</h3>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.promotion_enabled ?? false} onChange={e => change("promotion_enabled",e.target.checked)}/>
                    Ativar promoção neste produto
                  </label>
                  <label className="block max-w-sm text-sm">Preço na promoção (R$)
                    <input type="number" step="0.01" min="0.01" max="99999.99" placeholder="Ex.: 12,00"
                      value={form.promotional_price ?? ""} onChange={e => change("promotional_price",e.target.value === "" ? null : Number(e.target.value))}
                      className={field}/>
                  </label>
                  {form.promotion_enabled && form.promotional_price != null && Number(form.promotional_price) < Number(form.price) && (
                    <p className="text-xs text-[#e9b080]">No cardápio: <span className="line-through">{priceFormat.format(form.price)}</span> {priceFormat.format(Number(form.promotional_price))}</p>
                  )}
                  <p className="text-xs leading-5 text-[#a99b90]">A promoção será aplicada automaticamente ao cardápio, carrinho e pedido pelo WhatsApp.</p>
                </div>
                <div>
                  <span className="mb-2 block text-sm">Foto do produto *</span>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#876044] px-4 py-3 text-sm hover:bg-white/10">
                    <ImagePlus size={19}/> {busy ? "Enviando..." : "Selecionar imagem"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={uploadImage} className="sr-only" />
                  </label>
                  <p className="mt-2 text-xs text-[#a99b90]">PNG, JPG, WebP ou AVIF; até 5 MB.</p>
                  <input type="url" placeholder="Ou URL completa da imagem" value={form.image_url.startsWith("/") ? "" : form.image_url}
                    onChange={e => change("image_url", e.target.value)} className={field} />
                  {form.image_url && <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-lg border border-[#705037]">
                    <Image src={form.image_url} alt="Prévia da imagem" fill unoptimized className="object-cover" sizes="160px" />
                  </div>}
                </div>
                <div className="flex flex-wrap gap-5 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_available} onChange={e => change("is_available",e.target.checked)}/> Disponível para compra</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_visible} onChange={e => change("is_visible",e.target.checked)}/> Visível no cardápio</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={e => change("is_featured",e.target.checked)}/> Em destaque</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#bd753e] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"><Save size={17}/> Salvar produto</button>
                  <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-[#876044] px-5 py-3 text-sm">Cancelar</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
