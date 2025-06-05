import { LEADER_ID } from '@/shared/constants/consts';
import { formatUnixToDate } from '@/shared/utils/utils';
import { useTonAddress } from '@tonconnect/ui-react';
import { Button, Tabs } from 'antd';
import { DebtTable } from './entities/debt-table';
import { InviteTable } from './entities/invite-table';
import { TransactionsTable } from './entities/transactions-table';
import { filterFrogeTransfers, trimUserData } from './helpers/serialize';
import { useGetTransactions } from './hooks/api/useGetTransactions';
import { usePay } from './hooks/api/usePay';
import { usePaymentOrder } from './hooks/api/usePaymentOrders';
import { usePayAllOrders } from './hooks/api/usePayOrder';
import { useRefferals } from './hooks/api/useRefferals';

export const TableStatisticsModule = () => {
  const address = useTonAddress();
  const {
    data: paymentOrders,
    isLoading: isLoadingPaymentOrders,
    isError: isErrorPaymentOrders,
    isSuccess: isSuccessPaymentOrders,
  } = usePaymentOrder(LEADER_ID);

  const debt_table_data = paymentOrders
    ? paymentOrders.map((order) => ({
        order_id: order.id,
        tickets: order.ticket_count,
        date: formatUnixToDate(order.created_at),
        debt_amount: order.total_amount,
        refferer_id: order.referrer_id,
        refferal: order.telegram,
      }))
    : [];

  const { mutateAsync: createCell, isPending: isPendingPayAllOrders, isSuccess: isSuccessPayAllOrders } = usePayAllOrders();
  const { payAllOrders } = usePay(LEADER_ID);
  const debt_arr = debt_table_data.map((order) => ({
    amount: order.debt_amount,
    reffererId: order.refferer_id,
  }));

  const handlePayAllOrders = () => payAllOrders(createCell, debt_arr);

  const { data: refferals, isLoading: isLoadingRefferals, isError: isErrorRefferals, isSuccess: isSuccessRefferals } = useRefferals(address);
  const refferals_table_data = refferals && trimUserData(refferals);

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    isSuccess: isSuccessTransactions,
  } = useGetTransactions(address ?? '');

  const transactions_table_data = transactions && filterFrogeTransfers(transactions);
  console.log(transactions_table_data);

  return (
    <div className='flex flex-col gap-2.5'>
      <Tabs defaultActiveKey='1' className='w-[1141px]'>
        <Tabs.TabPane tab='Таблица статистики' key='1'>
          {isSuccessTransactions && transactions && <TransactionsTable tableData={transactions_table_data ?? []} />}
          {isLoadingTransactions && <p>Loading...</p>}
          {isErrorTransactions && <p>Ошибка при загрузке транзакций</p>}
        </Tabs.TabPane>
        <Tabs.TabPane tab='Ваши приглашённые' key='2'>
          {isSuccessRefferals && refferals_table_data && <InviteTable tableData={refferals_table_data.referred_users ?? []} />}
          {isLoadingRefferals && <p>Loading...</p>}
          {isErrorRefferals && <p>Ошибка при загрузке рефералов</p>}
        </Tabs.TabPane>
        <Tabs.TabPane tab='Задолженности' key='3' className='flex flex-col gap-2.5'>
          <div className='flex flex-row items-center gap-2.5'>
            <Button type='primary' onClick={handlePayAllOrders}>
              {isPendingPayAllOrders ? 'Ожидание...' : isSuccessPayAllOrders ? 'Выполнено' : 'Погасить все'}
            </Button>
            <p className='text-black/85'>
              Чтобы погасить все задолженности сразу, нажмите кнопку “Погасить все”. Или выберите реферала и оплатите каждую транзакцию отдельно
            </p>
          </div>
          {isSuccessPaymentOrders && debt_table_data && <DebtTable tableData={debt_table_data} />}
          {isLoadingPaymentOrders && <p>Loading...</p>}
          {isErrorPaymentOrders && <p>Ошибка при загрузке задолженностей</p>}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
