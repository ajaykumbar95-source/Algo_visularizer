import React, { useState } from 'react';
import { ChevronDown, BarChart2, Share2, Search, Play, History as HistoryIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import HistoryPanel from './HistoryPanel';

interface SidebarProps {
  selectedAlgoId: string;
  onSelectAlgo: (id: string) => void;
  onSelectHistory: (algoId: string, input: any) => void;
}

const ALGORITHMS = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    icon: BarChart2,
    items: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'heap-sort', name: 'Heap Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
      { id: 'quick-sort', name: 'Quick Sort' },
    ]
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    icon: Share2,
    items: [
      { id: 'bfs', name: 'BFS' },
      { id: 'dfs', name: 'DFS' },
      { id: 'dijkstra', name: 'Dijkstra' },
      { id: 'kruskal', name: 'Kruskal\'s' },
      { id: 'bellman-ford', name: 'Bellman-Ford' },
      { id: 'floyd-warshall', name: 'Floyd-Warshall' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedAlgoId,
  onSelectAlgo,
  onSelectHistory,
}) => {
  const [expanded, setExpanded] = useState<string[]>(['sorting']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'algorithms' | 'history'>('algorithms');

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-64 border-r border-background-lighter bg-background-light flex flex-col h-screen overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <BarChart2 className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight leading-none">AlgoVisual</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1">Laboratory</span>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search algorithms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-background-lighter rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex p-1 bg-background border border-background-lighter rounded-xl">
            <button
              onClick={() => setActiveTab('algorithms')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                activeTab === 'algorithms' ? "bg-background-lighter text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <BarChart2 size={12} />
              Algos
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                activeTab === 'history' ? "bg-background-lighter text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <HistoryIcon size={12} />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {activeTab === 'algorithms' ? (
          <div className="px-3 pb-8 space-y-2">
            {ALGORITHMS.map((category) => {
              const filteredItems = category.items.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              if (filteredItems.length === 0) return null;

              return (
                <div key={category.id} className="mb-2">
                  <button 
                    onClick={() => toggleExpand(category.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-lg bg-background border border-background-lighter group-hover:border-primary/30 transition-colors",
                        expanded.includes(category.id) ? "text-primary" : "text-slate-500"
                      )}>
                        <category.icon size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{category.name}</span>
                    </div>
                    <ChevronDown size={14} className={cn("text-slate-600 transition-transform", expanded.includes(category.id) && "rotate-180")} />
                  </button>

                  <div className={cn(
                    "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                    expanded.includes(category.id) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectAlgo(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 pl-12 rounded-xl text-xs transition-all",
                          selectedAlgoId === item.id 
                            ? "bg-primary/10 text-primary font-bold border-r-2 border-primary" 
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                      >
                        {item.name}
                        {selectedAlgoId === item.id && <Play size={10} fill="currentColor" />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <HistoryPanel onSelectHistory={onSelectHistory} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
