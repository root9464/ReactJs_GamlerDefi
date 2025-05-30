import CopyIco from '@/assets/svg/copy.svg';
import { copyClipboard } from '@/shared/utils/utils';

import { cn } from '@/shared/utils/classes';

export const CopyClipboard = ({ data, className }: { data: string; className?: string }) => (
  <div
    className={cn(
      'flex cursor-pointer flex-row items-center justify-between gap-1 rounded-[6px] border border-[#D9D9D9] bg-white px-3 py-1.5 text-black/85',
      className,
    )}>
    <p className='w-full text-black/85'>{data}</p>
    <img src={CopyIco} alt='Magnifier' width={16} height={16} onClick={() => copyClipboard(data)} />
  </div>
);
