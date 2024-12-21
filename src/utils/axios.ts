import axios from 'axios';
import {Message} from "@/types/Message.ts";

const baseURL = import.meta.env.VITE_APP_BASE_URL;
export const $axios = axios.create({
  baseURL,
  headers: {
    post: {
      'Access-Control-Allow-Origin': "*"
    }
  }
});

// 简化的 GET 请求方法
export function get<T>(url: string): Promise<T> {
  return $axios.get<Message<T>>(url).then(res => res.data.data);
}

// 简化的 POST 请求方法
export function post<T>(url: string, ...args: unknown[]): Promise<T> {
  return $axios.post<Message<T>>(url, ...args).then(res => res.data.data);
}

// 简化的 DELETE 请求方法
export function del<T>(url: string, data?: unknown): Promise<T> {
  return $axios.delete<Message<T>>(url, {data}).then((res) => res.data.data);
}
