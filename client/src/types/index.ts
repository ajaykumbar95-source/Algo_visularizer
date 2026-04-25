export type AlgorithmCategory = 'sorting' | 'graph' | 'searching';

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  pseudocode: string[];
}

export interface Step {
  // Sorting specific
  array?: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  
  // Graph specific
  visited?: string[];
  current?: string | null;
  activeEdge?: { from: string; to: string } | null;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | string>;
  edges?: { from: string; to: string; weight?: number }[];
  mstEdges?: { from: string; to: string; weight?: number }[];
  
  // Common
  activeLine: number;
  variables: Record<string, any>;
  description: string;
}

export interface TraceResponse {
  algorithmId: string;
  steps: Step[];
}
