import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        callback();
      }
    };
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [callback]);
}
