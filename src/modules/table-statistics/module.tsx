import { Tabs } from 'antd';
import { DebtTable } from './entities/debt-table';
import { InviteTable } from './entities/invite-table';

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
  return (
    <div className='flex flex-col gap-2.5'>
      <Tabs defaultActiveKey='1' className='w-[1141px]'>
        <Tabs.TabPane tab='Таблица статистики' key='1'>
          <h1>f</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Ваши приглашённые' key='2'>
          <InviteTable tableData={INVITE_TABLE_DATA} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Задолженности' key='3'>
          <DebtTable />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
