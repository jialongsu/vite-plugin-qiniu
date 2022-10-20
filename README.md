# vite-plugin-qiniu

将打包好的静态资源上传至七牛

## 安装

```sh
npm install -D vite-plugin-qiniu

or 

yarn add -D vite-plugin-qiniu
```

## 使用

```js
import vitePluginQiniu from 'vite-plugin-qiniu';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginQiniu({ 
      accessKey: '',
      secretKey: '', 
      bucket: '', 
      forceDelete: true 
    }),
  ],
});
```

## Options

| Name | Type | Default| Required| Description |
| --- | --- | --- | --- | --- |
|  accessKey   |  string   |  ''   |   true  |  七牛 Access Key   |
|  secretKey   |  string   |  ''  |  true   |  七牛 Secret Key   |
|  bucket   |  string   |  ''   |   true  |  七牛 空间名   |
|  forceDelete   |  boolean   |  false   |  false   |  上传文件前，先强制删除之前上传七牛云上的文件   |
