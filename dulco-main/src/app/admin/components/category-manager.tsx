"use client";

import { useState, type FormEvent } from "react";
import { Check, FolderPlus, Pencil, Save, Trash2, X } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog";

type Props = {
  db: SupabaseClient;
  categories: CatalogCategory[];
  products: CatalogProduct[];
  onUpdated: () => Promise<void>;
};

const field = "w-full rounded-lg border border-[#6b4b33] bg-[#151515] p-3 text-sm text-white outline-none focus:border-[#e2a16a]";

export default function CategoryManager({ db, categories, products, onUpdated }: Props) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function edit(c: CatalogCategory) {
    setEditing(c.name);
    setName(c.name);
    setSortOrder(c.sort_order);
    setIsActive(c.is_active);
    setMessage("");
  }

  function create() {
    setEditing("new");
    setName("");
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setMessage("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || !name.trim() || !Number.isInteger(sortOrder)) return;
    setBusy(true);
    setMessage("");
    const payload = { name: name.trim(), sort_order: sortOrder, is_active: isActive };
    const result = editing === "new"
      ? await db.from("categories").insert(payload).select("name")
      : await db.from("categories").update(payload).eq("name", editing).select("name");
    if (result.error) {
      setMessage(result.error.code === "23505" ? "Já existe uma categoria com esse nome." : result.error.message);
    } else if (!result.data?.length) {
      setMessage("A alteração não foi registrada. Verifique suas permissões.");
    } else {
      await onUpdated();
      setEditing(null);
      setMessage("Categoria salva com sucesso.");
    }
    setBusy(false);
  }

  async function remove(c: CatalogCategory) {
    const quantity = products.filter(p => p.category === c.name).length;
    if (quantity) {
      setMessage("Mova os " + quantity + " produto(s) de \"" + c.name + "\" para outra categoria antes de excluí-la.");
      return;
    }
    if (!window.confirm('Excluir a categoria "' + c.name + '"?')) return;
    setBusy(true);
    setMessage("");
    const { data, error } = await db.from("categories").delete().eq("name", c.name).select("name");
    if (error) setMessage(error.message);
    else if (!data?.length) setMessage("Categoria não excluída. Confira suas permissões.");
    else { await onUpdated(); setMessage("Categoria excluída."); }
    setBusy(false);
  }

  return (
    <section className="space-y-5" aria-label="Gerenciamento de categorias">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Categorias do cardápio</h2>
          <p className="mt-1 text-sm text-[#a99b90]">Renomear uma categoria atualiza os produtos automaticamente.</p>
        </div>
        <button type="button" onClick={create} disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[#bd753e] px-5 py-3 text-sm font-bold text-white hover:bg-[#d9904e]">
          <FolderPlus size={18}/> Nova categoria
        </button>
      </div>

      {message && <p role="status" className="rounded-lg border border-[#80583a] bg-[#251c18] p-4 text-sm text-[#f1c5a0]">{message}</p>}

      {editing !== null && (
        <form onSubmit={save} className="grid gap-4 rounded-xl border border-[#7b5438] bg-[#202020] p-5 sm:grid-cols-[2fr_1fr]">
          <label className="block text-sm">
            Nome da categoria
            <input autoFocus required maxLength={60} value={name} onChange={e => setName(e.target.value)} className={"mt-2 " + field}/>
          </label>
          <label className="block text-sm">
            Ordem de exibição
            <input type="number" step="1" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className={"mt-2 " + field}/>
          </label>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}/>
              Mostrar filtro no cardápio
            </label>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#bd753e] px-5 py-3 text-sm font-bold disabled:opacity-50">
              <Save size={16}/> Salvar categoria
            </button>
            <button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-sm text-[#d8beaa]"><X size={16}/> Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {categories.map(c => {
          const count = products.filter(p => p.category === c.name).length;
          return (
            <article key={c.name} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#5a4334] bg-[#202020] p-4">
              <div>
                <h3 className="font-semibold text-[#f3d1b4]">{c.name}</h3>
                <p className="mt-1 text-xs text-[#a99b90]">{count} {count === 1 ? "produto" : "produtos"} · Ordem {c.sort_order}</p>
                <p className={"mt-2 inline-flex items-center gap-1 text-xs " + (c.is_active ? "text-emerald-300" : "text-[#b7a095]")}>
                  <Check size={12}/>{c.is_active ? "Filtro visível" : "Filtro oculto"}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => edit(c)} className="inline-flex items-center gap-2 rounded-lg border border-[#876044] px-4 py-2 text-sm hover:bg-white/10">
                  <Pencil size={15}/> Editar
                </button>
                <button type="button" disabled={busy || count > 0} title={count > 0 ? "Mova os produtos antes de excluir" : "Excluir categoria"}
                  aria-label={"Excluir categoria " + c.name} onClick={() => void remove(c)}
                  className="rounded-lg border border-red-800 px-3 py-2 text-red-300 transition hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-40">
                  <Trash2 size={17}/>
                </button>
              </div>
            </article>
          );
        })}
        {categories.length === 0 && <p className="rounded-xl border border-[#5a4334] p-8 text-center text-[#b9aaa0]">Nenhuma categoria cadastrada.</p>}
      </div>
    </section>
  );
}
