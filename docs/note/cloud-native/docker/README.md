---
title: Docker
---

## 简介

### 安装

## 镜像

### 获取镜像

`docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`

+ Docker 镜像仓库地址：地址的格式一般是 `<域名/IP>[:端口号]`。默认地址是 Docker Hub
+ 仓库名：如之前所说，这里的仓库名是两段式名称，即 `<用户名>/<软件名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

1. 从官方仓库获取镜像

`$ docker pull ubuntu:18.04`

```bash
18.04: Pulling from library/ubuntu
bf5d46315322: Pull complete
9f13e0ac480c: Pull complete
e8988b5b3097: Pull complete
40af181810e7: Pull complete
e6f7c7e5c03e: Pull complete
Digest: sha256:147913621d9cdea08853f6ba9116c2e27a3ceffecf3b492983ae97c3d643fbbe
Status: Downloaded newer image for ubuntu:18.04
```

2. 从私有仓库获取镜像

`$ docker pull sc.yhub.ysten.com:9881/sichuan/vas/yst-vas-batch:1.0.0130_sichuan`

### 运行

有了镜像后，我们就能够以这个镜像为基础启动并运行一个容器。

`$ docker run -it --rm ubuntu:18.04 bash`

```bash
root@d786d31cbd76:/# cat /etc/os-release
NAME="Ubuntu"
VERSION="18.04.2 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.2 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic
```

### 列出镜像

`$ docker image ls`

```bash
[root@localhost ~]# docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
redis                latest              5f515359c7f8        5 days ago          183 MB
nginx                latest              05a60462f8ba        5 days ago          181 MB
mongo                3.2                 fe9198c04d62        5 days ago          342 MB
<none>               <none>              00285df0df87        5 days ago          342 MB
ubuntu               18.04               f753707788c5        4 weeks ago         127 MB
ubuntu               latest              f753707788c5        4 weeks ago         127 MB
```

列表包含了 `仓库名`、`标签`、`镜像ID`、`创建时间`以及`所占用的空间`。**镜像 ID** 则是镜像的唯一标识，一个镜像可以对应多个**标签**

### 虚悬镜像

`docker image ls -f dangling=true`

一般来说，虚悬镜像已经失去了存在的价值，是可以随意删除的，可以用上面的命令删除。

### 镜像构建最小化

1. 减少镜像层

`错误示例`

```Dockerfile
FROM ubuntu
RUN apt-get update
RUN apt-get install vim
```

`正确示例`

```Dockerfile
FROM ubuntu
RUN apt-get update && apt-get install vim
```

2.删掉容器中所有不必要的东西

3.基于Alpine的较小基础镜像

## 网络

### Bridge网络模式

### Host网络模式

### Container网络模式

### None网络模式

## Dockerfile

### 概述

镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，这个脚本就是 Dockerfile。

Dockerfile 是一个文本文件，其内包含了一条条的**指令(Instruction)**，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

```dockerfile
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

### FROM

```dockerfile
FROM scratch
```

### BUILD

`build`指令用来构建镜像

格式：

`docker build [选项] <上下文路径/URL/->`

在 `Dockerfile` 文件所在目录执行：

`$ docker build -t nginx:v3 .`

### COPY

COPY有2种格式：

+ `COPY [--chown=<user>:<group>] <src>... <dest>`
+ `COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]`

`COPY`指令将从构建上下文目录中`<源路径>`的文件/目录复制到新的一层的镜像内的`<目标路径>`位置

```Dockerfile
COPY package.json /usr/src/app/
```

### ADD

`ADD`指令和`COPY`的格式和性质基本一致，但是在`COPY`基础上增加了一些功能。

1. `ADD`指令支持使用URL作为`<源路径>`参数

```Dockerfile
ADD http://foo.com/bar.go /tmp/
```

2. `ADD`指令能够自动解压缩文件

```Dockerfile
ADD foo.tar.gz /tmp/
```

PS: `COPY`和`ADD`指令中选择的时候，可以遵循这样的原则，所有的文件复制均使用`COPY`指令，仅在需要自动解压缩的场合使用`ADD`。

### RUN

`RUN`指令执行命令并创建新的镜像层，通常用于安装软件包。有2种运行命令的格式

+ shell格式：`RUN <命令>`，就像直接在命令行中输入的命令一样。

```Dockerfile
RUN echo hello world
```

+ exec格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。

```Dockerfile
RUN ["echo", "hello world"]
```

Dockerfile中每一个指令都会建立一层，`RUN`也不例外。每一个`RUN`的行为，就和刚才我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，commit这一层的修改，构成新的镜像。

### CMD

`CMD`指令的格式和`RUN`相似，也是两种格式：

+ shell格式：`CMD <命令>`
+ exec格式：`CMD ["可执行文件", "参数1", "参数2"...]`
+ 参数列表格式：`CMD ["参数1", "参数2"...]`，在`ENTRYPOINT`指令后，用`CMD`指定具体的参数。

`CMD`指令指定容器的默认执行命令，此命令会在容器启动且`docker run`没有指定其他命令时运行，如果指定了命令则会被替换

```Dockerfile
FROM busybox
CMD ["echo", "hello world"]
```

```shell
➜  /Users/pdd docker run test:v1
hello world

➜  /Users/pdd docker run -it test:v1 sh
/ #
```

### ENTRYPOINT

`ENTRYPOINT`的目的和`CMD`一样，都是在指定容器启动程序及参数。其指令的格式和`RUN`指令格式一样，分为shell格式和exec格式。

```Dockerfile
FROM busybox
ENTRYPOINT ["echo", "hello world"]
CMD [" --- pdd"]
```

当指定了`ENTRYPOINT`后，`CMD`的含义就发生了改变，不再是直接的运行其命令，而是将`CMD`的内容作为参数传给`ENTRYPOINT`指令

```shell
➜  /Users/pdd docker run test:v2
hello world  --- pdd
```

`ENTRYPOINT`在运行时也可以替代，不过比`CMD`要略显繁琐，需要通过 `docker run`的参数`--entrypoint`来指定。

```shell
➜  /Users/pdd docker run -it --entrypoint "sh" test:v2
/ #
```

### ENV

格式有两种：

+ `ENV <key> <value>`
+ `ENV <key1>=<value1> <key2>=<value2>...`

这个指令设置环境变量，无论是后面的其它指令，如 `RUN`，还是运行时的应用，都可以直接使用这里定义的环境变量。

```Dockerfie
ENV VERSION=1.0 DEBUG=on \
    NAME="Happy Feet"
```

### ARG

格式：`ARG <参数名>[=<默认值>]`

构建参数和 `ENV` 的效果一样，都是设置环境变量。所不同的是，`ARG` 所设置的构建环境的环境变量，在将来容器运行时是不会存在这些环境变量的。但是不要因此就使用 `ARG` 保存密码之类的信息，因为 `docker history` 还是可以看到所有值的。

### VOLUME

`docker run --name webserver -d -p 80:80 -v /data/logs/nginx/:/var/log/nginx nginx`

```bash
"Mounts": [
            {
                "Type": "bind",
                "Source": "/data/logs/nginx",
                "Destination": "/var/log/nginx",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ]
```

`docker run --name webserver_v2 -d -p 8080:80 -v nginx:/var/log/nginx nginx`

```bash
"Mounts": [
            {
                "Type": "volume",
                "Name": "nginx",
                "Source": "/var/lib/docker/volumes/nginx/_data",
                "Destination": "/var/log/nginx",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            }
        ]
```

### EXPOSE

`EXPOSE` 指令是声明容器运行时提供的服务端口

`docker run -p <宿主端口>:<容器端口>`，如果宿主端口不指定则服务器随机分配端口

```shell
➜  ~ docker run --name myapp-v1 -d -p 80 myhttp:v1
```

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                   NAMES
3070486b1d6c        myhttp:v1           "python httpserver1.…"   54 minutes ago      Up 54 minutes       0.0.0.0:32768->80/tcp   myapp-v1
```

#### EXPOSE和PUBLISH（run -p）的区别

+ 既没有在Dockerfile里Expose, 也没有run -p
  启动在这个container里的服务既不能被host主机和外网访问，也不能被link的container访问，只能在此容器内部使用

+ 只在Dockerfile里Expose了这个端口
  启动在这个container里的服务不能被docker外部世界（host和其他主机）访问，但是可以通过container link，被其他link的container访问到

+ 同时在Dockerfile里Expose，又run -p
  启动的这个cotnainer既可以被docker外部世界访问，也可以被link的container访问

+ 只有run -p
  docker做了特殊的隐式转换，等价于第一种情况，既可以被外部世界访问，也可以被link的container访问到（真对这种情况，原因是docker认为，既然你都要把port open到外部世界了，等价于其他的container肯定也能访问，所以docker做了自动的Expose

### WORKDIR

指定`dockerfile`的工作目录位置

### USER

指定当前用户

### ONBUILD

格式：`ONBUILD <其它指令>`。

`ONBUILD` 是一个特殊的指令，它后面跟的是其它指令，比如 `RUN`, `COPY` 等，而这些指令，在当前镜像构建时并不会被执行。只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行。

基础镜像

```dockerfile
FROM node:slim
RUN mkdir /app
WORKDIR /app
ONBUILD COPY ./package.json /app
ONBUILD RUN [ "npm", "install" ]
ONBUILD COPY . /app/
CMD [ "npm", "start" ]
```

子镜像

```dockerfile
FROM my-node
```

### 多阶段构建

允许一个Dockerfile 中出现多个 `FROM` 指令。

## 容器

### 启动

`$ docker run ubuntu:18.04 /bin/echo 'Hello world`

`$ docker run --name webserver -d -p 80:80 nginx`

### 日志

`docker container logs [container ID or NAMES]`

### 终止

`docker container stop|start|restart`

终止状态的容器可以用 `docker container ls -a` 命令看到。

### 进入

`$ docker exec -it webserver bash`

### 删除

删除一个处于终止状态的容器。

`$ docker container rm`

删除一个处于运行状态的容器。

`$ docker contain rm -f`

清理掉所有处于终止状态的容器

`$ docker container prune`

## SDK

### Go SDK

```go
go get github.com/docker/docker/client
```

#### 获取容器信息

`docker ps -a --filter="name=frontend"`

```go
package main

import (
  "context"
  "fmt"
  "github.com/docker/docker/api/types"
  "github.com/docker/docker/api/types/filters"
  "github.com/docker/docker/client"
)

func main() {
  cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
  if err != nil {
    fmt.Printf("docker api error: %s", err)
  }
  // 关闭docker api
  defer cli.Close()

  // docker ps -a --filter "name=frontend"
  customFilter := filters.NewArgs()
  customFilter.Add("name", "lcm_frontend_pdd")
  containers, err := cli.ContainerList(context.Background(), types.ContainerListOptions{All: true, Filters: customFilter})
  if err != nil {
    fmt.Printf("docker list error: %s", err)
  }
  if len(containers) == 0 {
    fmt.Println("containers not exist")
  }
  for _, container := range containers {
    fmt.Printf("ID: %s\n", container.ID)
    fmt.Printf("Image: %s\n", container.Image)
    fmt.Printf("State: %s\n", container.State)
  }
}
```

#### 获取本地镜像信息

`docker images --filter=reference='172.16.81.200:443/library/frontend'`

```go
package main

import (
  "context"
  "fmt"
  "github.com/docker/docker/api/types"
  "github.com/docker/docker/api/types/filters"
  "github.com/docker/docker/client"
)

func main() {
  cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
  if err != nil {
    fmt.Printf("docker api error: %s", err)
  }
  // 关闭docker api
  defer cli.Close()

  // docker images --filter=reference='172.16.81.200:443/library/frontend'
  customFilter := filters.NewArgs()
  customFilter.Add("reference", "172.16.81.200:443/library/frontend")
  images, err := cli.ImageList(context.Background(), types.ImageListOptions{All: true, Filters: customFilter})
  if err != nil {
    fmt.Printf("docker image error: %s", err)
  }
  if len(images) == 0 {
    fmt.Println("images not exist")
  }
  for _, image := range images {
    fmt.Printf("ID\n: %s", image.ID)
    fmt.Printf("Digest: %s\n", image.RepoDigests)
    fmt.Printf("Tag: %s\n", image.RepoTags)
  }
}
```
