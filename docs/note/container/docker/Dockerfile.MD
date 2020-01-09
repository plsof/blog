---
title: Dockerfile
---

```yaml
FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
COPY httpserver1.py /code/
WORKDIR /code/
CMD [ "python", "httpserver1.py" ]
EXPOSE 80
```

## EXPOSE
`docker run -p <宿主端口>:<容器端口>`，如果宿主端口不指定则服务器随机分配端口

```shell
➜  ~ docker run --name myapp-v1 -d -p 80 myhttp:v1
```

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                   NAMES
3070486b1d6c        myhttp:v1           "python httpserver1.…"   54 minutes ago      Up 54 minutes       0.0.0.0:32768->80/tcp   myapp-v1
```

### EXPOSE和PUBLISH（run -p）的区别
- 既没有在Dockerfile里Expose，也没有run -p
  启动在这个container里的服务既不能被host主机和外网访问，也不能被link的container访问，只能在此容器内部使用
- 只在Dockerfile里Expose了这个端口
  启动在这个container里的服务不能被docker外部世界（host和其他主机）访问，但是可以通过container link，被其他link的container访问到
- 同时在Dockerfile里Expose，又run -p
  启动的这个cotnainer既可以被docker外部世界访问，也可以被link的container访问
- 只有run -p
  docker做了特殊的隐式转换，等价于第一种情况，既可以被外部世界访问，也可以被link的container访问到（真对这种情况，原因是docker认为，既然你都要把port open到外部世界了，等价于其他的container肯定也能访问，所以docker做了自动的Expose
