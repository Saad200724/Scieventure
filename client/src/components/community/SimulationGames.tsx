
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QuantumCoinToss from '@/components/games/QuantumCoinToss';

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  playerCount: number;
}

const SimulationGames: React.FC = () => {
  const games: Game[] = [
    {
      id: 1,
      title: 'Physics Lab Simulator',
      description: 'Experiment with forces, motion, and energy in a virtual physics laboratory.',
      category: 'Physics',
      difficulty: 'Intermediate',
      playerCount: 245
    },
    {
      id: 2,
      title: 'Chemistry Reaction Explorer',
      description: 'Mix virtual chemicals and observe reactions in a safe environment.',
      category: 'Chemistry',
      difficulty: 'Beginner',
      playerCount: 189
    },
    {
      id: 3,
      title: 'Ecosystem Builder',
      description: 'Create and maintain your own virtual ecosystem, studying species interactions.',
      category: 'Biology',
      difficulty: 'Advanced',
      playerCount: 167
    },
    {
      id: 4,
      title: 'Astronomy Voyager',
      description: 'Explore the universe, visit planets and stars in this immersive space simulation.',
      category: 'Astronomy',
      difficulty: 'Intermediate',
      playerCount: 211
    },
    {
      id: 5,
      title: 'Genetics Lab',
      description: 'Experiment with gene editing and observe hereditary traits across generations.',
      category: 'Biology',
      difficulty: 'Advanced',
      playerCount: 143
    },
    {
      id: 6,
      title: 'Weather Patterns',
      description: 'Create and modify weather systems to understand meteorological phenomena.',
      category: 'Earth Science',
      difficulty: 'Beginner',
      playerCount: 178
    },
    {
      id: 7,
      title: 'Quantum Playground',
      description: 'Visualize and interact with quantum physics principles in an intuitive interface.',
      category: 'Physics',
      difficulty: 'Advanced',
      playerCount: 132
    },
    {
      id: 8,
      title: 'Robot Builder',
      description: 'Design, program, and test virtual robots to solve practical engineering challenges.',
      category: 'Engineering',
      difficulty: 'Intermediate',
      playerCount: 224
    }
  ];

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Add Quantum Coin Toss to the games at the top
  const quantumCoinToss: Game = {
    id: 0, // Special ID for the quantum coin toss
    title: 'Quantum Coin Toss',
    description: 'Experience quantum mechanics principles through an interactive coin toss simulation.',
    category: 'Quantum Physics',
    difficulty: 'Beginner',
    playerCount: 352 // Higher player count to highlight it
  };

  // Handler for the Play Now button
  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
  };

  const [showAllGames, setShowAllGames] = useState(false);
  
  // Show games - start with 3 games to fill the box better
  const displayedGames = showAllGames ? games : games.slice(0, 3);

  return (
    <>
      <Card className="h-full">
        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Educational Games</h3>
          <div className="space-y-4 flex-grow">
            {/* Quantum Coin Toss featured at the top */}
            <div className="border-2 border-primary rounded-lg p-3 sm:p-4 hover:bg-primary/5 transition-colors bg-blue-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-base flex items-center flex-wrap gap-2">
                    {quantumCoinToss.title} 
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Featured</span>
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{quantumCoinToss.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex-shrink-0 ml-2">
                  {quantumCoinToss.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">{quantumCoinToss.playerCount} active players</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white" size="sm">Play Now</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Quantum Coin Toss</DialogTitle>
                    </DialogHeader>
                    <QuantumCoinToss />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Two selected games */}
            {displayedGames.map((game) => (
              <div key={game.id} className="border rounded-lg p-3 sm:p-4 hover:bg-accent/5 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-base">{game.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    game.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    game.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">{game.playerCount} active players</span>
                  <Button variant="outline" size="sm">Play Now</Button>
                </div>
              </div>
            ))}
            
            {/* See More Button */}
            <Button 
              variant="ghost" 
              className="w-full text-primary hover:text-primary-dark hover:bg-primary/5 mt-2" 
              onClick={() => setShowAllGames(!showAllGames)}
            >
              {showAllGames ? 'Show Less' : 'Tap to See More →'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SimulationGames;
