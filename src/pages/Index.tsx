
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="password-generator-theme">
      <div className="min-h-screen bg-background px-4 py-6 md:px-6 md:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Secure Password Generator</h1>
            </div>
            <ThemeToggle />
          </header>
          
          <main>
            <PasswordGenerator />
          </main>
          
          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>Generate strong, secure passwords for all your online accounts</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
