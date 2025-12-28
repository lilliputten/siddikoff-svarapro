import { HTMLAttributes } from 'react';

import coinImage from '@/assets/game/coin.png';
import { cn } from '@/utils/cn';

interface Props extends HTMLAttributes<HTMLDivElement> {
  classNameImage?: string;
}

export const Coin = ({ className, classNameImage, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      <img
        className={cn('h-[16px] w-[20px] min-w-[20px]', classNameImage)}
        src={coinImage}
        alt="Coin"
      />
    </div>
  );
};
