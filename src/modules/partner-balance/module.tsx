import { useAccount } from '@/shared/hooks/api/useAccount';
import { useJettonWallet } from '@/shared/hooks/api/useJettonWallet';
import { useTonAddress } from '@tonconnect/ui-react';
import { useDebt, useEarnings } from './hooks/api/usePaymentStats';
import { CurrentBalance } from './slices/current-balance';
import { Debt } from './slices/debt';
import { TotalEarned } from './slices/total-earned';

export const PartnerBalanceModule = () => {
  const address = useTonAddress();
  const { data: account } = useAccount(address ?? '');
  const {
    data: jettonWallets,
    isLoading: isLoadingJettonWallets,
    isError: isErrorJettonWallets,
    isSuccess: isSuccessJettonWallets,
  } = useJettonWallet({ address: address! });
  const jettonWallet = jettonWallets?.balances.find((balance) => balance.jetton.symbol === 'FROGE');
  const { data: debt, isLoading: isLoadingDebt, isError: isErrorDebt, isSuccess: isSuccessDebt } = useDebt(account?.user_id ?? 0);
  const { data: earnings, isLoading: isLoadingEarnings, isError: isErrorEarnings, isSuccess: isSuccessEarnings } = useEarnings(account?.user_id ?? 0);
  return (
    <div className='flex h-[128px] w-[832px] flex-col gap-2.5'>
      <h2 className='text-lg font-medium text-black/85'>Партнерский баланс:</h2>
      <div className='flex flex-row justify-between bg-[#F6FFED] px-[26px] py-[18px]'>
        {isSuccessEarnings && <TotalEarned totalEarned={earnings.balance} />}
        {isLoadingEarnings && <p>Loading...</p>}
        {isErrorEarnings && <p>Ошибка при загрузке баланса</p>}
        <Line />
        {isSuccessJettonWallets && jettonWallet && (
          <CurrentBalance balance={(Number(jettonWallet?.balance) / 10 ** jettonWallet?.jetton.decimals).toFixed(2)} />
        )}
        {isLoadingJettonWallets && <p>Loading...</p>}
        {isErrorJettonWallets && <p>Ошибка при загрузке баланса</p>}
        <Line />
        {isSuccessDebt && <Debt arrears={debt} />}
        {isLoadingDebt && <p>Loading...</p>}
        {isErrorDebt && <p>Ошибка при загрузке долга</p>}
      </div>
    </div>
  );
};

const Line = () => <div className='h-full w-0.5 bg-black/10' />;
