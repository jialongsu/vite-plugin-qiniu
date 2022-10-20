/*
 * @Author: Arno.su
 * @Date: 2021-11-24 16:06:04
 * @LastEditors: Arno.su
 * @LastEditTime: 2022-10-20 16:03:04
 */
const qiniu = require('qiniu');
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const Qiniu = require('./src/qiniu');
const {
  log
} = require('./src/utils');

const PLUGIN_NAME = 'vite-plugin-qiniu';
const projectName = path.basename(process.cwd());

class QiuniuPlugin {
  constructor(options) {
    this.qiniu = new Qiniu(options);
  }

  apply({
    filePathAry,
    outputPath
  }) {
    this.batchUpload(filePathAry, outputPath);
  }

  async batchUpload(filePathAry, buildPath) {
    const {
      bucket
    } = this.qiniu.options;
    const uploadData = {};

    filePathAry.forEach((filename, index) => {
      uploadData[`${projectName}/${filename}`] = `${buildPath}/${filename}`;
    });

    const uploadAry = await this.batchDelete(Object.keys(uploadData));
    const len = uploadAry.length
    const maxIndex = len - 1;

    if (len === 0) {
      log(`😭  没有发现需要上传的文件 \n`);
      return;
    }

    log(`⬆️   将上传 ${len} 个文件`);
    uploadAry.forEach(async (key, i) => {
      const filePath = uploadData[key];

      log(`🚀  正在上传第 ${i + 1} 个文件: ${key}`);
      await this.qiniu.putFile(key, filePath);
      if (maxIndex === i) {
        log(`👏  上传完成！`);
      }
    });

  }

  async batchDelete(uploadFilePathAry) {
    const {
      forceDelete
    } = this.qiniu.options;
    const resourceList = await this.qiniu.getResouceList(projectName); // 获取之前上传七牛的文件
    const deleteAry = forceDelete ? resourceList : lodash.difference(resourceList, uploadFilePathAry); // 获取需要先在七牛上删除的文件
    const uploadAry = forceDelete ? uploadFilePathAry : lodash.difference(uploadFilePathAry, resourceList); // 获取需要上传的文件

    if (deleteAry.length > 1) {
      await this.qiniu.batchDeleteFile(deleteAry); // 删除文件
    }

    return uploadAry;
  }

}

module.exports = function vitePluginQiniu(options) {
  const qiniu = new QiuniuPlugin(options);
  let outputPath = '';

  const getFilePaths = (pathName) => {
    const files = fs.readdirSync(pathName);
    return files.map((item) => {
      const filePath = `${pathName}/${item}`;
      const stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
        return getFilePaths(filePath);
      } else {
        return pathName === outputPath ? item : filePath.replace(`${outputPath}/`, '');
      }
    }).flat();
  }

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    configResolved: async (config) => {
      outputPath = config.build.outDir;
    },
    closeBundle(e) {
      const filePathAry = getFilePaths(outputPath);
      qiniu.apply({
        filePathAry,
        outputPath
      });
    },
  }
}