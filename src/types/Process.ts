export type Process = {
  id: string,
  fileId: string,
  filename: string,
  steps: Step[],
  status: number // 表示当前正在执行第 n 步
}

export enum Step {
  DataClean = 'DataClean',
  DataSample = "DataSample",
  DataEncryption = 'DataEncryption',
  DataDecryption = 'DataDecryption',
  DataCompression = 'DataCompression'
}
