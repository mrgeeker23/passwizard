import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import wizardLogo from '@/assets/wizard-logo.png';
import { MessageCircle, X } from 'lucide-react';

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

// Simple click sound using Web Audio API
const playClick = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
};

const playSelect = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
    // Second tone for a "ding"
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1100;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.15);
  } catch {}
};

const BuildingInterface = () => {
  const [activeTab, setActiveTab] = useState<TabId>('color');
  const [showTip, setShowTip] = useState(false);
  const {
    forgeOptions, selectedColor, selectedCartoon, selectedNumber, selectedSymbol,
    selectColor, selectCartoon, selectNumber, selectSymbol,
    allSelected, generatePassword, setScreen, mode,
  } = useGame();

  const handleReveal = () => {
    playSelect();
    generatePassword();
    setScreen('reveal');
  };

  const handleTabClick = (id: TabId) => {
    playClick();
    setActiveTab(id);
  };

  const handleSelect = (onSelect: (v: string) => void, value: string) => {
    playSelect();
    onSelect(value);
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
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <motion.img
          src={wizardLogo}
          alt="Wizard"
          className="w-12 h-12 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Forge Your Spell
          </h2>
          <p className="text-xs text-muted-foreground">{completedTabs}/4 ingredients selected</p>
        </div>
        {/* Tip toggle button */}
        <motion.button
          onClick={() => { playClick(); setShowTip(!showTip); }}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: 'hsl(var(--primary) / 0.15)',
            color: 'hsl(var(--primary))',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">Tip</span>
          <motion.span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: 'hsl(var(--accent))' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
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

      {/* Tabs - horizontal scroll bar */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const isComplete = !!selections[tab.id].selected;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tab-btn whitespace-nowrap flex items-center gap-1.5 px-5 py-2.5 text-base ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span>{tab.label}</span>
              {isComplete && <span className="ml-1 text-sm">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Options Grid - BIGGER cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-3 gap-4 flex-1"
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
                onClick={() => handleSelect(current.onSelect, opt.label)}
                className={`game-card flex flex-col items-center justify-center p-6 ${isSelected ? 'selected' : ''}`}
                style={{
                  minHeight: '180px',
                  ...(opt.color && mode === 'fun' ? {
                    background: isSelected
                      ? `hsl(var(--game-card-selected))`
                      : `hsl(${opt.color} / 0.15)`,
                  } : {}),
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-5xl mb-2">{opt.emoji}</span>
                <span className="text-sm font-bold text-center leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 text-lg"
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

      {/* Floating Tip Panel - right side popup */}
      <AnimatePresence>
        {showTip && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'hsl(var(--foreground) / 0.2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTip(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed right-4 top-1/2 z-50 w-80 max-w-[85vw] rounded-3xl border-2 p-5 shadow-xl"
              style={{
                background: 'hsl(var(--card))',
                borderColor: 'hsl(var(--primary) / 0.3)',
                y: '-50%',
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex items-start gap-3">
                <img src={wizardLogo} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                      Wizard's Tip 💡
                    </h3>
                    <button
                      onClick={() => setShowTip(false)}
                      className="p-1 rounded-full hover:opacity-70 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tips[activeTab]}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuildingInterface;
