import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { quizQuestions } from '@/data/forgeData';
import wizardLogo from '@/assets/wizard-logo.png';
import { playClick, playCorrect, playWrong, playVictory } from '@/lib/sounds';

const QuizScreen = () => {
  const { setScreen, resetGame, mode, setQuizScore } = useGame();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[currentQ];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct;
    if (correct) {
      playCorrect();
      setScore(s => s + 1);
    } else {
      playWrong();
    }
    if (mode === 'pro') setShowTip(true);
    if (mode === 'fun') {
      setTimeout(() => advance(), 1500);
    }
  };

  const advance = () => {
    playClick();
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowTip(false);
    } else {
      setQuizScore(score);
      setFinished(true);
      playVictory();
    }
  };

  if (finished) {
    const finalScore = score;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
        <motion.img
          src={wizardLogo}
          alt="Wizard"
          className="w-32 h-32 object-contain"
          animate={mode === 'fun' ? { rotate: [0, -10, 10, 0], y: [0, -10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.h2
          className="text-3xl font-bold mt-4 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          {finalScore >= 3 ? '🎉 Password Wizard Level Up!' : '✨ Keep Practicing, Wizard!'}
        </motion.h2>
        <motion.p
          className="text-5xl font-bold mt-4"
          style={{ fontFamily: 'var(--font-display)', color: 'hsl(var(--primary))' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          {finalScore}/{quizQuestions.length}
        </motion.p>
        <div className="flex gap-3 mt-8">
          <button onClick={() => { playClick(); setScreen('reveal'); }} className="game-btn-primary">
            ← Back to Password
          </button>
          <button onClick={() => { playClick(); resetGame(); }} className="game-btn-accent">
            🏠 Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <img src={wizardLogo} alt="" className="w-10 h-10 object-contain" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {quizQuestions.length}</p>
          <div className="w-full h-2 rounded-full mt-1" style={{ background: 'hsl(var(--muted))' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'hsl(var(--primary))' }}
              animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex-1 flex flex-col"
        >
          <div className="game-panel mb-4">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {q.question}
            </h3>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              const showResult = selected !== null;

              let borderStyle = {};
              if (showResult && isCorrect) {
                borderStyle = { borderColor: 'hsl(var(--strength-strong))', background: 'hsl(140 70% 42% / 0.1)' };
              } else if (showResult && isSelected && !isCorrect) {
                borderStyle = { borderColor: 'hsl(var(--strength-weak))', background: 'hsl(0 80% 55% / 0.1)' };
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="game-card text-left p-4"
                  style={borderStyle}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                >
                  <span className="font-medium text-sm">{opt}</span>
                  {showResult && isCorrect && <span className="ml-2">✅</span>}
                  {showResult && isSelected && !isCorrect && <span className="ml-2">❌</span>}
                </motion.button>
              );
            })}
          </div>

          {showTip && mode === 'pro' && (
            <motion.div
              className="game-panel mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-muted-foreground">💡 {q.tip}</p>
            </motion.div>
          )}

          {selected !== null && mode === 'pro' && (
            <motion.button
              onClick={advance}
              className="game-btn-primary mt-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
            </motion.button>
          )}

          {selected !== null && mode === 'fun' && (
            <motion.div
              className="text-center text-3xl mt-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {selected === q.correct ? '🎉 Correct!' : '😅 Not quite!'}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizScreen;
