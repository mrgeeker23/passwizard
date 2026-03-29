import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import wizardLogo from '@/assets/wizard-logo.png';
import { playClick, playSelect } from '@/lib/sounds';

const WelcomeScreen = () => {
  const { setMode, setScreen, mode } = useGame();

  const handleModeSelect = (m: 'fun' | 'pro') => {
    playClick();
    setMode(m);
  };

  const handleStart = () => {
    if (mode) {
      playClick();
      setScreen('building');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating magic particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `hsl(${38 + i * 20} 80% 60%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.img
        src={wizardLogo}
        alt="PassWizard - Wizard Girl"
        className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
      />

      <motion.h1
        className="text-5xl md:text-7xl font-extrabold mt-4 tracking-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'hsl(var(--wizard-blue))' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        PassWizard
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl mt-2 text-muted-foreground font-medium"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Wizard Up a Super Strong Password! 🪄
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => handleModeSelect('fun')}
          className={`mode-card flex-1 ${mode === 'fun' ? 'selected' : ''}`}
        >
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Fun Mode</h3>
          <p className="text-sm text-muted-foreground mt-1">Colorful, animated, playful!</p>
        </button>

        <button
          onClick={() => handleModeSelect('pro')}
          className={`mode-card flex-1 ${mode === 'pro' ? 'selected' : ''}`}
        >
          <div className="text-4xl mb-2">⚡</div>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Pro Mode</h3>
          <p className="text-sm text-muted-foreground mt-1">Sleek, minimal, powerful</p>
        </button>
      </motion.div>

      <motion.button
        onClick={handleStart}
        className={`game-btn-primary mt-8 text-xl ${!mode ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!mode}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={mode ? { scale: 1.05 } : {}}
        whileTap={mode ? { scale: 0.95 } : {}}
      >
        🚀 Start Adventure
      </motion.button>
    </div>
  );
};

export default WelcomeScreen;
