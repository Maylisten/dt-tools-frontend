export interface Message<T> {
  status: 'ok' | 'error'
  data: T,
  message?: string
}
