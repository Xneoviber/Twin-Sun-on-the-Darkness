import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronRight, Map, RotateCcw, Play, BookOpen, X, Info } from 'lucide-react';
import { SCENES, BACKGROUNDS, INITIAL_FLAGS } from '../constants';
import { GameState, Scene } from '../types';

type View = 'warning' | 'menu' | 'game' | 'map';

export const VisualNovel: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('vn_save');
    return saved ? JSON.parse(saved) : {
      currentSceneId: 'start',
      flags: INITIAL_FLAGS,
      visitedScenes: ['start']
    };
  });

  const [view, setView] = useState<View>('warning');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentScene = SCENES[gameState.currentSceneId];

  // Derive flowchart layout
  const flowchartData = useMemo(() => {
    const nodes: Record<string, { x: number, y: number }> = {};
    const levels: string[][] = [['start']];
    const visited = new Set(['start']);
    
    // Simple BFS to determine levels
    let currentLevel = ['start'];
    while (currentLevel.length > 0) {
      const nextLevel: string[] = [];
      for (const sceneId of currentLevel) {
        const scene = SCENES[sceneId];
        if (scene && scene.choices) {
          for (const choice of scene.choices) {
            if (!visited.has(choice.nextScene)) {
              visited.add(choice.nextScene);
              nextLevel.push(choice.nextScene);
            }
          }
        }
      }
      if (nextLevel.length > 0) levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    // Assign coordinates
    levels.forEach((level, lIdx) => {
      level.forEach((id, iIdx) => {
        nodes[id] = {
          x: 150 + lIdx * 300,
          y: 100 + iIdx * 150 + (lIdx % 2 * 50) // Slight stagger
        };
      });
    });

    return { nodes, levels };
  }, []);

  useEffect(() => {
    localStorage.setItem('vn_save', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (view !== 'game' || !currentScene) return;
    
    let i = 0;
    setDisplayText('');
    setIsTyping(true);
    
    const interval = setInterval(() => {
      setDisplayText(currentScene.dialogue.slice(0, i + 1));
      i++;
      if (i >= currentScene.dialogue.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [gameState.currentSceneId, view]);

  const handleChoice = (choice: any) => {
    if (isTyping) {
      setDisplayText(currentScene.dialogue);
      setIsTyping(false);
      return;
    }

    const newFlags = { ...gameState.flags };
    if (choice.effects) choice.effects(newFlags);

    setGameState(prev => ({
      currentSceneId: choice.nextScene,
      flags: newFlags,
      visitedScenes: Array.from(new Set([...prev.visitedScenes, choice.nextScene]))
    }));
  };

  const resetGame = () => {
    setGameState({
      currentSceneId: 'start',
      flags: INITIAL_FLAGS,
      visitedScenes: ['start']
    });
    setView('game');
  };

  // --- RENDERERS ---

  if (view === 'warning') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-8 rounded-3xl text-center border-red-500/30"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif italic mb-4">Adult Content Warning</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            This visual novel contains mature themes, including betrayal and adult situations. 
            By proceeding, you confirm you are 18+ and accept this content.
          </p>
          <button 
            onClick={() => setView('menu')}
            className="w-full py-4 bg-red-600 hover:bg-red-500 transition-colors rounded-full font-bold tracking-widest uppercase text-sm"
          >
            Enter & Continue
          </button>
        </motion.div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
          style={{ backgroundImage: `url(${BACKGROUNDS.city})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative z-10 max-w-2xl w-full px-12"
        >
          <h1 className="text-7xl font-serif italic mb-2 leading-none">Twin Sun</h1>
          <h2 className="text-2xl font-light tracking-[0.3em] uppercase text-red-500 mb-12">On the Darkness</h2>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={resetGame}
              className="group flex items-center gap-4 text-2xl font-light hover:text-red-500 transition-colors"
            >
              <Play className="w-6 h-6 group-hover:fill-red-500" />
              New Game
            </button>
            <button 
              onClick={() => setView('game')}
              className="group flex items-center gap-4 text-2xl font-light hover:text-red-500 transition-colors"
            >
              <BookOpen className="w-6 h-6 group-hover:fill-red-500" />
              Continue
            </button>
            <button 
              onClick={() => setView('map')}
              className="group flex items-center gap-4 text-2xl font-light hover:text-red-500 transition-colors"
            >
              <Map className="w-6 h-6 group-hover:fill-red-500" />
              Flowchart Map
            </button>
          </div>
          
          <div className="mt-24 flex gap-8 text-xs uppercase tracking-widest text-white/40">
            <span>v1.2.0</span>
            <span>© 2026 Twin Sun Studio</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'map') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0502] flex flex-col overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-white/5 glass-panel">
          <div>
            <h2 className="text-3xl font-serif italic">Flowchart Map</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Navigate through your destiny</p>
          </div>
          <button 
            onClick={() => setView('menu')}
            className="p-4 glass-panel rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#0a0502_100%)] relative cursor-grab active:cursor-grabbing">
          <svg className="absolute inset-0 pointer-events-none" style={{ width: 5000, height: 2000 }}>
            {Object.entries(SCENES).map(([id, scene]) => {
              const startPos = flowchartData.nodes[id];
              if (!startPos) return null;
              
              return scene.choices.map((choice, cIdx) => {
                const endPos = flowchartData.nodes[choice.nextScene];
                if (!endPos) return null;
                
                const isVisited = gameState.visitedScenes.includes(id) && gameState.visitedScenes.includes(choice.nextScene);
                
                return (
                  <motion.path
                    key={`${id}-${choice.nextScene}-${cIdx}`}
                    d={`M ${startPos.x} ${startPos.y} C ${startPos.x + 150} ${startPos.y}, ${endPos.x - 150} ${endPos.y}, ${endPos.x} ${endPos.y}`}
                    stroke={isVisited ? "#ef4444" : "rgba(255,255,255,0.05)"}
                    strokeWidth={isVisited ? 3 : 1}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                );
              });
            })}
          </svg>

          <div className="relative" style={{ width: 5000, height: 2000 }}>
            {Object.entries(SCENES).map(([id, scene]) => {
              const pos = flowchartData.nodes[id];
              if (!pos) return null;
              
              const isVisited = gameState.visitedScenes.includes(id);
              const isCurrent = gameState.currentSceneId === id;
              
              return (
                <motion.div
                  key={id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ left: pos.x, top: pos.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    onClick={() => {
                      if (isVisited) {
                        setGameState(prev => ({ ...prev, currentSceneId: id }));
                        setView('game');
                      }
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all w-56 text-left ${
                      isCurrent 
                        ? 'border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : isVisited 
                          ? 'border-white/20 bg-black/60 hover:border-red-500/50 hover:bg-red-500/5' 
                          : 'border-white/5 bg-transparent opacity-20 grayscale cursor-not-allowed'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1 flex justify-between">
                      <span>{id}</span>
                      {isVisited && <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                    <div className="font-medium text-xs line-clamp-2 leading-relaxed">
                      {isVisited ? scene.dialogue.slice(0, 80) + '...' : 'Locked Path'}
                    </div>
                    
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BACKGROUNDS[currentScene.background]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* UI Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 pointer-events-none">
        {/* Controls */}
        <div className="absolute top-6 right-6 flex gap-4 pointer-events-auto">
          <button 
            onClick={() => setView('menu')}
            className="p-3 glass-panel rounded-full hover:bg-white/10 transition-colors"
            title="Main Menu"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('map')}
            className="p-3 glass-panel rounded-full hover:bg-white/10 transition-colors"
            title="Flow Map"
          >
            <Map className="w-5 h-5" />
          </button>
        </div>

        {/* Dialogue Box */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl w-full mx-auto glass-panel rounded-3xl p-8 pointer-events-auto relative"
        >
          {/* Speaker Name */}
          <div className="absolute top-0 left-8 -translate-y-1/2">
            <div className="bg-red-600 px-6 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              {currentScene.speaker}
            </div>
          </div>

          {/* Text */}
          <div className="min-h-[100px] mb-8">
            <p className="text-xl md:text-2xl leading-relaxed vn-text-shadow font-light">
              {displayText}
            </p>
          </div>

          {/* Choices */}
          <div className="flex flex-wrap gap-4">
            {currentScene.choices.length > 0 ? (
              currentScene.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(choice)}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-sm font-medium"
                >
                  {choice.text}
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </motion.button>
              ))
            ) : (
              <button 
                onClick={() => setView('menu')}
                className="flex items-center gap-3 px-8 py-3 rounded-full bg-red-600 hover:bg-red-500 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                Return to Menu
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

