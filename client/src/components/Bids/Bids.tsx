import { HTMLAttributes, useContext, useEffect, useRef } from 'react';

import { PositionsContext } from '@/context/PositionsContext';
import { cn } from '@/utils/cn';

import { Coin } from '../Coin/Coin';

interface Props extends HTMLAttributes<HTMLDivElement> {
  bet?: number;
}

export function Bids({ className }: Props) {
  const { changeBidsPosition } = useContext(PositionsContext);
  const ref = useRef<HTMLDivElement>(null);
  const chipsArray = new Array(2).fill(1);

  useEffect(() => {
    const onResizeHandler = () => {
      if (!ref.current) return;

      const refPosition = ref.current.getBoundingClientRect();

      changeBidsPosition({
        x: refPosition.x,
        y: refPosition.y,
      });
    };

    onResizeHandler();

    document.addEventListener('resize', onResizeHandler);

    return () => document.removeEventListener('resize', onResizeHandler);
  }, [changeBidsPosition]);

  return (
    <div
      className={cn(
        'absolute left-[47%] top-[51%] z-30 -translate-x-1/2',
        className,
      )}
      id="bids"
      ref={ref}
    >
      <div className="relative">
        <div className="flex w-[20px] flex-col">
          {chipsArray.map((_, index) => (
            <Coin
              key={index}
              className="absolute left-0 z-30"
              style={{
                top: `${-index * 4}px`,
              }}
            />
          ))}
        </div>
        <div className="-mt-1 flex w-[20px] translate-x-[74%] flex-col">
          {chipsArray.map((_, index) => (
            <Coin
              key={index}
              className="absolute left-0 z-30"
              style={{
                top: `${-index * 4}px`,
              }}
            />
          ))}
        </div>
        <div className="flex w-[20px] translate-x-[71%] translate-y-2 flex-col">
          {chipsArray.map((_, index) => (
            <Coin
              key={index}
              className="absolute left-0 z-30"
              style={{
                top: `${-index * 4}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
