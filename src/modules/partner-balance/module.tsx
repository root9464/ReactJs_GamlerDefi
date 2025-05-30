import { CurrentBalance } from './slices/current-balance';
import { Debt } from './slices/debt';
import { TotalEarned } from './slices/total-earned';

export const PartnerBalanceModule = () => {
  return (
    <div className='flex h-[128px] w-[832px] flex-col gap-2.5'>
      <h2 className='text-lg font-medium text-black/85'>Партнерский баланс:</h2>
      <div className='flex flex-row justify-between bg-[#F6FFED] px-[26px] py-[18px]'>
        <TotalEarned totalEarned={12500} />
        <Line />
        <CurrentBalance balance={1000} />
        <Line />
        <Debt arrears={500} />
      </div>
    </div>
  );
};

const Line = () => <div className='h-full w-0.5 bg-black/10' />;
