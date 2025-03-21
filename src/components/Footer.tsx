
import { Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-4 bg-background/80 backdrop-blur-md">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          © {currentYear} QReative. All rights reserved.
        </p>
        <a
          href="https://github.com/yourusername/qreative"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>Source Code</span>
        </a>
      </div>
    </footer>
  );
}
