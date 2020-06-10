---
title: SaltStack
---

## grains

### 系统grains

#### 查看minion的所有grains

```shell
salt SCYD-192.168.1.10 grains.items
```

#### 查看grains的某个键值（以ipv4这个key为例）

```shell
salt SCYD-192.168.1.10 grains.get ipv4
```

#### 删除grains的某个key的值（value会变成None）

```shell
salt SCYD-10.25.172.207 grains.delval ipv4
```

### 自定义grains

1. 通过grains模块定义grains

```shell
salt SCYD-192.168.1.10 grains.append roles 'ppl-flume_recommend'
```

如果对这个key append另一个值，value则会追加不会覆盖

```shell
salt SCYD-192.168.1.10 grains.set roles 'ppl-flume_recommend' force=True
```

强制覆盖roles

上面命令会在客户端生成个文件 /etc/salt/grains

```shell
[root@localhost ~]# cat /etc/salt/grains
roles:
- ppl-flume_recommend
```

生效

(1) 重启minion

```shell
/etc/init.d/salt-minion restart
```

(2) 强制刷新

```shell
salt SCYD-192.168.1.10 saltutil.sync_grains
```

2. 使用自定义python脚本获取grains信息（默认自定义脚本需要存放在master的/srv/salt/_grains目录下）

示例：获取网卡速率
```python
#!/usr/bin/env python
# coding=utf-8

from os import popen
def get_speed():
    grains = {}
    grains['speed'] = popen('ip addr | egrep "10.25.172|10.25.171" | awk \'{print $NF}\' | xargs ethtool | grep Speed | awk \'{print $NF}\' ').read().strip()
    return grains
```

使用sync_grains命令同步脚本到minion主机上去，并通过grains.item命令获取相关信息即可，如下：

```shell
[root@saltmaster]# salt '*' saltutil.sync_grains

[root@saltmaster]# salt '*' grains.item speed
```

执行同步命令后，自定义脚本会上传到minion的/var/cache/salt/minion/extmods/grains目录下


## rest_cherrypy

```shell
curl -k https://127.0.0.1:1559 \
-H "Accept: application/json" \
-H "X-Auth-Token: a8c0a529b0eb37dee40f0db1287575ddf4dc24b7" \
-d client='local_async' \
-d tgt='SCYD-*' \
-d fun='grains.items'


curl -k https://127.0.0.1:1559 \
-H "Accept: application/json" \
-H "X-Auth-Token: a8c0a529b0eb37dee40f0db1287575ddf4dc24b7" \
-d client='runner' \
-d jid='20200516155008231927' \
-d fun='jobs.lookup_jid'


curl -k https://127.0.0.1:1559 \
-H "Accept: application/json" \
-H "X-Auth-Token: 0c4bfe286c7b1a3e96c2e9ea50c9b8cc9aab1a18" \
-d client='local' \
-d tgt='SCYD-10.25.172.1' \
-d fun='grains.set' \
-d arg='roles: grainsTest' \
-d force=True


curl -k https://10.25.172.67:1559 -H "Accept: application/json" -H "X-Auth-Token: 3463d339d29e67e6b70f18d3774a9696a72e2f99" -d client='local' -d tgt='SCYD-10.25.172.1' -d fun='grains.set' -d arg='roles' -d arg='myapp2' -d arg='force' -d arg='True'

{"client": "local", "tgt": "SCYD-10.25.172.1", "fun":"grains.set", "arg": ["roles", "myapp3", "force=True"]}
```
   