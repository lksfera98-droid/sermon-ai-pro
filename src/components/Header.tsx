import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-active:scale-95">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Sermon<span className="text-primary">Pro</span> AI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isLanding ? (
            <>
              <a href="#features" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Recursos</a>
              <a href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Como funciona</a>
            </>
          ) : (
            <Link to="/" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Início</Link>
          )}
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="ml-2">Meus Sermões</Button>
          </Link>
          <Link to="/workspace">
            <Button size="sm" className="ml-1">Novo Sermão</Button>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden active:scale-95"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {isLanding && (
              <>
                <a href="#features" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">Recursos</a>
                <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">Como funciona</a>
              </>
            )}
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground">Meus Sermões</Link>
            <Link to="/workspace" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="mt-2 w-full">Novo Sermão</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
