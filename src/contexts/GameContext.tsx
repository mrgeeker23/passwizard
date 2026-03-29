import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateForgeOptions, type ForgeOptions } from '@/data/forgeData';

type GameMode = 'fun' | 'pro' | null;
type Screen = 'welcome' | 'building' | 'reveal' | 'quiz';

interface GameState {
  mode: GameMode;
  screen: Screen;
  selectedColor: string | null;
  selectedCartoon: string | null;
  selectedNumber: string | null;
  selectedSymbol: string | null;
  forgeOptions: ForgeOptions;
  generatedPassword: string;
  quizScore: number;
}

interface GameContextType extends GameState {
  setMode: (mode: GameMode) => void;
  setScreen: (screen: Screen) => void;
  selectColor: (color: string) => void;
  selectCartoon: (cartoon: string) => void;
  selectNumber: (num: string) => void;
  selectSymbol: (sym: string) => void;
  allSelected: boolean;
  generatePassword: () => string;
  resetGame: () => void;
  reforge: () => void;
  setQuizScore: (score: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be within GameProvider');
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<GameMode>(null);
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedColor, setColor] = useState<string | null>(null);
  const [selectedCartoon, setCartoon] = useState<string | null>(null);
  const [selectedNumber, setNumber] = useState<string | null>(null);
  const [selectedSymbol, setSymbol] = useState<string | null>(null);
  const [forgeOptions, setForgeOptions] = useState<ForgeOptions>(generateForgeOptions('fun'));
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [quizScore, setQuizScore] = useState(0);

  const setMode = useCallback((m: GameMode) => {
    setModeState(m);
    if (m) {
      setForgeOptions(generateForgeOptions(m));
      setColor(null);
      setCartoon(null);
      setNumber(null);
      setSymbol(null);
    }
    if (m === 'pro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const allSelected = !!(selectedColor && selectedCartoon && selectedNumber && selectedSymbol);

  const generatePassword = useCallback(() => {
    if (!selectedColor || !selectedCartoon || !selectedNumber || !selectedSymbol) return '';
    const colorWord = selectedColor.split(' ')[0];
    const cartoonWord = selectedCartoon.split(' ')[0];
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    const positions = [0, 1, 2, 3];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    let parts: string[];
    
    switch (pos) {
      case 0: parts = [selectedNumber, cap(colorWord), cap(cartoonWord), selectedSymbol]; break;
      case 1: parts = [cap(colorWord), selectedNumber, cap(cartoonWord), selectedSymbol]; break;
      case 2: parts = [cap(colorWord), cap(cartoonWord), selectedNumber, selectedSymbol]; break;
      default: parts = [cap(colorWord), cap(cartoonWord), selectedSymbol, selectedNumber]; break;
    }
    
    const useHyphen = Math.random() < 0.15;
    const pw = useHyphen ? parts.join('-') : parts.join('');
    setGeneratedPassword(pw);
    return pw;
  }, [selectedColor, selectedCartoon, selectedNumber, selectedSymbol]);

  const resetGame = useCallback(() => {
    setColor(null);
    setCartoon(null);
    setNumber(null);
    setSymbol(null);
    setGeneratedPassword('');
    setQuizScore(0);
    setScreen('welcome');
    setMode(null);
  }, [setMode]);

  const reforge = useCallback(() => {
    setColor(null);
    setCartoon(null);
    setNumber(null);
    setSymbol(null);
    setGeneratedPassword('');
    setForgeOptions(generateForgeOptions(mode || 'fun'));
    setScreen('building');
  }, []);

  return (
    <GameContext.Provider value={{
      mode, screen, selectedColor, selectedCartoon, selectedNumber, selectedSymbol,
      forgeOptions, generatedPassword, quizScore,
      setMode, setScreen, selectColor: setColor, selectCartoon: setCartoon,
      selectNumber: setNumber, selectSymbol: setSymbol,
      allSelected, generatePassword, resetGame, reforge, setQuizScore,
    }}>
      {children}
    </GameContext.Provider>
  );
};
