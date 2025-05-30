import { CopyClipboard } from '@/components/features/copy-clipboard';

export const ReferralLinkModule = () => {
  return (
    <div className='flex h-[128px] w-[1141px] flex-col gap-2.5'>
      <h2 className='text-lg font-medium text-black/85'>Вы можете пригласить пользователя через персональную ссылку:</h2>
      <div className='flex flex-row justify-between gap-9 bg-[#F6FFED] px-[26px] py-[18px]'>
        <div className='flex w-[511px] flex-col gap-2'>
          <p className='text-black/85'>Моя ссылка для приглашения</p>
          <CopyClipboard data='text' />
        </div>
        <p className='w-[585px] text-black/85'>
          Также можно просто <span className='font-bold'>попросить человека указать ваш Telegram-ник</span> при регистрации в
          <a href='#' className='text-[#1890FF] underline'>
            Telegram-боте.
          </a>
        </p>
      </div>
    </div>
  );
};
