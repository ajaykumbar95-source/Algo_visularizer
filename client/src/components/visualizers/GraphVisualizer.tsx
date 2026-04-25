import React from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface GraphVisualizerProps {
  adjList: Record<string, any>;
  visited: string[];
  current: string | null;
  activeEdge?: { from: string; to: string } | null;
  mstEdges?: { from: string; to: string }[];
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | string>;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  adjList,
  visited,
  current,
  activeEdge,
  mstEdges,
  queue,
  stack,
  distances,
}) => {
  const nodes = Object.keys(adjList);
  
  // Simple circular layout
  const nodePositions: Record<string, { x: number, y: number }> = {};
  const radius = 150;
  const centerX = 250;
  const centerY = 200;

  nodes.forEach((id, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    nodePositions[id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const edges: Edge[] = [];
  const seenEdges = new Set<string>();

  nodes.forEach(from => {
    const neighbors = adjList[from];
    if (Array.isArray(neighbors)) {
      neighbors.forEach(to => {
        const edgeId = [from, to].sort().join('-');
        if (!seenEdges.has(edgeId)) {
          edges.push({ from, to });
          seenEdges.add(edgeId);
        }
      });
    } else if (typeof neighbors === 'object' && neighbors !== null) {
      // Dijkstra style (array of objects with weight)
      (neighbors as any[]).forEach(edge => {
        const to = edge.to;
        const weight = edge.weight;
        const edgeId = [from, to].sort().join('-');
        if (!seenEdges.has(edgeId)) {
          edges.push({ from, to, weight });
          seenEdges.add(edgeId);
        }
      });
    }
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg width="500" height="400" viewBox="0 0 500 400" className="w-full h-full max-h-[400px]">
        {/* Render Edges */}
        {edges.map((edge, i) => {
          const p1 = nodePositions[edge.from];
          const p2 = nodePositions[edge.to];
          if (!p1 || !p2) return null;
          
          const isActive = activeEdge && (
            (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
            (activeEdge.from === edge.to && activeEdge.to === edge.from)
          );
          
          const isMST = mstEdges && mstEdges.some(e => 
            (e.from === edge.from && e.to === edge.to) ||
            (e.from === edge.to && e.to === edge.from)
          );
          
          return (
            <g key={`edge-${i}`}>
              <motion.line
                initial={false}
                animate={{
                  stroke: isMST ? '#10b981' : (isActive ? '#f59e0b' : '#475569'),
                  strokeWidth: isMST || isActive ? 4 : 2,
                }}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                transition={{ duration: 0.3 }}
              />
              {edge.weight !== undefined && (
                <text
                  x={(p1.x + p2.x) / 2}
                  y={(p1.y + p2.y) / 2 - 5}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-bold"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Render Nodes */}
        {nodes.map(id => {
          const pos = nodePositions[id];
          if (!pos) return null;
          
          const isVisited = visited.includes(id);
          const isCurrent = current === id;
          const isInQueue = queue?.includes(id);
          const isInStack = stack?.includes(id);
          
          let color = '#334155'; // Default
          if (isCurrent) color = '#f59e0b'; // Current
          else if (isVisited) color = '#10b981'; // Visited
          else if (isInQueue || isInStack) color = '#3b82f6'; // In data structure

          return (
            <motion.g
              key={id}
              initial={false}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill={color}
                className="transition-colors duration-300 stroke-white/10 stroke-2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy=".3em"
                className="fill-white font-bold text-xs pointer-events-none"
              >
                {id}
              </text>
              {distances && distances[id] !== undefined && (
                <text
                  x={pos.x}
                  y={pos.y + 35}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px] font-mono font-bold"
                >
                  dist: {distances[id] === Infinity ? '∞' : distances[id]}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-xs text-slate-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-xs text-slate-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span className="text-xs text-slate-400">{queue ? 'Queue' : 'Stack'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#334155]" />
          <span className="text-xs text-slate-400">Unvisited</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
