import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QuantumCoinToss: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isTossing, setIsTossing] = useState(false);
  const [statistics, setStatistics] = useState({ heads: 0, tails: 0, total: 0 });
  const [quantumState, setQuantumState] = useState('superposition');
  const [history, setHistory] = useState<string[]>([]);
  const [animation, setAnimation] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState('basic');

  // Function to simulate a quantum coin toss
  const tossQuantumCoin = () => {
    setIsTossing(true);
    setQuantumState('superposition');
    setAnimation(true);
    
    // Simulate quantum superposition with timeout
    setTimeout(() => {
      // Quantum measurement collapses the state
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setQuantumState('collapsed');
      setAnimation(false);
      setIsTossing(false);
      
      // Update statistics
      setStatistics(prev => ({
        heads: prev.heads + (outcome === 'heads' ? 1 : 0),
        tails: prev.tails + (outcome === 'tails' ? 1 : 0),
        total: prev.total + 1
      }));
      
      // Add to history
      setHistory(prev => [...prev, outcome].slice(-10));
    }, 2000);
  };

  // Reset everything
  const resetSimulation = () => {
    setResult(null);
    setStatistics({ heads: 0, tails: 0, total: 0 });
    setQuantumState('superposition');
    setHistory([]);
  };

  // Calculate probabilities for display
  const headsProbability = statistics.total > 0 
    ? ((statistics.heads / statistics.total) * 100).toFixed(1) 
    : '50.0';
  
  const tailsProbability = statistics.total > 0 
    ? ((statistics.tails / statistics.total) * 100).toFixed(1) 
    : '50.0';

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Quantum Coin Toss Simulator</CardTitle>
        <CardDescription>
          Experience quantum mechanics principles through a coin toss simulation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="explanation">Learn</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulation" className="space-y-6">
            <div className="flex flex-col items-center space-y-8">
              {/* Coin display area */}
              <div 
                className={`h-48 w-48 rounded-full flex items-center justify-center 
                          border-4 ${result === 'heads' ? 'bg-amber-200 border-amber-500' : 
                                   result === 'tails' ? 'bg-blue-200 border-blue-500' : 
                                   'bg-gradient-to-r from-amber-200 to-blue-200 border-purple-500'} 
                          ${animation ? 'animate-spin' : ''} transition-all duration-500`}
              >
                {!isTossing && result ? (
                  <div className="text-4xl font-bold">
                    {result === 'heads' ? 'H' : 'T'}
                  </div>
                ) : (
                  <div className="text-lg text-center p-4">
                    {isTossing ? 'Collapsing wave function...' : 'Click "Toss" to start'}
                  </div>
                )}
              </div>
              
              {/* Quantum state display */}
              <div className="text-center">
                <Label className="block mb-2">Quantum State:</Label>
                <span className={`inline-block py-1 px-3 rounded-full ${
                  quantumState === 'superposition' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {quantumState === 'superposition' 
                    ? 'Superposition (Both states simultaneously)' 
                    : 'Collapsed (Measured state)'}
                </span>
              </div>
              
              {/* Controls */}
              <div className="flex space-x-4">
                <Button 
                  onClick={tossQuantumCoin} 
                  disabled={isTossing}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isTossing ? 'Tossing...' : 'Toss Quantum Coin'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetSimulation}
                  disabled={isTossing || (statistics.total === 0)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="explanation" className="space-y-6">
            <div className="space-y-4">
              <div className="mb-4">
                <Label>Choose explanation level:</Label>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    variant={explanationLevel === 'basic' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setExplanationLevel('basic')}
                  >
                    Basic
                  </Button>
                  <Button 
                    variant={explanationLevel === 'intermediate' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setExplanationLevel('intermediate')}
                  >
                    Intermediate
                  </Button>
                  <Button 
                    variant={explanationLevel === 'advanced' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setExplanationLevel('advanced')}
                  >
                    Advanced
                  </Button>
                </div>
              </div>
              
              {explanationLevel === 'basic' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quantum Superposition (Basic)</h3>
                  <p>In quantum mechanics, objects don't just exist in one state or another. Before we look at them, they exist in multiple states at once!</p>
                  <p className="mt-2">Our quantum coin is in a special state called "superposition" where it's both heads AND tails at the same time. When we "measure" it (look at it), it randomly becomes either heads or tails.</p>
                  <p className="mt-2">This is different from a normal coin toss where the coin is always in a specific state, we just don't know what it is until we look.</p>
                </div>
              )}
              
              {explanationLevel === 'intermediate' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Wave Function Collapse (Intermediate)</h3>
                  <p>In quantum physics, all possible states of a system are represented by a mathematical function called a "wave function." This wave function contains all the probabilities of finding the system in various states.</p>
                  <p className="mt-2">When we observe or measure a quantum system, the wave function "collapses" into one specific state. This is called "wave function collapse."</p>
                  <p className="mt-2">In our simulation, the coin exists in a superposition of both heads and tails (with equal probability) until we measure it. The act of measurement forces the system to pick one state.</p>
                  <p className="mt-2">This phenomenon is fundamentally different from classical uncertainty, where the outcome is determined but unknown.</p>
                </div>
              )}
              
              {explanationLevel === 'advanced' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quantum Measurement & Decoherence (Advanced)</h3>
                  <p>Quantum systems are described by a wave function that evolves according to the Schrödinger equation. For our coin, we can represent it as:</p>
                  <code className="block bg-gray-100 p-2 mt-2 rounded">|ψ⟩ = (1/√2)|heads⟩ + (1/√2)|tails⟩</code>
                  <p className="mt-2">The coefficients (1/√2) represent the probability amplitudes, which, when squared, give us a 50% chance for each outcome.</p>
                  <p className="mt-2">When measurement occurs, the wave function collapses into one of its eigenstates (|heads⟩ or |tails⟩). In reality, this happens through a process called "decoherence" where quantum superpositions are destroyed by interactions with the environment.</p>
                  <p className="mt-2">These principles are crucial for quantum computing, where qubits (quantum bits) can exist in superpositions and entangled states, enabling algorithms that outperform classical computing for certain problems.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Total tosses: {statistics.total}</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Label className="w-16">Heads:</Label>
                  <Progress value={Number(headsProbability)} className="flex-1" />
                  <span className="text-sm">{statistics.heads} ({headsProbability}%)</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Label className="w-16">Tails:</Label>
                  <Progress value={Number(tailsProbability)} className="flex-1" />
                  <span className="text-sm">{statistics.tails} ({tailsProbability}%)</span>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Last 10 Results:</Label>
                <div className="flex flex-wrap gap-2">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <span 
                        key={index} 
                        className={`inline-block w-8 h-8 rounded-full flex items-center justify-center 
                                  ${item === 'heads' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}
                      >
                        {item === 'heads' ? 'H' : 'T'}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No tosses yet</span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          This simulation demonstrates fundamental quantum mechanics principles
        </div>
        <Button variant="link" size="sm" className="text-primary">
          Learn more about quantum mechanics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuantumCoinToss;