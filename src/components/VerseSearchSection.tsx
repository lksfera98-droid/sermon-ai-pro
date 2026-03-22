import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingProgress } from "@/components/LoadingProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Verse { reference: string; text: string; explanation: string; }

export const VerseSearchSection = () => {
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [introText, setIntroText] = useState<string>("");
  const [openVerses, setOpenVerses] = useState<Set<number>>(new Set());
  const { t } = useLanguage();

  const parseVerses = (text: string): { verses: Verse[], intro: string } => {
    const parsed: Verse[] = [];
    let intro = '';
    const introMatch = text.match(/^([\s\S]*?)(?=\*\*\[|^\d+\.\s*\*\*)/m);
    if (introMatch) intro = introMatch[1].trim();
    const blocks = text.split(/\n\n+/).filter(block => block.trim());
    for (const block of blocks) {
      if (block.includes('Como um especialista') || block.includes('grande satisfação') || block.includes('Aqui estão') || block.includes('Versículos Bíblicos sobre')) continue;
      let reference = '', verseText = '', explanation = '';
      const refMatch = block.match(/\*\*\[([^\]]+)\]\*\*|^\d+\.\s*\*\*([^*]+)\*\*|^([A-Za-zÀ-ÿ\s]+\d+:\d+[^"\n]*)/m);
      if (refMatch) reference = (refMatch[1] || refMatch[2] || refMatch[3] || '').trim();
      const verseMatch = block.match(/[">]\s*[""]?([^"""\n]+)[""]?/);
      if (verseMatch) verseText = verseMatch[1].trim();
      const explMatch = block.match(/\*(?:Explicação):\*?\s*(.+)/s);
      if (explMatch) explanation = explMatch[1].trim();
      if (reference && verseText) parsed.push({ reference, text: verseText, explanation });
      else if (block.trim() && block.length > 20 && !block.includes('especialista')) {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          const potentialRef = lines[0].replace(/[*#]/g, '').trim();
          if (potentialRef.match(/\d+:\d+/)) parsed.push({ reference: potentialRef, text: lines.slice(1).join(' ').replace(/[*"]/g, '').trim(), explanation: '' });
        }
      }
    }
    return { verses: parsed, intro };
  };

  const handleSearch = async () => {
    if (!word.trim()) { toast.error('Digite uma palavra'); return; }
    setIsLoading(true); setVerses([]); setIntroText(""); setOpenVerses(new Set());
    try {
      const { data, error } = await supabase.functions.invoke('search-verses', { body: { word: word.trim() } });
      if (error) { if (error.message?.includes('429')) throw new Error('Limite de uso atingido.'); throw error; }
      if (data.error) throw new Error(data.error);
      const { verses: parsedVerses, intro } = parseVerses(data.verses);
      setVerses(parsedVerses); setIntroText(intro);
      toast.success(t('search') + "!");
    } catch (error: any) { toast.error(error.message || "Erro ao pesquisar versículos."); }
    finally { setIsLoading(false); }
  };

  const toggleVerse = (index: number) => {
    const n = new Set(openVerses);
    if (n.has(index)) n.delete(index); else n.add(index);
    setOpenVerses(n);
  };

  return (
    <>
      {isLoading && <LoadingProgress message="Buscando versículos..." />}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('searchWord')}</label>
              <Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="amor, fé, esperança..." onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="w-full gap-2">
              {isLoading ? (<><Search className="h-4 w-4 animate-pulse" />Buscando versículos...</>) : (<><Search className="h-4 w-4" />{t('search')}</>)}
            </Button>
          </div>
        </Card>
        {introText && verses.length > 0 && (
          <Card className="p-4 bg-muted/50 border-primary/20"><p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{introText}</p></Card>
        )}
        {verses.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl md:text-2xl font-bold text-primary">{t('verseResults')}</h2>
            <div className="space-y-3">
              {verses.map((verse, index) => (
                <Collapsible key={index} open={openVerses.has(index)} onOpenChange={() => toggleVerse(index)}>
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-accent">
                        <span className="text-left font-bold text-primary">{verse.reference}</span>
                        {openVerses.has(index) ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-primary" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-sm md:text-base italic text-foreground leading-relaxed">"{verse.text}"</p>
                        {verse.explanation && (
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs md:text-sm text-muted-foreground"><span className="font-semibold text-primary">Explicação: </span>{verse.explanation}</p>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
