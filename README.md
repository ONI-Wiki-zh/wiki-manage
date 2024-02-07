# 缺氧中文wiki管理

## 启动

使用**Visual Studio Code**打开项目，在菜单栏依次点击`Termianl`-`New Terminal`。创建一个终端对话窗口。

输入以下命令，安装依赖

```shell
npm i
```

输入以下命令，进行调试

```shell
npm run dev
```

执行完后，点击终端对话窗口显示的网址进行访问。

## 打包

输入以下命令，进行打包

```shell
npm run build
```

打包完成后，会在项目根目录下，生成一个`dist`的目录。

将此`dist`目录复制到**缺氧中文wiki管理后台项目**的根目录下，即可完成部署。