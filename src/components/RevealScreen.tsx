import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import wizardLogo from '@/assets/wizard-logo.png';
import { playReveal } from '@/lib/sounds';

const RevealScreen = () => {
  const { generatedPassword, setScreen, reforge, mode } = useGame();
  const [revealing, setRevealing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealing(false);
      playReveal();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const length = generatedPassword.length;
  const hasUpper = /[A-Z]/.test(generatedPassword);
  const hasLower = /[a-z]/.test(generatedPassword);
  const hasNumber = /[0-9]/.test(generatedPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(generatedPassword);
  const mixedTypes = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  
  let strengthPercent = 0;
  let strengthLabel = '';
  let strengthColor = 'var(--strength-weak)';
  
  if (length >= 12 && mixedTypes >= 4) {
    strengthPercent = 100;
    strengthLabel = 'Super Strong! Hackers would need centuries! 🏰';
    strengthColor = 'var(--strength-strong)';
  } else if (length >= 8 && mixedTypes >= 3) {
    strengthPercent = 70;
    strengthLabel = 'Strong! Looking good wizard! 💪';
    strengthColor = 'var(--strength-medium)';
  } else {
    strengthPercent = 40;
    strengthLabel = 'Getting there... add more variety!';
    strengthColor = 'var(--strength-weak)';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-lg mx-auto relative overflow-hidden">
      <AnimatePresence>
        {revealing ? (
          <motion.div
            key="drumroll"
            className="flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <motion.div
              className="text-7xl"
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🥁
            </motion.div>
            <motion.p
              className="text-2xl font-bold mt-4"
              style={{ fontFamily: 'var(--font-display)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Forging your spell...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
            {mode === 'fun' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                      background: `hsl(${Math.random() * 360} 80% 60%)`,
                      left: `${Math.random() * 100}%`,
                      top: '-10%',
                    }}
                    animate={{
                      y: ['0vh', '110vh'],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 1,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>
            )}

            <motion.img
              src={wizardLogo}
              alt="Wizard celebrates"
              className="w-28 h-28 object-contain"
              animate={mode === 'fun' ? {
                y: [0, -15, 0],
                rotate: [0, -8, 8, 0],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <h2 className="text-2xl font-bold mt-4" style={{ fontFamily: 'var(--font-display)' }}>
              Your Wizard Password!
            </h2>

            <motion.div
              className="game-panel w-full mt-4 text-center"
              initial={{ boxShadow: '0 0 0 hsl(var(--primary) / 0)' }}
              animate={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.3)' }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            >
              <p className="text-2xl md:text-3xl font-mono font-bold break-all select-all" style={{ color: 'hsl(var(--wizard-blue))' }}>
                {generatedPassword}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{length} characters · {mixedTypes} types mixed</p>
            </motion.div>

            <div className="w-full mt-4">
              <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                <motion.div
                  className="strength-bar"
                  style={{ background: `hsl(${strengthColor})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${strengthPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <p className="text-sm font-medium mt-2 text-center" style={{ fontFamily: 'var(--font-display)' }}>
                {strengthLabel}
              </p>
            </div>

            <motion.p
              className="text-sm text-muted-foreground mt-4 text-center italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              "This is way stronger than 'password123' – great job wizard!" 🧙‍♀️
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
              <button onClick={() => setScreen('building')} className="game-btn-primary flex-1">
                🔧 Tweak It
              </button>
              <button onClick={reforge} className="game-btn-accent flex-1">
                🔄 New Magic
              </button>
              <button onClick={() => setScreen('quiz')} className="game-btn-primary flex-1">
                🧠 Test Knowledge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RevealScreen;
