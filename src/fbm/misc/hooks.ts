import { useEffect, useState } from 'react';
import { handleDarkMode } from './utils';

export const useDarkModeObserver = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    handleDarkMode(
      () => {
        setIsDarkMode(true);
      },
      () => {
        setIsDarkMode(false);
      }
    );
  }, []);

  return isDarkMode;
};
