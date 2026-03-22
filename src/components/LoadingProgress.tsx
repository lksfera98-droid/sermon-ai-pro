import { Loader2 } from "lucide-react";

interface LoadingProgressProps {
  message?: string;
}

export const LoadingProgress = ({ message }: LoadingProgressProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Loader2 className="h-16 w-16 text-primary/30" />
            </div>
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <div className="w-full space-y-3">
            <p className="text-center text-lg font-semibold text-foreground">
              {message || "Processando..."}
            </p>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="h-3 w-3 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
