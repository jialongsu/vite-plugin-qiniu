/*
 * @Author: Arno.su
 * @Date: 2021-11-24 18:20:33
 * @LastEditors: Arno.su
 * @LastEditTime: 2022-10-20 17:11:17
 */
import { Plugin } from 'vite';

interface Options {
  /**
   * 七牛 Access Key
   */
  accessKey: string;
  /**
   * 七牛 Secret Key
   */
  secretKey: string;
  /**
   * 七牛 空间名
   */
  bucket: string;
  /**
   * 上传文件前，先强制删除之前上传七牛云上的文件
   */
  forceDelete?: boolean;
  /**
   * 上传文件的根目录名称，默认为项目名称
   */
  rootName?: string;
  /**
   * 是否输出上传日志，默认为false
   */
  isLog?: boolean;
}

declare const _default: (options: Options) => Plugin;

export { _default as default };
