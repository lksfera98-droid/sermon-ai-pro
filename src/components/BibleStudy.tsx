import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Sparkles, Download, FileText } from "lucide-react";
import { LoadingProgress } from "@/components/LoadingProgress";
import { useLanguage } from "@/contexts/LanguageContext";
import jsPDF from "jspdf";

export const BibleStudy = () => {
  const [verseReference, setVerseReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [study, setStudy] = useState<{ reference: string; study: string } | null>(null);
  const { language } = useLanguage();

  const handleGenerateStudy = async () => {
    if (!verseReference.trim()) { toast.error("Por favor, digite um versículo"); return; }
    setIsLoading(true); setStudy(null);
    try {
      const { data, error } = await supabase.functions.invoke('bible-study', { body: { verseReference: verseReference.trim(), language } });
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "Versículo não encontrado");
      setStudy(data); toast.success("Estudo gerado!");
    } catch (error: any) { toast.error(error.message || "Erro ao gerar estudo"); }
    finally { setIsLoading(false); }
  };

  const formatStudyText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.match(/^\*\*.*\*\*/) || line.match(/^#+\s/)) {
        const cleanLine = line.replace(/^\*\*|\*\*$/g, '').replace(/^#+\s/, '');
        return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3">{cleanLine}</h3>;
      }
      if (line.trim()) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, i) => {
          if (part.match(/^\*\*.*\*\*$/)) return <strong key={i} className="font-bold">{part.replace(/^\*\*|\*\*$/g, '')}</strong>;
          return part;
        });
        return <p key={index} className="mb-3 leading-relaxed">{formattedLine}</p>;
      }
      return <br key={index} />;
    });
  };

  const downloadTXT = () => {
    if (!study) return;
    const blob = new Blob([`${study.reference}\n\n${study.study}`], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `estudo-biblico-${study.reference.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('Arquivo TXT baixado!');
  };

  const downloadPDF = () => {
    if (!study) return;
    const doc = new jsPDF();
    const margin = 20; const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    let yPosition = 20;
    doc.setFontSize(18); doc.setFont(undefined as any, 'bold');
    const titleLines = doc.splitTextToSize(study.reference, maxWidth);
    doc.text(titleLines, margin, yPosition); yPosition += titleLines.length * 10 + 10;
    doc.setFontSize(11);
    study.study.split('\n').forEach((line) => {
      if (yPosition > 270) { doc.addPage(); yPosition = 20; }
      if (line.match(/^\*\*.*\*\*/) || line.match(/^#+\s/)) {
        doc.setFont(undefined as any, 'bold'); doc.setFontSize(13);
        const cleanLine = line.replace(/^\*\*|\*\*$/g, '').replace(/^#+\s/, '');
        const headerLines = doc.splitTextToSize(cleanLine, maxWidth);
        doc.text(headerLines, margin, yPosition); yPosition += headerLines.length * 7 + 5; doc.setFontSize(11);
      } else if (line.trim()) {
        doc.setFont(undefined as any, 'normal');
        const textLines = doc.splitTextToSize(line, maxWidth);
        doc.text(textLines, margin, yPosition); yPosition += textLines.length * 6 + 3;
      } else { yPosition += 5; }
    });
    doc.save(`estudo-biblico-${study.reference.replace(/\s+/g, '-')}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {isLoading && <LoadingProgress message="Gerando estudo bíblico..." />}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/80 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg"><BookOpen className="h-8 w-8 text-primary" /></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">📖 Estudo Bíblico Profundo</h2>
            <p className="text-sm text-muted-foreground">Digite a referência do versículo (ex: João 3:16)</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verse-reference" className="text-base font-semibold">Referência do Versículo</Label>
            <Input id="verse-reference" placeholder="Ex: João 3:16, Salmos 23:1, Gênesis 1:1" value={verseReference} onChange={(e) => setVerseReference(e.target.value)} onKeyPress={(e: any) => e.key === 'Enter' && handleGenerateStudy()} className="text-base h-12" />
          </div>
          <Button onClick={handleGenerateStudy} disabled={isLoading || !verseReference.trim()} className="w-full h-14 text-lg font-semibold gap-2" size="lg">
            <Sparkles className="h-5 w-5" /> Gerar Estudo Completo
          </Button>
        </div>
      </Card>
      {study && (
        <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/80 border-2 border-primary/20">
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-border">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">📖 {study.reference}</h3>
              <div className="flex gap-3 justify-center">
                <Button onClick={downloadPDF} variant="outline" className="gap-2"><Download className="h-4 w-4" /> Baixar PDF</Button>
                <Button onClick={downloadTXT} variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Baixar TXT</Button>
              </div>
            </div>
            <div className="prose prose-lg max-w-none dark:prose-invert"><div className="text-foreground/90">{formatStudyText(study.study)}</div></div>
          </div>
        </Card>
      )}
    </div>
  );
};
