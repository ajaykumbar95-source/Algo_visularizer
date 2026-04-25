import type { Request, Response } from 'express';
import { getBubbleSortTrace } from '../algorithms/sorting/bubbleSort.js';
import { getInsertionSortTrace } from '../algorithms/sorting/insertionSort.js';
import { getSelectionSortTrace } from '../algorithms/sorting/selectionSort.js';
import { getHeapSortTrace } from '../algorithms/sorting/heapSort.js';
import { getMergeSortTrace } from '../algorithms/sorting/mergeSort.js';
import { getQuickSortTrace } from '../algorithms/sorting/quickSort.js';
import { getBFSTrace } from '../algorithms/graph/bfs.js';
import { getDFSTrace } from '../algorithms/graph/dfs.js';
import { getDijkstraTrace } from '../algorithms/graph/dijkstra.js';
import { getKruskalTrace } from '../algorithms/graph/kruskal.js';
import { getBellmanFordTrace } from '../algorithms/graph/bellmanFord.js';
import { getFloydWarshallTrace } from '../algorithms/graph/floydWarshall.js';
import type { TraceResponse } from '../types/index.js';

export const getAlgorithmTrace = async (req: Request, res: Response): Promise<void> => {
  const { algorithmId, inputData } = req.body;

  if (!algorithmId || !inputData) {
    res.status(400).json({ error: 'Missing algorithmId or inputData' });
    return;
  }

  try {
    let steps;
    switch (algorithmId) {
      case 'bubble-sort':
        steps = getBubbleSortTrace(inputData);
        break;
      case 'insertion-sort':
        steps = getInsertionSortTrace(inputData);
        break;
      case 'selection-sort':
        steps = getSelectionSortTrace(inputData);
        break;
      case 'heap-sort':
        steps = getHeapSortTrace(inputData);
        break;
      case 'merge-sort':
        steps = getMergeSortTrace(inputData);
        break;
      case 'quick-sort':
        steps = getQuickSortTrace(inputData);
        break;
      case 'bfs':
        steps = getBFSTrace(inputData.adjList, inputData.startNode);
        break;
      case 'dfs':
        steps = getDFSTrace(inputData.adjList, inputData.startNode);
        break;
      case 'dijkstra':
        steps = getDijkstraTrace(inputData.adjList, inputData.startNode);
        break;
      case 'kruskal':
        steps = getKruskalTrace(inputData.adjList, Object.keys(inputData.adjList));
        break;
      case 'bellman-ford':
        steps = getBellmanFordTrace(inputData.adjList, Object.keys(inputData.adjList), inputData.startNode);
        break;
      case 'floyd-warshall':
        steps = getFloydWarshallTrace(inputData.adjList, Object.keys(inputData.adjList));
        break;
      default:
        res.status(404).json({ error: 'Algorithm not found' });
        return;
    }

    const response: TraceResponse = {
      algorithmId,
      steps,
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating trace:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
