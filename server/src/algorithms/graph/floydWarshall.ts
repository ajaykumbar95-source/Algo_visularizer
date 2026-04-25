import type { TraceStep } from '../../types/index.js';

export function getFloydWarshallTrace(adjList: Record<string, { to: string; weight: number }[]>, nodes: string[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const V = nodes.length;
  const dist: Record<string, Record<string, number | string>> = {};

  // Initial distances
  for (const u of nodes) {
    dist[u] = {};
    for (const v of nodes) {
      if (u === v) dist[u][v] = 0;
      else dist[u][v] = Infinity;
    }
  }

  const entries = Object.entries(adjList);
  for (const [from, neighbors] of entries) {
    for (const edge of neighbors) {
      const { to, weight } = edge;
      const uDist = dist[from];
      if (uDist) uDist[to] = weight;
    }
  }

  steps.push({
    activeLine: 0,
    variables: { dist: JSON.parse(JSON.stringify(dist)) },
    description: 'Starting Floyd-Warshall: Initializing distance matrix',
    distances: {}
  });

  for (let kIdx = 0; kIdx < V; kIdx++) {
    const k = nodes[kIdx]!;
    steps.push({
      activeLine: 5,
      variables: { k, dist: JSON.parse(JSON.stringify(dist)) },
      description: `Considering node ${k} as intermediate node`,
      current: k,
      distances: {}
    });

    for (let iIdx = 0; iIdx < V; iIdx++) {
      const i = nodes[iIdx]!;
      for (let jIdx = 0; jIdx < V; jIdx++) {
        const j = nodes[jIdx]!;
        
        const dIK = dist[i]![k];
        const dKJ = dist[k]![j];
        const dIJ = dist[i]![j];

        steps.push({
          activeLine: 8,
          variables: { k, i, j, dIK, dKJ, dIJ },
          description: `Checking if i->k->j (${i}->${k}->${j}) is shorter than i->j (${i}->${j})`,
          current: k,
          activeEdge: { from: i, to: j },
          distances: {}
        });

        if (dIK !== Infinity && dKJ !== Infinity && (dIK as number) + (dKJ as number) < (dIJ as number)) {
          dist[i]![j] = (dIK as number) + (dKJ as number);
          steps.push({
            activeLine: 9,
            variables: { k, i, j, newDist: dist[i]![j], dist: JSON.parse(JSON.stringify(dist)) },
            description: `Updated distance ${i}->${j} to ${dist[i]![j]}`,
            current: k,
            activeEdge: { from: i, to: j },
            distances: {}
          });
        }
      }
    }
  }

  steps.push({
    activeLine: 12,
    variables: { dist: JSON.parse(JSON.stringify(dist)) },
    description: 'Floyd-Warshall completed! All-pairs shortest paths found.',
    distances: {}
  });

  return steps;
}
