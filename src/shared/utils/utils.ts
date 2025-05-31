import axios, { type AxiosRequestConfig } from 'axios';
import type { Extend } from 'node_modules/zod/dist/types/v4/core/util';
import { z } from 'zod/v4';

const validateResult = <T extends z.ZodType, R>(data: R, resType: T): z.infer<T> => {
  try {
    return resType.parse(data);
  } catch (error) {
    console.error('Validation error:', (error as z.ZodError).toString());
    throw error;
  }
};

const copyClipboard = async (text: string) => await navigator.clipboard.writeText(text);

const formatUnixToDate = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

type FetchDataOptions<T> = Extend<
  AxiosRequestConfig,
  {
    schema: z.ZodSchema<T>;
    body?: unknown;
  }
>;

const fetchData = async <T>({ method, url, data: body, schema, ...config }: FetchDataOptions<T>): Promise<T> => {
  const { data, status, statusText } = await axios.request<T>({ method, url, data: body, ...config });
  if (status < 200 || status >= 300) {
    throw new Error(statusText || `Request failed with status ${status}`);
  }
  return validateResult(data, schema);
};

export { copyClipboard, fetchData, formatUnixToDate, validateResult };
