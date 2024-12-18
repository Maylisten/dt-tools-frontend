import {Process} from "./Process";
import {StoreFile} from "./StoreFile";

export interface Project {
  id: string
  name: string
  files?: StoreFile[],
  processes?: Process[]
}
