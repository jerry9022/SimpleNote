## SimpleNote

> 一个简单的笔记项目。  
> 用户可以部署此项目到自己的服务器上，就可以在线记录自己的笔记了。  
> 访问我的部署效果：[http://note.ipyro.cn/article/list](http://note.ipyro.cn/article/list)

#### 项目说明 

1、该项目采用前后端分离方式开发。  
2、前端使用vue开发。  
3、后端使用node+express+sqlite开发，整个服务端的代码在server目录。 

### 本地项目启动

1、当前目录下执行以下命令，启动前端
```
$npm install #安装依赖

$npm run dev #开发环境下启动
 
```

2、定位到server目录下执行以下命令，启动后端接口
```
$npm install #安装依赖

$npm start #开发环境下启动
 
```

3、在浏览器中访问http://localhost:8083


### 线上部署
1. 当前目录下执行以下命令，编译前端
```
$npm install #安装依赖
$npm run build #开发环境下启动
```
编译后的文件在dist目录中

2. 上传文件到服务器上  
比如服务器使用目录: /var/mypro   
分别上传server目录和dist目录到该目录下  
服务接口位置就是：/var/mypro/server  
前端文件位置就是：/var/mypro/dist  

3、安装nginx并配置接口及前端访问

4、启动nginx,启动接口服务，然后就可以远程访问了
