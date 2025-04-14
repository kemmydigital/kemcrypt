
import { Button } from "@/components/ui/button";
import { PasswordHistoryItem, copyToClipboard } from "@/utils/passwordUtils";
import { Copy, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface PasswordHistoryProps {
  history: PasswordHistoryItem[];
  onClearHistory: () => void;
  className?: string;
}

export function PasswordHistory({ 
  history, 
  onClearHistory,
  className 
}: PasswordHistoryProps) {
  const { toast } = useToast();

  const handleCopy = async (password: string) => {
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

  const getStrengthClass = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'bg-strength-weak text-white';
      case 'medium':
        return 'bg-strength-medium text-white';
      case 'strong':
        return 'bg-strength-strong text-white';
      case 'very-strong':
        return 'bg-strength-verystrong text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  if (history.length === 0) {
    return (
      <div className={cn("text-center p-4 text-muted-foreground text-sm", className)}>
        No password history yet
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium">Password History</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          className="text-xs"
        >
          <Trash className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="space-y-2">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between rounded-md border p-2 text-sm"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div 
                className={cn(
                  "px-2 py-0.5 text-[10px] uppercase tracking-wider rounded", 
                  getStrengthClass(item.strength)
                )}
              >
                {item.strength === 'very-strong' ? 'very strong' : item.strength}
              </div>
              <div className="font-mono truncate">{item.password}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(item.password)}
              className="h-7 w-7"
            >
              <Copy size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
