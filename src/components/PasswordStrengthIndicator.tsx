
import { calculatePasswordStrength, PasswordStrength } from "@/utils/passwordUtils";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  className 
}: PasswordStrengthIndicatorProps) {
  const { strength, reasons } = calculatePasswordStrength(password);
  
  const getColorClass = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak':
        return 'bg-strength-weak';
      case 'medium':
        return 'bg-strength-medium';
      case 'strong':
        return 'bg-strength-strong';
      case 'very-strong':
        return 'bg-strength-verystrong';
      default:
        return 'bg-strength-weak';
    }
  };
  
  const getStrengthLevel = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak':
        return 1;
      case 'medium':
        return 2;
      case 'strong':
        return 3;
      case 'very-strong':
        return 4;
      default:
        return 0;
    }
  };
  
  const strengthLevel = getStrengthLevel(strength);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm text-muted-foreground">Password Strength</div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-full rounded-full transition-all duration-300",
              {
                [getColorClass(strength)]: level <= strengthLevel,
                "bg-muted": level > strengthLevel
              }
            )}
          />
        ))}
      </div>
      <div className="mt-1 text-sm capitalize">
        {strength === 'very-strong' ? 'Very Strong' : strength}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {reasons.join(', ')}
      </div>
    </div>
  );
}
