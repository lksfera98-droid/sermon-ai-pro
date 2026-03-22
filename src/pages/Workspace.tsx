import { useState } from "react";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookOpen, PenTool, Sparkles, Plus, Trash2, Copy, Search } from "lucide-react";
import { toast } from "sonner";

interface OutlinePoint {
  id: string;
  text: string;
  subpoints: string[];
}

const sampleOutline: OutlinePoint[] = [
  { id: "1", text: "Introdução — O contexto da passagem", subpoints: ["Contexto histórico", "Público original"] },
  { id: "2", text: "Ponto 1 — A promessa de Deus", subpoints: ["Base bíblica", "Aplicação prática"] },
  { id: "3", text: "Ponto 2 — Nossa resposta de fé", subpoints: ["Exemplos bíblicos", "Desafios contemporâneos"] },
  { id: "4", text: "Conclusão e Apelo", subpoints: ["Resumo dos pontos", "Chamado à ação"] },
];

const sampleVerses = [
  { ref: "Hebreus 11:1", text: "Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos." },
  { ref: "Romanos 10:17", text: "De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus." },
  { ref: "Tiago 2:26", text: "Porque, assim como o corpo sem espírito está morto, assim também a fé sem obras é morta." },
  { ref: "Marcos 11:22-23", text: "Jesus respondeu-lhes: Tende fé em Deus. Porque em verdade vos digo que qualquer que disser a este monte: Ergue-te e lança-te no mar..." },
];

const Workspace = () => {
  const [title, setTitle] = useState("A fé que move montanhas");
  const [theme, setTheme] = useState("Fé");
  const [scripture, setScripture] = useState("Mateus 17:20");
  const [notes, setNotes] = useState(
    "Lembrar de conectar a passagem com a realidade da igreja local.\n\nIlustração: história do grão de mostarda — usar objeto visual durante a pregação.\n\nPonto de aplicação: convidar a congregação a compartilhar testemunhos de fé."
  );
  const [outline, setOutline] = useState<OutlinePoint[]>(sampleOutline);
  const [searchVerse, setSearchVerse] = useState("");

  const filteredVerses = sampleVerses.filter(
    (v) => v.ref.toLowerCase().includes(searchVerse.toLowerCase()) || v.text.toLowerCase().includes(searchVerse.toLowerCase())
  );

  const addOutlinePoint = () => {
    setOutline([...outline, { id: Date.now().toString(), text: "Novo ponto", subpoints: [] }]);
  };

  const removeOutlinePoint = (id: string) => {
    setOutline(outline.filter((p) => p.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-transparent p-0 text-2xl font-bold tracking-tight text-foreground shadow-none focus-visible:ring-0 sm:text-3xl"
                placeholder="Título do sermão"
              />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1 text-xs"><BookOpen className="h-3 w-3" /> {scripture}</Badge>
                <Badge variant="secondary" className="gap-1 text-xs">{theme}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 active:scale-[0.97]" onClick={() => toast.success("Sermão salvo!")}>Salvar</Button>
              <Button size="sm" className="gap-1.5 active:scale-[0.97]" onClick={() => toast("IA gerando esboço...", { description: "Habilite o Lovable Cloud para usar a IA." })}>
                <Sparkles className="h-3.5 w-3.5" /> Gerar com IA
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="mt-6 grid gap-4 rounded-xl border border-border/60 bg-card p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Texto Base</label>
              <Input value={scripture} onChange={(e) => setScripture(e.target.value)} placeholder="Ex: João 3:16" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Tema</label>
              <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex: Fé, Amor, Graça" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ocasião</label>
              <Input placeholder="Ex: Culto dominical, Casamento" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <Tabs defaultValue="outline" className="mt-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="outline" className="gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> Esboço</TabsTrigger>
              <TabsTrigger value="scriptures" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Escrituras</TabsTrigger>
              <TabsTrigger value="notes" className="gap-1.5"><PenTool className="h-3.5 w-3.5" /> Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="outline" className="mt-4 space-y-3">
              {outline.map((point) => (
                <div key={point.id} className="group rounded-lg border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Input
                      value={point.text}
                      onChange={(e) => setOutline(outline.map((p) => p.id === point.id ? { ...p, text: e.target.value } : p))}
                      className="border-none bg-transparent p-0 font-medium shadow-none focus-visible:ring-0"
                    />
                    <button onClick={() => removeOutlinePoint(point.id)} className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 active:scale-95">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {point.subpoints.length > 0 && (
                    <ul className="mt-2 ml-4 space-y-1 border-l-2 border-primary/20 pl-3">
                      {point.subpoints.map((sub, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 active:scale-[0.97]" onClick={addOutlinePoint}>
                <Plus className="h-3.5 w-3.5" /> Adicionar ponto
              </Button>
            </TabsContent>

            <TabsContent value="scriptures" className="mt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar versículos por referência ou palavra..." value={searchVerse} onChange={(e) => setSearchVerse(e.target.value)} className="pl-9" />
              </div>
              <div className="space-y-3">
                {filteredVerses.map((v) => (
                  <div key={v.ref} className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm">
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-primary">{v.ref}</span>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">{v.text}</p>
                    </div>
                    <button onClick={() => copyToClipboard(`${v.ref} — ${v.text}`)} className="shrink-0 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 active:scale-95" title="Copiar">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {filteredVerses.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum versículo encontrado.</p>}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Escreva suas anotações aqui..." className="min-h-[320px] resize-y text-sm leading-relaxed" />
              <p className="mt-2 text-xs text-muted-foreground">{notes.length} caracteres</p>
            </TabsContent>
          </Tabs>
        </ScrollReveal>
      </main>
    </div>
  );
};

export default Workspace;
