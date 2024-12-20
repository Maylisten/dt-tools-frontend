import {isReactive, toRaw} from "vue";

/**
 * 将 File 转换为 Blob
 * @param file - 要转换的 File 对象
 * @returns {Promise<Blob>} - 转换后的 Blob 对象
 */
export async function fileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 设置文件读取成功后的回调
    reader.onloadend = () => {
      // 文件读取成功，将结果转换为 Blob
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        resolve(new Blob([result]));
      } else {
        reject(new Error('FileReader result is not an ArrayBuffer'));
      }
    };

    // 设置文件读取错误的回调
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    // 将文件读取为二进制字符串（ArrayBuffer）
    reader.readAsArrayBuffer(file);
  });
}

// 递归转换响应式对象为普通对象
export function convertToPlainObject<T>(reactiveObject: T): T {
  if (isReactive(reactiveObject)) {
    // 如果是响应式对象，转换它
    const rawObject = toRaw(reactiveObject);

    // 递归处理嵌套的对象
    for (const key in rawObject) {
      if (isReactive(rawObject[key])) {
        rawObject[key] = convertToPlainObject(rawObject[key]);
      }
    }

    return rawObject;
  } else if (Array.isArray(reactiveObject)) {
    // 如果是数组，递归处理每一项
    return reactiveObject.map(item => convertToPlainObject(item)) as unknown as T;
  } else {
    // 如果既不是响应式对象也不是数组，直接返回
    return reactiveObject;
  }
}

export async function readSubEntryListFromEntryDirectory(entry: FileSystemDirectoryEntry) {
  const reader = entry.createReader();
  const readPartSubEntry = async () => {
    return new Promise<FileSystemEntry[]>((resolve, reject) => {
      try {
        reader.readEntries((subEntryList: FileSystemEntry[]) => {
          resolve(subEntryList);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  const subEntryList: FileSystemEntry[] = [];
  let readAll = false;
  while (!readAll) {
    const partEntryList = await readPartSubEntry();
    subEntryList.push(...partEntryList);
    if (partEntryList.length < 100) {
      readAll = true;
    }
  }
  return subEntryList;
}

export async function readFileFromFileEntry(entry: FileSystemFileEntry) {
  return new Promise<File>((resolve, reject) => {
    try {
      entry.file((file) => {
        resolve(file);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function replaceFileName(fileName: string, newName: string): string {
  // 使用正则表达式匹配文件名和后缀
  const fileExtensionPattern = /(\.[^/.]+)$/; // 匹配文件后缀
  const extensionMatch = fileName.match(fileExtensionPattern); // 获取文件后缀

  // 获取文件名部分
  const baseName = fileName.replace(fileExtensionPattern, ''); // 去掉后缀

  // 如果有后缀，返回新的文件名加上后缀；如果没有后缀，返回新的文件名
  return extensionMatch ? `${newName}${extensionMatch[0]}` : newName;
}

