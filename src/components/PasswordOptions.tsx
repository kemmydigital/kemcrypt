
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { PasswordOptions as PasswordOptionsType } from "@/utils/passwordUtils";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface PasswordOptionsProps {
  options: PasswordOptionsType;
  onOptionsChange: (options: PasswordOptionsType) => void;
  onGenerate: () => void;
  className?: string;
}

export function PasswordOptions({ 
  options, 
  onOptionsChange, 
  onGenerate,
  className 
}: PasswordOptionsProps) {
  const handleCheckboxChange = (
    key: keyof Omit<PasswordOptionsType, "length">,
    checked: boolean
  ) => {
    onOptionsChange({ ...options, [key]: checked });
  };

  const handleLengthChange = (values: number[]) => {
    onOptionsChange({ ...options, length: values[0] });
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="length" className="text-base">Length: {options.length}</Label>
            <span className="text-sm text-muted-foreground">(6-50 characters)</span>
          </div>
          <Slider
            id="length"
            min={6}
            max={50}
            step={1}
            value={[options.length]}
            onValueChange={handleLengthChange}
            className="py-2"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">Include:</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeUppercase"
              checked={options.includeUppercase}
              onCheckedChange={(checked) => 
                handleCheckboxChange("includeUppercase", checked as boolean)
              }
            />
            <Label htmlFor="includeUppercase" className="text-sm cursor-pointer">
              Uppercase Letters (A-Z)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeLowercase"
              checked={options.includeLowercase}
              onCheckedChange={(checked) => 
                handleCheckboxChange("includeLowercase", checked as boolean)
              }
            />
            <Label htmlFor="includeLowercase" className="text-sm cursor-pointer">
              Lowercase Letters (a-z)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeNumbers"
              checked={options.includeNumbers}
              onCheckedChange={(checked) => 
                handleCheckboxChange("includeNumbers", checked as boolean)
              }
            />
            <Label htmlFor="includeNumbers" className="text-sm cursor-pointer">
              Numbers (0-9)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeSymbols"
              checked={options.includeSymbols}
              onCheckedChange={(checked) => 
                handleCheckboxChange("includeSymbols", checked as boolean)
              }
            />
            <Label htmlFor="includeSymbols" className="text-sm cursor-pointer">
              Symbols (!@#$%^&*()_+)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox 
              id="avoidSimilarCharacters"
              checked={options.avoidSimilarCharacters}
              onCheckedChange={(checked) => 
                handleCheckboxChange("avoidSimilarCharacters", checked as boolean)
              }
            />
            <Label htmlFor="avoidSimilarCharacters" className="text-sm cursor-pointer">
              Avoid similar characters (1, l, I, 0, O)
            </Label>
          </div>
        </div>

        <Button 
          onClick={onGenerate} 
          className="w-full"
          size="lg"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Password
        </Button>
      </div>
    </div>
  );
}
