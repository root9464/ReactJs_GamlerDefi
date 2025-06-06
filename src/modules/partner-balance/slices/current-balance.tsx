import { ReactComponent as HelperIcon } from '@/assets/svg/helper-symbol.svg';
import { Button } from 'antd';
import type { FC } from 'react';

type CurrentBalanceProps = {
  balance: string;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({ balance }) => {
  return (
    <div className='flex flex-row items-center justify-between gap-2.5'>
      <div className='flex flex-col'>
        <p className='text-black/85'>Текущий баланс</p>
        <p className='text-lg font-bold text-black/85'>{balance} Gamler</p>
      </div>
      <div className='flex flex-row items-center gap-2.5'>
        <Button color='primary' variant='solid'>
          Вывести
        </Button>
        <HelperIcon />
      </div>
    </div>
  );
};
