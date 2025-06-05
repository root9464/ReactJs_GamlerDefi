import { PartnerBalanceModule } from '@/modules/partner-balance/module';
import { ReferralLinkModule } from '@/modules/referral-link/module';
import { TableStatisticsModule } from '@/modules/table-statistics/module';
import { TonConnectButton } from '@tonconnect/ui-react';

export default function RefferalPage() {
  return (
    <div className='flex h-full w-full flex-col gap-8 px-[18px] py-4'>
      <ReferralDescription />
      <PartnerBalanceModule />
      <ReferralLinkModule />
      <TableStatisticsModule />
    </div>
  );
}

const ReferralDescription = () => (
  <div className='flex h-fit w-[900px] flex-col gap-2.5'>
    <h2 className='text-lg font-medium text-black/85'>Партнерская программа</h2>
    <p className='text-xs font-normal text-black/60'>
      Партнёрская программа — это способ получать вознаграждение за привлечение новых пользователей на платформу.
    </p>
    <p className='text-xs font-normal text-black/60'>
      Каждый зарегистрированный участник может стать реферером — пригласить других пользователей и получать бонусы за их активность.
    </p>
    <a href='#' className='text-base font-medium text-[#1890FF] underline'>
      Как работает партнёрская система
    </a>

    <TonConnectButton />
  </div>
);
