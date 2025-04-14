
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { Copy, Download, Eye, EyeOff, RefreshCw } from "lucide-react";
import { copyToClipboard, downloadAsFile } from "../utils/passwordUtils";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PasswordDisplayProps {
  password: string;
  onGenerateNew: () => void;
  className?: string;
}

export function PasswordDisplay({ 
  password, 
  onGenerateNew, 
  className 
}: PasswordDisplayProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      toast({
        description: "Password copied to clipboard",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Failed to copy password",
      });
    }
  };

  const handleDownload = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    downloadAsFile(password, `password-${formattedDate}.txt`);
    toast({
      description: "Password downloaded as text file",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
        <div className="font-mono text-lg break-all">
          {showPassword ? password : password.replace(/./g, '•')}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            aria-label="Copy password"
          >
            <Copy size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload}
            aria-label="Download password"
          >
            <Download size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onGenerateNew}
            aria-label="Generate new password"
          >
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>
      
      <PasswordStrengthIndicator password={password} />
    </div>
  );
}
