## grains
### minion系统grains

#### 查看minion的所有grains

```shell
salt SCYD-192.168.1.10 grains.items
```

#### 查看grains的某个键值（以ipv4这个key为例）

```shell
salt SCYD-192.168.1.10 grains.get ipv4
```

#### 删除grains的某个key的值 # value会变成None

```shell
salt SCYD-10.25.172.207 grains.delval ipv4
```



### 自定义grains(minion端)

1. 配置

   ```shell
   salt SCYD-192.168.1.10 grains.append roles 'ppl-flume_recommend'
   ```

   如果对这个key append另一个值，value则会追加不会覆盖

   这个命令会在客户端生成个文件 /etc/salt/grains

   ```shell
   [root@localhost ~]# cat /etc/salt/grains
   roles:
   - ppl-flume_recommend
   ```

2. 生效

   (1) 重启minion

   ```shell
   /etc/init.d/salt-minion restart
   ```

   (2) 强制刷新

   ```shell
   salt SCYD-192.168.1.10 saltutil.sync_grains
   ```

   