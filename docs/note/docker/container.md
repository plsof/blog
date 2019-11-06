<center>
  <h1>容器</h1>
</center>

## 启动

`$ docker run ubuntu:18.04 /bin/echo 'Hello world`

`$ docker run --name webserver -d -p 80:80 nginx`



## 日志

`docker container logs [container ID or NAMES]`



## 终止

`docker container stop|start|restart`

终止状态的容器可以用 `docker container ls -a` 命令看到。



## 进入

`$ docker exec -it webserver bash`



## 删除

删除一个处于终止状态的容器。

`$ docker container rm`

删除一个处于运行状态的容器。

`$ docker contain rm -f`

清理掉所有处于终止状态的容器

`$ docker container prune`