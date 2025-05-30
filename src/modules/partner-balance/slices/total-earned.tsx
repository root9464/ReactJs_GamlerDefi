import type { FC } from 'react';

type TotalEarnedProps = {
  totalEarned: number;
};

export const TotalEarned: FC<TotalEarnedProps> = ({ totalEarned }) => {
  return (
    <div className='flex flex-col'>
      <p className='text-black/85'>Всего заработано</p>
      <p className='text-lg font-bold text-black/60'>{totalEarned} Gamler</p>
    </div>
  );
};
