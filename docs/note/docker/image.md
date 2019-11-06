<center>
  <h1>镜像</h1>
</center>

## 获取镜像

docker pull

`docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`

+ Docker 镜像仓库地址：地址的格式一般是 `<域名/IP>[:端口号]`。默认地址是 Docker Hub
+ 仓库名：如之前所说，这里的仓库名是两段式名称，即 `<用户名>/<软件名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

从官方仓库获取镜像

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

从私有仓库获取镜像

`$ docker pull sc.yhub.ysten.com:9881/sichuan/vas/yst-vas-batch:1.0.0130_sichuan`



## 运行

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



## 列出镜像

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

列表包含了 `仓库名`、`标签`、`镜像 ID`、`创建时间` 以及 `所占用的空间`。**镜像 ID** 则是镜像的唯一标识，一个镜像可以对应多个**标签**



## 虚悬镜像

`docker image ls -f dangling=true`

一般来说，虚悬镜像已经失去了存在的价值，是可以随意删除的，可以用下面的命令删除。