import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BookOpen, Calendar, Tag } from "lucide-react";

interface Sermon {
  id: string;
  title: string;
  theme: string;
  date: string;
  scripture: string;
  status: "rascunho" | "pronto";
}

const sampleSermons: Sermon[] = [
  { id: "1", title: "A fé que move montanhas", theme: "Fé", date: "2026-03-20", scripture: "Mateus 17:20", status: "pronto" },
  { id: "2", title: "O amor incondicional de Deus", theme: "Amor", date: "2026-03-15", scripture: "João 3:16", status: "pronto" },
  { id: "3", title: "Renovando as forças", theme: "Esperança", date: "2026-03-10", scripture: "Isaías 40:31", status: "rascunho" },
  { id: "4", title: "Servindo ao próximo", theme: "Serviço", date: "2026-03-05", scripture: "Marcos 10:45", status: "rascunho" },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const filtered = sampleSermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.theme.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Sermões</h1>
              <p className="mt-1 text-sm text-muted-foreground">{sampleSermons.length} sermões salvos</p>
            </div>
            <Link to="/workspace">
              <Button className="gap-2 active:scale-[0.97]"><Plus className="h-4 w-4" /> Novo Sermão</Button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por título, tema ou escritura..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </ScrollReveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((sermon, i) => (
            <ScrollReveal key={sermon.id} delay={i * 70}>
              <Link to="/workspace" className="block">
                <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <Badge variant={sermon.status === "pronto" ? "default" : "secondary"} className="text-xs">
                      {sermon.status === "pronto" ? "Pronto" : "Rascunho"}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">{sermon.title}</h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{sermon.theme}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{sermon.scripture}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{sermon.date}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <ScrollReveal>
            <div className="mt-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">Nenhum sermão encontrado.</p>
              <Link to="/workspace">
                <Button variant="outline" className="mt-4 gap-2"><Plus className="h-4 w-4" /> Criar Sermão</Button>
              </Link>
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
