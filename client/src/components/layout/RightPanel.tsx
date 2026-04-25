import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Info, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RightPanelProps {
  pseudocode: string[];
  activeLine: number;
  variables: Record<string, any>;
  queue?: string[];
  stack?: string[];
  complexity: {
    time: string;
    space: string;
  };
}

const RightPanel: React.FC<RightPanelProps> = ({
  pseudocode,
  activeLine,
  variables,
  queue,
  stack,
  complexity,
}) => {
  return (
    <div className="w-80 border-l border-background-lighter bg-background-light flex flex-col h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pseudocode Section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 flex items-center gap-2 border-b border-background-lighter shrink-0">
            <Code2 size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pseudocode</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-background/50 font-mono text-[13px] leading-relaxed">
            {pseudocode.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  "px-3 py-0.5 rounded transition-all whitespace-pre",
                  activeLine === idx 
                    ? "bg-primary/20 text-white border-l-2 border-primary -ml-3 pl-2.5 shadow-sm" 
                    : "text-slate-500 opacity-80"
                )}
              >
                <span className="mr-4 text-slate-700 select-none inline-block w-4 text-right">{idx + 1}</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Variables Section */}
        <div className="h-1/3 border-t border-background-lighter flex flex-col shrink-0">
          <div className="p-4 flex items-center gap-2 border-b border-background-lighter shrink-0">
            <Activity size={16} className="text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Variables & State</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(queue || stack) && (
              <div className="space-y-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{queue ? 'Queue (FIFO)' : 'Stack (LIFO)'}</div>
                <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-background border border-background-lighter min-h-[40px] items-center">
                  {(queue || stack || []).map((val, i) => (
                    <motion.div
                      key={`${val}-${i}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-1 rounded bg-primary/20 border border-primary/30 text-xs font-mono text-primary font-bold"
                    >
                      {val}
                    </motion.div>
                  ))}
                  {(queue || stack || []).length === 0 && (
                    <span className="text-[10px] text-slate-600 italic">Empty</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(variables).map(([name, value]) => {
                // Skip queue/stack as they are handled above
                if (name === 'queue' || name === 'stack') return null;
                
                return (
                  <div key={name} className="p-3 rounded-xl bg-background border border-background-lighter shadow-sm">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{name}</div>
                    <div className="text-sm font-mono text-white truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.keys(variables).length === 0 && !queue && !stack && (
              <div className="text-center py-4 text-slate-600 italic text-sm">
                No active state
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complexity Section */}
      <div className="p-4 bg-background-light border-t border-background-lighter shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-active" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Complexity</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-background-lighter group hover:border-primary/30 transition-colors">
            <span className="text-xs text-slate-500">Time Complexity</span>
            <span className="text-xs font-mono font-bold text-white group-hover:text-primary transition-colors">{complexity.time}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-background-lighter group hover:border-secondary/30 transition-colors">
            <span className="text-xs text-slate-500">Space Complexity</span>
            <span className="text-xs font-mono font-bold text-white group-hover:text-secondary transition-colors">{complexity.space}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
