import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SortingVisualizerProps {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  maxVal: number;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  array,
  comparing,
  swapping,
  sorted,
  maxVal,
}) => {
  return (
    <div className="flex items-end justify-center gap-1 w-full h-full max-h-[400px]">
      <AnimatePresence mode="popLayout">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isSorted = sorted.includes(idx);
          
          return (
            <motion.div
              key={`${idx}-${value}`} // Use key to force animation on value/index change
              layout
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: 1, 
                scaleY: 1,
                backgroundColor: isSwapping 
                  ? '#ef4444' // Error/Red for swap
                  : isComparing 
                    ? '#f59e0b' // Active/Yellow for compare
                    : isSorted 
                      ? '#10b981' // Success/Green for sorted
                      : '#3b82f6', // Primary/Blue for default
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                backgroundColor: { duration: 0.2 }
              }}
              style={{
                height: `${(value / maxVal) * 100}%`,
              }}
              className={cn(
                "flex-1 min-w-[8px] rounded-t-lg shadow-lg relative group",
                isComparing && "z-10 shadow-active/40",
                isSwapping && "z-10 shadow-error/40",
                isSorted && "shadow-success/20"
              )}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {value}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SortingVisualizer;
