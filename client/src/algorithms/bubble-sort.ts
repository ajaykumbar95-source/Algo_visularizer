import type { Step, Algorithm } from '../types';

export const BUBBLE_SORT: Algorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure bubbleSort(A : list of sortable items)',
    '    n := length(A)',
    '    repeat',
    '        swapped := false',
    '        for i := 1 to n-1 inclusive do',
    '            if A[i-1] > A[i] then',
    '                swap(A[i-1], A[i])',
    '                swapped := true',
    '        n := n - 1',
    '    until not swapped',
    'end procedure'
  ]
};

export function getBubbleSortSteps(inputArray: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...inputArray];
  const n = array.length;
  
  // Initial state
  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n, swapped: false },
    description: 'Starting Bubble Sort'
  });

  let swapped;
  let currentN = n;
  
  steps.push({
    array: [...array],
    activeLine: 1,
    variables: { n: currentN },
    description: 'Set n to length of array'
  });

  do {
    swapped = false;
    steps.push({
      array: [...array],
      activeLine: 3,
      variables: { n: currentN, swapped: false },
      description: 'Reset swapped flag'
    });

    for (let i = 1; i < currentN; i++) {
      steps.push({
        array: [...array],
        comparing: [i - 1, i],
        activeLine: 4,
        variables: { n: currentN, swapped, i },
        description: `Comparing ${array[i - 1]} and ${array[i]}`
      });

      if (array[i - 1] > array[i]) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        swapped = true;
        
        steps.push({
          array: [...array],
          swapping: [i - 1, i],
          activeLine: 6,
          variables: { n: currentN, swapped, i },
          description: `Swap ${array[i]} and ${array[i - 1]}`
        });
        
        steps.push({
          array: [...array],
          activeLine: 7,
          variables: { n: currentN, swapped, i },
          description: 'Set swapped to true'
        });
      }
    }
    
    currentN--;
    steps.push({
      array: [...array],
      sorted: [...(steps[steps.length - 1].sorted || []), currentN],
      activeLine: 8,
      variables: { n: currentN, swapped },
      description: `Decrement n to ${currentN}`
    });

  } while (swapped && currentN > 0);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 11,
    variables: { n: currentN, swapped },
    description: 'Sorting completed!'
  });

  return steps;
}
