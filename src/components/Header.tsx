
import { ThemeToggle } from "./ThemeToggle";
import { QrCode } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <QrCode className="h-6 w-6 text-brand-primary" />
          <h1 className="text-lg font-semibold md:text-xl">QReative</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
