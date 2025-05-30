import { ReactComponent as HelperIcon } from '@/assets/svg/helper-symbol.svg';
import { Button } from 'antd';
import type { FC } from 'react';

type DebtProps = {
  arrears: number;
};

export const Debt: FC<DebtProps> = ({ arrears }) => {
  return (
    <div className='flex flex-row items-center justify-between gap-2.5'>
      <div className='flex flex-col'>
        <p className='text-black/85'>Задолженность</p>
        <p className='text-lg font-bold text-red-500'>{arrears} Gamler</p>
      </div>
      <div className='flex flex-row items-center gap-2.5'>
        <Button>Погасить</Button>
        <HelperIcon />
      </div>
    </div>
  );
};
