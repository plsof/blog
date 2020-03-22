---
title: confd
---

## 概述
`confd`是一个轻量级的配置管理工具

## 安装

### 下载
```shell
[root@localhost ~]# wget -c 'https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64'
```

### 部署
```shell
[root@localhost ~]# cp confd-0.16.0-linux-amd64 /usr/bin/confd
[root@localhost ~]# chmod +x /usr/bin/confd
```

## 配置
`confd`通过读取后端存储的配置信息来动态更新对应的配置文件，对应的后端存储可以是etcd，redis等，其中etcd的v3版本对应的存储后端为etcdv3。

```shell
mkdir -p /etc/confd/{conf.d,templates}
```
### 配置文件
`confd`的配置文件，主要包含配置的生成逻辑，例如模板源，后端存储对应的keys，命令执行等。
```shell
[root@localhost ~]# cat /etc/confd/conf.d/wtv.conf.toml
[template]
src = "wtv.conf.tmpl"
dest = "/data/scripts/wtv.yml"
keys = [
    "/wtv/monitor",
]
reload_cmd = "/data/wtv/wtvsync"
```

### 配置模版
配置模板Template，即基于不同组件的配置，修改为符合Golang text templates的模板文件（toml格式）。
```shell
[root@localhost ~]# cat /etc/confd/templates/wtv.conf.tmpl
template
{{ range getvs "/wtv/monitor/templates/*" }}
    - {{.}}
{{ end }}
ignore-uuid
{{ range getvs "/wtv/monitor/ignore-uuid/*" }}
    - {{.}}
{{ end }}
```

### 运行
基于`etcd`作为本次后端存储，`etcd`请参考`https://plsof.github.io/blog/note/db/etcd/`
```shell
[root@localhost ~]# confd -watch -backend etcdv3 -node http://127.0.0.1:2379 &
```

### 查看结果
```shell
[root@localhost ~]# cat /data/scripts/wtv.yml
template

    - 0281

    - 0282

    - 0283

    - 0284

ignore-uuid

    - cctv-1

    - cctv-2

    - cctv-3

    - cctv-4
```