import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MainCanvas from './components/layout/MainCanvas';
import RightPanel from './components/layout/RightPanel';
import SortingVisualizer from './components/visualizers/SortingVisualizer';
import { BUBBLE_SORT } from './algorithms/bubble-sort';
import { INSERTION_SORT } from './algorithms/insertion-sort';
import { SELECTION_SORT } from './algorithms/selection-sort';
import { HEAP_SORT } from './algorithms/heap-sort';
import { MERGE_SORT } from './algorithms/merge-sort';
import { QUICK_SORT } from './algorithms/quick-sort';
import { BFS } from './algorithms/bfs';
import { DFS } from './algorithms/dfs';
import { DIJKSTRA } from './algorithms/dijkstra';
import { KRUSKAL } from './algorithms/kruskal';
import { BELLMAN_FORD } from './algorithms/bellman-ford';
import { FLOYD_WARSHALL } from './algorithms/floyd-warshall';
import GraphVisualizer from './components/visualizers/GraphVisualizer';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import AdminDashboard from './components/layout/AdminDashboard';
import type { Step, Algorithm, TraceResponse } from './types';
import { API_BASE_URL } from './config';

const INITIAL_ARRAY = [45, 12, 89, 34, 67, 23, 56, 9, 78, 41, 62, 28, 95, 15, 50];

const INITIAL_GRAPH = {
  adjList: {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
  },
  startNode: "A"
};

const INITIAL_WEIGHTED_GRAPH = {
  adjList: {
    "A": [{ "to": "B", "weight": 4 }, { "to": "C", "weight": 2 }],
    "B": [{ "to": "D", "weight": 3 }, { "to": "E", "weight": 1 }],
    "C": [{ "to": "F", "weight": 5 }],
    "D": [],
    "E": [{ "to": "F", "weight": 2 }],
    "F": []
  },
  startNode: "A"
};

function App() {
  // Algorithm State
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(BUBBLE_SORT);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [customInput, setCustomInput] = useState<string>(INITIAL_ARRAY.join(', '));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const { token, user } = useAuth();
  
  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const fetchTrace = useCallback(async (algoId: string, input: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithmId: algoId, inputData: input }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch algorithm trace');
      }
      
      const data: TraceResponse = await response.json();
      setSteps(data.steps);
      setCurrentStepIdx(0);
      setIsPlaying(false);

      // Save history if user is logged in
      if (token) {
        fetch(`${API_BASE_URL}/user/history`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ algorithmId: algoId, inputData: input }),
        }).catch(err => console.error('Failed to save history:', err));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not generate trace. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Initialize steps for current algorithm
  useEffect(() => {
    if (selectedAlgo.category === 'sorting') {
      const inputArr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      fetchTrace(selectedAlgo.id, inputArr.length > 0 ? inputArr : INITIAL_ARRAY);
    } else {
      // Graph algorithms
      const input = (selectedAlgo.id === 'dijkstra' || selectedAlgo.id === 'kruskal' || selectedAlgo.id === 'bellman-ford' || selectedAlgo.id === 'floyd-warshall') ? INITIAL_WEIGHTED_GRAPH : INITIAL_GRAPH;
      fetchTrace(selectedAlgo.id, input);
    }
  }, [selectedAlgo, fetchTrace]);

  const handleCustomInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedAlgo.category === 'sorting') {
      const inputArr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (inputArr.length > 0) {
        fetchTrace(selectedAlgo.id, inputArr);
      } else {
        setError('Please enter a valid comma-separated list of numbers.');
      }
    } else {
      // For graph we could parse a text adjacency list but keeping it simple for now
      const input = (selectedAlgo.id === 'dijkstra' || selectedAlgo.id === 'kruskal' || selectedAlgo.id === 'bellman-ford' || selectedAlgo.id === 'floyd-warshall') ? INITIAL_WEIGHTED_GRAPH : INITIAL_GRAPH;
      fetchTrace(selectedAlgo.id, input);
    }
  };

  const handleSelectHistory = useCallback((algoId: string, input: any) => {
    // Find the algorithm definition
    const algos = [
      BUBBLE_SORT, INSERTION_SORT, SELECTION_SORT, HEAP_SORT, MERGE_SORT, QUICK_SORT,
      BFS, DFS, DIJKSTRA, KRUSKAL, BELLMAN_FORD, FLOYD_WARSHALL
    ];
    const algo = algos.find(a => a.id === algoId);
    if (algo) {
      setSelectedAlgo(algo);
      if (Array.isArray(input)) {
        setCustomInput(input.join(', '));
      }
      fetchTrace(algoId, input);
    }
  }, [fetchTrace]);

  const handleNext = useCallback(() => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIdx, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  }, [currentStepIdx]);

  const handleReset = useCallback(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Handle Playback
  useEffect(() => {
    if (isPlaying) {
      const interval = 800 / speed;
      timerRef.current = window.setInterval(handleNext, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, handleNext]);

  const currentStep = steps[currentStepIdx] || {
    array: INITIAL_ARRAY,
    activeLine: -1,
    variables: {},
    description: isLoading ? 'Generating Trace...' : error ? error : 'Initializing...',
    comparing: [],
    swapping: [],
    sorted: []
  };

  const currentArray = currentStep.array || INITIAL_ARRAY;
  const maxVal = Math.max(...currentArray);

  if (showAdmin && user?.role === 'ADMIN') {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <Sidebar 
        selectedAlgoId={selectedAlgo.id} 
        onSelectAlgo={(id) => {
          if (id === 'bubble-sort') setSelectedAlgo(BUBBLE_SORT);
          if (id === 'insertion-sort') setSelectedAlgo(INSERTION_SORT);
          if (id === 'selection-sort') setSelectedAlgo(SELECTION_SORT);
          if (id === 'heap-sort') setSelectedAlgo(HEAP_SORT);
          if (id === 'merge-sort') setSelectedAlgo(MERGE_SORT);
          if (id === 'quick-sort') setSelectedAlgo(QUICK_SORT);
          if (id === 'bfs') setSelectedAlgo(BFS);
          if (id === 'dfs') setSelectedAlgo(DFS);
          if (id === 'dijkstra') setSelectedAlgo(DIJKSTRA);
          if (id === 'kruskal') setSelectedAlgo(KRUSKAL);
          if (id === 'bellman-ford') setSelectedAlgo(BELLMAN_FORD);
          if (id === 'floyd-warshall') setSelectedAlgo(FLOYD_WARSHALL);
        }} 
        onSelectHistory={handleSelectHistory}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          canGoNext={currentStepIdx < steps.length - 1 && !isLoading}
          canGoPrev={currentStepIdx > 0 && !isLoading}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onAdminClick={() => setShowAdmin(true)}
        />
        
        <div className="px-8 py-2 bg-slate-900/50 border-b border-white/5 flex items-center gap-4">
          <form onSubmit={handleCustomInputSubmit} className="flex-1 flex items-center gap-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Input Array:</label>
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 10, 5, 8, 12"
              className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="px-4 py-1 bg-primary text-white text-sm rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              Update
            </button>
          </form>
          {isLoading && (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="text-xs font-medium">Processing...</span>
            </div>
          )}
        </div>

        <MainCanvas 
          title={selectedAlgo.name} 
          description={selectedAlgo.description}
          stepDescription={currentStep.description}
        >
          {selectedAlgo.category === 'sorting' ? (
            <SortingVisualizer 
              array={currentArray}
              comparing={currentStep.comparing || []}
              swapping={currentStep.swapping || []}
              sorted={currentStep.sorted || []}
              maxVal={maxVal}
            />
          ) : (
            <GraphVisualizer 
              adjList={selectedAlgo.id === 'dijkstra' ? INITIAL_WEIGHTED_GRAPH.adjList : INITIAL_GRAPH.adjList}
              visited={currentStep.visited || []}
              current={currentStep.current || null}
              activeEdge={currentStep.activeEdge}
              mstEdges={currentStep.mstEdges}
              queue={currentStep.queue}
              stack={currentStep.stack}
              distances={currentStep.distances}
            />
          )}
        </MainCanvas>
      </div>

      <RightPanel 
        pseudocode={selectedAlgo.pseudocode}
        activeLine={currentStep.activeLine}
        variables={currentStep.variables}
        queue={currentStep.queue}
        stack={currentStep.stack}
        complexity={selectedAlgo.complexity}
      />
    </div>
  );
}

export default App;
