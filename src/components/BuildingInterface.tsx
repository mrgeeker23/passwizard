import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import wizardLogo from '@/assets/wizard-logo.png';

const tabs = [
  { id: 'color', label: 'Color Magic', emoji: '🪄' },
  { id: 'cartoon', label: 'Cartoon Spell', emoji: '📖' },
  { id: 'number', label: 'Number Charm', emoji: '🎲' },
  { id: 'symbol', label: 'Symbol Power', emoji: '✨' },
] as const;

type TabId = typeof tabs[number]['id'];

const tips: Record<TabId, string> = {
  color: "Colors add a unique word base – hard for hackers to guess!",
  cartoon: "Fun character words make it memorable but personal-ish without real info!",
  number: "Numbers add complexity – bots hate them!",
  symbol: "Symbols turn words into unbreakable code!",
};

const BuildingInterface = () => {
  const [activeTab, setActiveTab] = useState<TabId>('color');
  const {
    forgeOptions, selectedColor, selectedCartoon, selectedNumber, selectedSymbol,
    selectColor, selectCartoon, selectNumber, selectSymbol,
    allSelected, generatePassword, setScreen, mode,
  } = useGame();

  const handleReveal = () => {
    generatePassword();
    setScreen('reveal');
  };

  const selections: Record<TabId, { options: { label: string; emoji: string; color?: string }[]; selected: string | null; onSelect: (v: string) => void }> = {
    color: { options: forgeOptions.colors, selected: selectedColor, onSelect: selectColor },
    cartoon: { options: forgeOptions.cartoons, selected: selectedCartoon, onSelect: selectCartoon },
    number: { options: forgeOptions.numbers, selected: selectedNumber, onSelect: selectNumber },
    symbol: { options: forgeOptions.symbols, selected: selectedSymbol, onSelect: selectSymbol },
  };

  const current = selections[activeTab];
  const completedTabs = [selectedColor, selectedCartoon, selectedNumber, selectedSymbol].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.img
          src={wizardLogo}
          alt="Wizard"
          className="w-12 h-12 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Forge Your Spell
          </h2>
          <p className="text-xs text-muted-foreground">{completedTabs}/4 ingredients selected</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-4" style={{ background: 'hsl(var(--muted))' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'hsl(var(--primary))' }}
          animate={{ width: `${(completedTabs / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const isComplete = !!selections[tab.id].selected;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn whitespace-nowrap flex items-center gap-1 ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {isComplete && <span className="ml-1">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <motion.div
        key={activeTab}
        className="game-panel mb-4 flex items-start gap-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <img src={wizardLogo} alt="" className="w-8 h-8 object-contain flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{tips[activeTab]}</p>
      </motion.div>

      {/* Options Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-3 gap-3 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {current.options.map((opt, i) => {
            const isSelected = current.selected === opt.label;
            return (
              <motion.button
                key={opt.label}
                onClick={() => current.onSelect(opt.label)}
                className={`game-card flex flex-col items-center justify-center min-h-[120px] ${isSelected ? 'selected' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={opt.color && mode === 'fun' ? {
                  background: isSelected
                    ? `hsl(var(--game-card-selected))`
                    : `hsl(${opt.color} / 0.15)`,
                } : {}}
              >
                <span className="text-3xl mb-1">{opt.emoji}</span>
                <span className="text-xs font-semibold text-center leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-1 text-sm"
                  >
                    ✅
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Incomplete message */}
      {!allSelected && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Pick one from each tab to unlock the magic! ✨
        </p>
      )}

      {/* Reveal Button */}
      <motion.button
        onClick={handleReveal}
        className={`game-btn-accent mt-4 w-full text-lg ${!allSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
        disabled={!allSelected}
        whileHover={allSelected ? { scale: 1.03 } : {}}
        whileTap={allSelected ? { scale: 0.97 } : {}}
      >
        🔮 Reveal My Wizard Password!
      </motion.button>
    </div>
  );
};

export default BuildingInterface;
