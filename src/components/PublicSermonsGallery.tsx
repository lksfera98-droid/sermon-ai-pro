import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Eye, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";

interface PublicSermon { id: string; title: string; content: string; language: string; theme: string; verse: string | null; created_at: string; user_id: string | null; }

export const PublicSermonsGallery = () => {
  const [sermons, setSermons] = useState<PublicSermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSermons, setExpandedSermons] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => setCurrentUserId(user?.id || null)); }, []);
  useEffect(() => { loadSermons(); }, []);

  const loadSermons = async () => {
    setIsLoading(true);
    try { const { data, error } = await supabase.from("public_sermons").select("*").eq("language", "pt").order("created_at", { ascending: false }); if (error) throw error; setSermons(data || []); }
    catch (error) { toast({ title: "Erro", description: "Erro ao carregar sermões", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const handleDownloadPDF = (sermon: PublicSermon) => {
    const doc = new jsPDF();
    const margin = 20; const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    let yPosition = margin;
    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(sermon.title, maxWidth);
    doc.text(titleLines, margin, yPosition); yPosition += titleLines.length * 7 + 10;
    doc.setFontSize(10); doc.setFont("helvetica", "italic");
    if (sermon.theme) { doc.text(`Tema: ${sermon.theme}`, margin, yPosition); yPosition += 7; }
    if (sermon.verse) { doc.text(`Verso: ${sermon.verse}`, margin, yPosition); yPosition += 10; }
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    sermon.content.split("\n").forEach((line) => {
      if (yPosition > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); yPosition = margin; }
      if (line.trim()) { const wl = doc.splitTextToSize(line, maxWidth); doc.text(wl, margin, yPosition); yPosition += wl.length * 6; } else { yPosition += 6; }
    });
    doc.save(`${sermon.title.substring(0, 30)}.pdf`);
    toast({ title: "Sucesso", description: "Download realizado com sucesso" });
  };

  const toggleSermonExpanded = (sermonId: string) => {
    const n = new Set(expandedSermons);
    if (n.has(sermonId)) n.delete(sermonId); else n.add(sermonId);
    setExpandedSermons(n);
  };

  const handleDeleteSermon = async (sermonId: string) => {
    try { const { error } = await supabase.from("public_sermons").delete().eq("id", sermonId); if (error) throw error; setSermons(sermons.filter(s => s.id !== sermonId)); toast({ title: "Sucesso", description: "Sermão excluído" }); }
    catch (error) { toast({ title: "Erro", description: "Erro ao excluir sermão", variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold mb-2">Galeria de Sermões</h2><p className="text-muted-foreground">Explore sermões compartilhados por pregadores de todo o mundo</p></div>
      {sermons.length === 0 ? (<Card className="p-8 text-center"><p className="text-muted-foreground">Nenhum sermão disponível ainda</p></Card>) : (
        <div className="grid gap-4">
          {sermons.map((sermon) => {
            const isExpanded = expandedSermons.has(sermon.id);
            return (
              <Card key={sermon.id} className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{sermon.title}</h3>
                  {sermon.theme && <p className="text-sm text-muted-foreground">Tema: {sermon.theme}</p>}
                  {sermon.verse && <p className="text-sm text-muted-foreground">Verso: {sermon.verse}</p>}
                </div>
                {isExpanded && <div className="mt-4 p-4 bg-muted/30 rounded-lg max-h-96 overflow-y-auto"><div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{sermon.content}</div></div>}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{format(new Date(sermon.created_at), "dd/MM/yyyy")}</div>
                  <div className="flex-1" />
                  <Button onClick={() => toggleSermonExpanded(sermon.id)} variant="outline" size="sm">
                    {isExpanded ? (<><ChevronUp className="h-4 w-4 mr-2" />Ocultar</>) : (<><Eye className="h-4 w-4 mr-2" />Ler Sermão</>)}
                  </Button>
                  <Button onClick={() => handleDownloadPDF(sermon)} variant="default" size="sm"><Download className="h-4 w-4 mr-2" />Baixar PDF</Button>
                  {currentUserId && sermon.user_id === currentUserId && <Button onClick={() => handleDeleteSermon(sermon.id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2" />Excluir</Button>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
