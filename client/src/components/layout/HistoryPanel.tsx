import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Clock, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';

interface HistoryItem {
  id: string;
  algorithmId: string;
  inputData: any;
  createdAt: string;
}

interface HistoryPanelProps {
  onSelectHistory: (algoId: string, input: any) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelectHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
          <HistoryIcon size={24} />
        </div>
        <h3 className="text-white font-bold mb-2">Login Required</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          Sign in to save and view your algorithm execution history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon size={16} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your History</span>
        </div>
        <button 
          onClick={fetchHistory}
          className="text-[10px] text-primary hover:underline font-bold"
        >
          Refresh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : history.length > 0 ? (
          <AnimatePresence>
            {history.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelectHistory(item.algorithmId, item.inputData)}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors uppercase">
                    {item.algorithmId.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock size={10} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[140px] font-mono">
                    {JSON.stringify(item.inputData)}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={12} className="text-primary" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-xs italic">No history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
