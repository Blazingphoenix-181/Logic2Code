import { CodeGenerator } from "@/components/code-generator";
import { Code, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-8">
          <CodeGenerator />
        </div>
      </main>
      <footer className="py-6 border-t border-border/20">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-center text-muted-foreground">
            Made by Sagnik Chatterjee
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="w-24 h-px bg-border/50"></span>
            <div className="flex items-center gap-2">
              <Code size={16} /> LOGIC2CODE INTELLIGENCE SYSTEM
            </div>
            <span className="w-24 h-px bg-border/50"></span>
          </div>
          <a
            href="mailto:sagnik@example.com"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground"
          >
            <Mail size={16} /> Contact Me
          </a>
        </div>
      </footer>
    </div>
  );
}
