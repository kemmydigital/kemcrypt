
import { useState, useEffect } from "react";
import { 
  generatePassword, 
  PasswordOptions as PasswordOptionsType,
  PasswordHistoryItem,
  savePasswordToHistory,
  getPasswordHistory
} from "@/utils/passwordUtils";
import { PasswordDisplay } from "@/components/PasswordDisplay";
import { PasswordOptions } from "@/components/PasswordOptions";
import { PasswordHistory } from "@/components/PasswordHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptionsType>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    avoidSimilarCharacters: false,
  });
  
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    setHistory(getPasswordHistory());
  }, []);
  
  // Generate password when component mounts
  useEffect(() => {
    handleGeneratePassword();
  }, []);
  
  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    
    // Save to history and update state
    savePasswordToHistory(newPassword, calculateStrength(newPassword));
    setHistory(getPasswordHistory());
  };
  
  const handleOptionsChange = (newOptions: PasswordOptionsType) => {
    setOptions(newOptions);
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem('passwordHistory');
    setHistory([]);
  };
  
  // Helper to calculate strength without the reasons
  const calculateStrength = (pwd: string) => {
    // Import at component level to avoid circular dependency
    const { calculatePasswordStrength } = require('@/utils/passwordUtils');
    return calculatePasswordStrength(pwd).strength;
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:gap-12 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <PasswordDisplay 
          password={password} 
          onGenerateNew={handleGeneratePassword} 
        />
        
        <Card>
          <CardContent className="pt-6">
            <PasswordOptions 
              options={options}
              onOptionsChange={handleOptionsChange}
              onGenerate={handleGeneratePassword}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="hidden md:block sticky top-20">
          <Card>
            <CardContent className="pt-6">
              <PasswordHistory 
                history={history}
                onClearHistory={handleClearHistory}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:hidden mt-6">
          <Separator className="my-6" />
          <PasswordHistory 
            history={history}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
