import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import { BookOpen, Lightbulb, Search, PenTool, Layers, ArrowRight, ChevronRight } from "lucide-react";

const features = [
  { icon: Lightbulb, title: "Geração de Esboços", desc: "Crie estruturas completas de sermão com introdução, pontos principais e conclusão em segundos." },
  { icon: Search, title: "Busca de Escrituras", desc: "Encontre versículos relevantes por tema, palavra-chave ou referência bíblica rapidamente." },
  { icon: PenTool, title: "Editor de Notas", desc: "Escreva, organize e refine suas anotações com um editor focado e sem distrações." },
  { icon: Layers, title: "Biblioteca de Sermões", desc: "Salve, categorize e reutilize seus sermões organizados por tema, livro ou data." },
];

const steps = [
  { num: "01", title: "Escolha um tema", desc: "Defina o assunto, texto bíblico ou ocasião do sermão." },
  { num: "02", title: "Gere o esboço", desc: "A IA cria uma estrutura com pontos, ilustrações e aplicações." },
  { num: "03", title: "Personalize", desc: "Edite, adicione notas pessoais e referências bíblicas." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <ScrollReveal>
            <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
              Ferramenta para Pregadores
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl" style={{ textWrap: "balance", lineHeight: 1.08 }}>
              Prepare sermões com
              <br className="hidden sm:block" />
              clareza e profundidade
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg" style={{ textWrap: "pretty" }}>
              Sermon Pro AI ajuda pastores e pregadores a criar esboços estruturados,
              encontrar escrituras relevantes e organizar suas anotações — tudo em um só lugar.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/workspace">
                <Button size="lg" className="gap-2 px-6 shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]">
                  Criar Sermão <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 active:scale-[0.97]">
                  Ver Sermões <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </section>

      <section id="features" className="border-t border-border/50 bg-card px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" style={{ textWrap: "balance" }}>
              Tudo que você precisa para preparar sermões
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              Ferramentas práticas pensadas para o dia a dia do ministério pastoral.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="group rounded-xl border border-border/60 bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Como funciona</h2>
          </ScrollReveal>

          <div className="mt-14 flex flex-col gap-8 sm:gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 100}>
                <div className="flex items-start gap-5 rounded-xl border border-border/40 bg-card p-5 sm:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground tabular-nums">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Pronto para começar?</h2>
            <p className="mt-3 text-muted-foreground">Comece agora e prepare seu próximo sermão com a ajuda da IA.</p>
            <Link to="/workspace">
              <Button size="lg" className="mt-6 gap-2 shadow-md shadow-primary/20 active:scale-[0.97]">
                Criar meu primeiro sermão <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border/50 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span>&copy; 2026 Sermon Pro AI. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-foreground">Início</Link>
            <Link to="/dashboard" className="hover:text-foreground">Sermões</Link>
            <Link to="/workspace" className="hover:text-foreground">Novo Sermão</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
