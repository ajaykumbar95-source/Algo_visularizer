import type { Step, Algorithm } from '../types';

export const INSERTION_SORT: Algorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure insertionSort(A : list of sortable items)',
    '    for i := 1 to length(A) - 1 do',
    '        key := A[i]',
    '        j := i - 1',
    '        while j >= 0 and A[j] > key do',
    '            A[j + 1] := A[j]',
    '            j := j - 1',
    '        A[j + 1] := key',
    'end procedure'
  ]
};

export function getInsertionSortSteps(inputArray: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { i: 0 },
    description: 'Starting Insertion Sort'
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    
    steps.push({
      array: [...array],
      activeLine: 1,
      variables: { i, key },
      description: `Selecting element at index ${i} (value: ${key}) as key`
    });

    steps.push({
      array: [...array],
      activeLine: 2,
      variables: { i, key },
      description: `Key is ${key}`
    });

    let j = i - 1;
    steps.push({
      array: [...array],
      activeLine: 3,
      variables: { i, key, j },
      description: `Set j to i - 1 (${j})`
    });

    while (j >= 0 && array[j] > key) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        activeLine: 4,
        variables: { i, key, j },
        description: `Comparing A[j] (${array[j]}) > key (${key})`
      });

      array[j + 1] = array[j];
      
      steps.push({
        array: [...array],
        swapping: [j, j + 1],
        activeLine: 5,
        variables: { i, key, j },
        description: `Shifting A[j] (${array[j]}) to the right`
      });

      j = j - 1;
      steps.push({
        array: [...array],
        activeLine: 6,
        variables: { i, key, j },
        description: `Decrementing j to ${j}`
      });
    }

    array[j + 1] = key;
    steps.push({
      array: [...array],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      activeLine: 7,
      variables: { i, key, j },
      description: `Inserting key (${key}) at index ${j + 1}`
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, k) => k),
    activeLine: 8,
    variables: {},
    description: 'Sorting completed!'
  });

  return steps;
}
