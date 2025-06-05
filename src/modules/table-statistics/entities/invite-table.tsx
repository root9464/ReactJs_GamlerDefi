import { Table, type GetProp, type TablePaginationConfig, type TableProps } from 'antd';
import Column from 'antd/es/table/Column';
import type { SorterResult } from 'antd/es/table/interface';
import { useState, type FC } from 'react';

export type InviteTableType = {
  user_id: number;
  name: string | null;
  telegram: string;
  refer_id: number | null | undefined;
  percent?: number;
  createdAt?: string | null;
};

type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<InviteTableType>['field'];
  sortOrder?: SorterResult<InviteTableType>['order'];
  filters?: Parameters<GetProp<TableProps<InviteTableType>, 'onChange'>>[1];
};

export const InviteTable: FC<{ tableData: InviteTableType[] }> = ({ tableData }) => {
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
  return (
    <Table dataSource={tableData} onChange={handleTableChange} pagination={tableParams.pagination} rowKey='user_id'>
      <Column title='Реферал' dataIndex='name' key='name' />
      <Column title='Процент' dataIndex='percent' key='percent' sorter={(a, b) => a.percent - b.percent} />
      <Column title='Телеграм' dataIndex='telegram' key='telegram' />
      <Column title='Дата' dataIndex='createdAt' sorter={(a, b) => a.createdAt.localeCompare(b.createdAt)} key='createdAt' />
    </Table>
  );
};
