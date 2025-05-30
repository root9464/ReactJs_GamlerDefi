import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { useState, type FC, type Key } from 'react';

type InviteTableDataType = {
  key: Key;
  name: string;
  percent: number;
  tg_name: string;
  date: string;
};

type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<InviteTableDataType>['field'];
  sortOrder?: SorterResult<InviteTableDataType>['order'];
  filters?: Parameters<GetProp<TableProps<InviteTableDataType>, 'onChange'>>[1];
};

const columns: TableColumnsType<InviteTableDataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Процент',
    dataIndex: 'percent',
    sorter: (a, b) => a.percent - b.percent,
    filters: [
      {
        text: '20%',
        value: 20,
      },
      {
        text: '2%',
        value: 2,
      },
    ],
    onFilter: (value, record) => record.percent === value,
  },
  {
    title: 'Telegram',
    dataIndex: 'tg_name',
  },
  {
    title: 'Дата',
    dataIndex: 'date',
  },
];

export const InviteTable: FC<{ tableData: InviteTableDataType[] }> = ({ tableData }) => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
    }));
  };

  return <Table<InviteTableDataType> columns={columns} dataSource={tableData} onChange={handleTableChange} pagination={tableParams.pagination} />;
};
