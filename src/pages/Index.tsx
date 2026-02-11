import { GameProvider, useGame } from '@/contexts/GameContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import BuildingInterface from '@/components/BuildingInterface';
import RevealScreen from '@/components/RevealScreen';
import QuizScreen from '@/components/QuizScreen';

const GameRouter = () => {
  const { screen } = useGame();

  switch (screen) {
    case 'welcome': return <WelcomeScreen />;
    case 'building': return <BuildingInterface />;
    case 'reveal': return <RevealScreen />;
    case 'quiz': return <QuizScreen />;
    default: return <WelcomeScreen />;
  }
};

const Index = () => (
  <GameProvider>
    <GameRouter />
  </GameProvider>
);

export default Index;
