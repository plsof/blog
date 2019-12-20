---
title: etcd
---

## 概述
`etcd`是一个分布式的键值存储

## 安装

### docker版
```shell
[root@localhost ~]# docker run -d -p 2379:2379 --name etcd -v /data/data/default.etcd:/default.etcd \ 
quay.io/coreos/etcd:v3.4.0 /usr/local/bin/etcd -advertise-client-urls http://0.0.0.0:2379 \ 
-listen-client-urls http://0.0.0.0:2379
```

## etcdctl

### put
```shell
etcdctl put /wtv/monitor/templates/1 0281
etcdctl put /wtv/monitor/templates/2 0282
etcdctl put /wtv/monitor/ignore-uuid/1 "cctv-1"
etcdctl put /wtv/monitor/ignore-uuid/2 "cctv-2"
```
### get
```shell
etcdctl get /wtv/monitor/templates/1
```
### del
```shell
etcdctl del /wtv/monitor/templates/1
```

## HTTP
版本小于等于v3.2 `[CLIENT-URL]/v3alpha/*`

v3.3 `[CLIENT-URL]/v3beta/*`

版本大于等于v3.4 `[CLIENT-URL]/v3/*`

### put and get
*key value必须Base64加密*
```json
<<COMMENT
https://www.base64encode.org/
foo is 'Zm9v' in Base64
bar is 'YmFy'
COMMENT

curl -L http://localhost:2379/v3/kv/put \
  -X POST -d '{"key": "Zm9v", "value": "YmFy"}'
# {"header":{"cluster_id":"12585971608760269493","member_id":"13847567121247652255","revision":"2","raft_term":"3"}}

curl -L http://localhost:2379/v3/kv/range \
  -X POST -d '{"key": "Zm9v"}'
# {"header":{"cluster_id":"12585971608760269493","member_id":"13847567121247652255","revision":"2","raft_term":"3"},"kvs":[{"key":"Zm9v","create_revision":"2","mod_revision":"2","version":"1","value":"YmFy"}],"count":"1"}

# get all keys prefixed with "foo"
curl -L http://localhost:2379/v3/kv/range \
  -X POST -d '{"key": "Zm9v", "range_end": "Zm9w"}'
# {"header":{"cluster_id":"12585971608760269493","member_id":"13847567121247652255","revision":"2","raft_term":"3"},"kvs":[{"key":"Zm9v","create_revision":"2","mod_revision":"2","version":"1","value":"YmFy"}],"count":"1"}
```

#### 参考
`https://github.com/etcd-io/etcd/blob/master/Documentation/dev-guide/api_grpc_gateway.md`