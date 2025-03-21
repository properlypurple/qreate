
import { ThemeToggle } from "./ThemeToggle";
import { QrCode, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <QrCode className="h-6 w-6 text-brand-primary" />
          <h1 className="text-lg font-semibold md:text-xl">QReative</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-all duration-300 ease-in-out"
            asChild
          >
            <a href="https://github.com/your-repo/qreative" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
