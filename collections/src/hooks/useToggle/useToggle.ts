import { useCallback, useState } from 'react';

/**
 * A handy hook to toggle visibility of components on the page
 *
 * Courtesy of https://usehooks.com/useToggle/
 */
export const useToggle = (initialState = false): [boolean, () => void] => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the component,
  // This function changes the boolean value to its opposite value
  const toggle = useCallback((): void => setState((state) => !state), []);

  return [state, toggle];
};
