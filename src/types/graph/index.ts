import { GraphOptions } from '@antv/g6'
export interface GraphOptionsPlus extends GraphOptions{
  id:string,
  entries:string,
  keyName:string,
  collapsed?:boolean,
  [propName:string]:any
}
export type WhConfig = [number,number,string]
    