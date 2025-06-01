import { LEADER_ID } from '@/shared/constants/consts';
import { formatUnixToDate } from '@/shared/utils/utils';
import { Button, Tabs } from 'antd';
import { DebtTable } from './entities/debt-table';
import { InviteTable } from './entities/invite-table';
import { usePay } from './hooks/api/usePay';
import { usePaymentOrder } from './hooks/api/usePaymentOrders';
import { usePayAllOrders } from './hooks/api/usePayOrder';

const INVITE_TABLE_DATA = [
  {
    key: '1',
    name: 'John Brown',
    percent: 98,
    tg_name: '60',
    date: '70',
  },
  {
    key: '2',
    name: 'Jim Green',
    percent: 98,
    tg_name: '60',
    date: '70',
  },
  {
    key: '3',
    name: 'Joe Black',
    percent: 98,
    tg_name: '60',
    date: '70',
  },
  {
    key: '4',
    name: 'Jim Red',
    percent: 88,
    tg_name: '60',
    date: '70',
  },
];

export const TableStatisticsModule = () => {
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

  return (
    <div className='flex flex-col gap-2.5'>
      <Tabs defaultActiveKey='1' className='w-[1141px]'>
        <Tabs.TabPane tab='Таблица статистики' key='1'>
          <h1>f</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Ваши приглашённые' key='2'>
          <InviteTable tableData={INVITE_TABLE_DATA} />
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
