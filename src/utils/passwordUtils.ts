export type PasswordOptions = {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidSimilarCharacters: boolean;
};

export type PasswordHistoryItem = {
  password: string;
  strength: PasswordStrength;
  timestamp: number;
  id: string;
};

export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

// Character sets for password generation
const LOWERCASE_CHARS = 'abcdefghijkmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const NUMBER_CHARS = '23456789';
const SYMBOL_CHARS = '!@#$%^&*()_+{}[]|:;<>,.?/~';
const SIMILAR_LOWERCASE = 'l';
const SIMILAR_UPPERCASE = 'IO';
const SIMILAR_NUMBERS = '10';

/**
 * Generates a password based on the provided options
 */
export const generatePassword = (options: PasswordOptions): string => {
  let chars = '';
  
  if (options.includeLowercase) {
    chars += options.avoidSimilarCharacters 
      ? LOWERCASE_CHARS 
      : LOWERCASE_CHARS + SIMILAR_LOWERCASE;
  }
  
  if (options.includeUppercase) {
    chars += options.avoidSimilarCharacters 
      ? UPPERCASE_CHARS 
      : UPPERCASE_CHARS + SIMILAR_UPPERCASE;
  }
  
  if (options.includeNumbers) {
    chars += options.avoidSimilarCharacters 
      ? NUMBER_CHARS 
      : NUMBER_CHARS + SIMILAR_NUMBERS;
  }
  
  if (options.includeSymbols) {
    chars += SYMBOL_CHARS;
  }
  
  // If no character sets are selected, default to lowercase
  if (chars.length === 0) {
    chars = options.avoidSimilarCharacters 
      ? LOWERCASE_CHARS 
      : LOWERCASE_CHARS + SIMILAR_LOWERCASE;
  }
  
  let password = '';
  const charsLength = chars.length;
  
  // Generate the password
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    password += chars[randomIndex];
  }
  
  return password;
};

/**
 * Calculates the strength of a password
 * Returns: { strength: 'weak' | 'medium' | 'strong' | 'very-strong', reasons: string[] }
 */
export const calculatePasswordStrength = (password: string): { 
  strength: PasswordStrength, 
  reasons: string[] 
} => {
  const reasons: string[] = [];
  
  // If no password, return weak
  if (!password) {
    return { strength: 'weak', reasons: ['No password provided'] };
  }
  
  // Initial score based on length
  let score = 0;
  const length = password.length;
  
  if (length < 8) {
    score += 1;
    reasons.push('Password is too short');
  } else if (length < 12) {
    score += 2;
    reasons.push('Decent length');
  } else if (length < 16) {
    score += 3;
    reasons.push('Good length');
  } else {
    score += 4;
    reasons.push('Excellent length');
  }
  
  // Check for character variety
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  
  let charTypeCount = 0;
  
  if (hasLowercase) {
    charTypeCount++;
    score += 1;
  }
  
  if (hasUppercase) {
    charTypeCount++;
    score += 1;
  }
  
  if (hasNumbers) {
    charTypeCount++;
    score += 1;
  }
  
  if (hasSymbols) {
    charTypeCount++;
    score += 1;
  }
  
  // Add reason based on character variety
  if (charTypeCount === 1) {
    reasons.push('Only one type of characters');
  } else if (charTypeCount === 2) {
    reasons.push('Uses two types of characters');
  } else if (charTypeCount === 3) {
    reasons.push('Good variety of characters');
  } else if (charTypeCount === 4) {
    reasons.push('Excellent variety of characters');
  }
  
  // Check for repeating characters
  const repeatingChars = password.match(/(.)\1{2,}/g);
  if (repeatingChars) {
    score -= repeatingChars.length;
    reasons.push('Contains repeating characters');
  }
  
  // Determine strength based on final score
  let strength: PasswordStrength;
  
  if (score < 4) {
    strength = 'weak';
  } else if (score < 6) {
    strength = 'medium';
  } else if (score < 8) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }
  
  return { strength, reasons };
};

/**
 * Generates a simple UUID (RFC4122 version 4 compliant) fallback
 */
const generateUUID = (): string => {
  // Generate random hex digits
  const hex = [...Array(36)].map(() => Math.floor(Math.random() * 16).toString(16));
  // Insert version and variant bits
  hex[14] = '4';
  hex[19] = (parseInt(hex[19], 16) & 0x3 | 0x8).toString(16);
  // Insert dashes
  hex[8] = hex[13] = hex[18] = hex[23] = '-';
  return hex.join('');
};

/**
 * Saves a password to localStorage
 */
export const savePasswordToHistory = (password: string, strength: PasswordStrength): void => {
  try {
    // Get existing history
    const historyString = localStorage.getItem('passwordHistory');
    const history: PasswordHistoryItem[] = historyString 
      ? JSON.parse(historyString) 
      : [];
    
    // Add new password to history
    const newEntry: PasswordHistoryItem = {
      password,
      strength,
      timestamp: Date.now(),
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : generateUUID()
    };
    
    // Add to the beginning, keep only the last 5
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    
    // Save updated history
    localStorage.setItem('passwordHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save password to history', error);
  }
};

/**
 * Gets password history from localStorage
 */
export const getPasswordHistory = (): PasswordHistoryItem[] => {
  try {
    const historyString = localStorage.getItem('passwordHistory');
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Failed to get password history', error);
    return [];
  }
};

/**
 * Copies text to clipboard with fallback for unsupported browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard', error);
      return false;
    }
  } else {
    // Fallback method using textarea and execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (error) {
      console.error('Fallback: Failed to copy to clipboard', error);
      return false;
    }
  }
};

/**
 * Downloads text as a file
 */
export const downloadAsFile = (text: string, filename: string): void => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};