---
title: 存储
---

## Volumes

### 概述

`查看pods支持的存储`

```shell
[root@master ~]# kubectl explain pod.spec.volumes
```

### emptyDir

当Pod指定到某个节点上时，首先创建的是一个`emptyDir`卷，并且只要Pod在该节点上运行，卷就一直存在。就像它的名称表示的那样，卷最初是空的。尽管Pod中的容器挂载`emptyDir`卷的路径可能相同也可能不同，但是这些容器都可以读写`emptyDir`卷中相同的文件。当Pod因为某些原因被从节点上删除时，`emptyDir`卷中的数据也会永久删除

`kubectl explain pod.spec.volumes.emptyDir`

案例：

`volume-emptydir.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-volume
spec:
  containers:
  - name: nginx
    image: nginx:latest
    volumeMounts:
    - mountPath: /usr/share/nginx/html
      name: html
  - name: busybox
    image: busybox:latest
    volumeMounts:
      - mountPath: /data/
        name: html
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo $(date) >> /data/index.html; sleep 2; done"]
  volumes:
  - name: html
    emptyDir: {}
```

```shell
[root@master volume]# kubectl get pods -o wide
NAME                                 READY   STATUS    RESTARTS   AGE    IP            NODE    NOMINATED NODE   READINESS GATES
test-volume                          2/2     Running   0          7m7s   10.244.1.13   node1   <none>           <none>
[root@master volume]# curl '10.244.1.13'
Fri Feb 21 14:53:03 UTC 2020
Fri Feb 21 14:53:05 UTC 2020
Fri Feb 21 14:53:07 UTC 2020
Fri Feb 21 14:53:09 UTC 2020
```

### hostPath

`hostPath`卷能将主机节点文件系统上的文件或目录挂载到Pod中

`kubectl explain pod.spec.volumes.hostPath`

案例：

`volume-hostpath.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-volume
spec:
  containers:
  - name: nginx
    image: nginx:latest
    volumeMounts:
    - mountPath: /usr/share/nginx/html
      name: html
  volumes:
  - name: html
    hostPath:
      path: /data/pod/volume1
      type: DirectoryOrCreate
```

`验证、测试`

```shell
[root@master volume]# kubectl get pod -o wide
NAME                                 READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
test-volume                          1/1     Running   0          6m55s   10.244.1.25   node1   <none>           <none>
```

node1

`/data/pod/volume1/index.html`

```html
<html>
<p>hello pdd</p>
</html>
```

```shell
[root@master volume]# curl '10.244.1.25'
<html>
<p>hello pdd</p>
</html>
```

### NFS

`nfs`卷能将NFS（网络文件系统）挂载到Pod中

`kubectl explain pod.spec.volumes.nfs`

案例：

172.188.3.24 nfs-server

`/data/volumes 172.188.2.0/24(rw,no_root_squash)`

`/data/volumes/index.html`

```html
<html>
<p>nfs volume</p>
</html>
```

`volume-nfs.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-volume
spec:
  containers:
  - name: nginx
    image: nginx:latest
    volumeMounts:
    - mountPath: /usr/share/nginx/html
      name: html
  volumes:
  - name: html
    nfs:
      path: /data/volumes
      server: 172.188.3.24
```

`验证、测试`

```shell
[root@master volume]# kubectl get pods -o wide
NAME                                 READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
test-volume                          1/1     Running   0          8m35s   10.244.2.17   node2   <none>           <none>
[root@master volume]# curl '10.244.2.17'
<html>
<p>nfs volume</p>
</html>
```

## PV

PersistentVolume (PV)是集群中的一块存储，由管理员创建或者由StorageClass动态创建，它是集群中的资源，就像节点是集群资源一样。PV类似Volumes的卷插件，但是生命周期独立于使用该PV的Pod

PersistentVolumeClaim (PVC)是用户的存储请求，它类似Pod。Pod消耗节点资源，PVC消耗PV资源。Pod请求特定的资源（CPU，Memory），PVC请求指定的存储容量和访问模式

案例：

配置nfs服务

`建立存储卷目录`

```shell
[root@172-188-3-24 ~]# cd /data/volumes/
[root@172-188-3-24 volumes]# mkdir v{1,2,3,4,5}
[root@172-188-3-24 volumes]# echo "<h1>NFS stor 01</h1>" > v1/index.html
[root@172-188-3-24 volumes]# echo "<h1>NFS stor 02</h1>" > v2/index.html
[root@172-188-3-24 volumes]# echo "<h1>NFS stor 03</h1>" > v3/index.html
[root@172-188-3-24 volumes]# echo "<h1>NFS stor 04</h1>" > v4/index.html
[root@172-188-3-24 volumes]# echo "<h1>NFS stor 05</h1>" > v5/index.html
```

`修改nfs配置`

```shell
[root@172-188-3-24 volumes]# vim /etc/exports
/data/volumes/v1 172.188.2.0/24(rw,no_root_squash)
/data/volumes/v2 172.188.2.0/24(rw,no_root_squash)
/data/volumes/v3 172.188.2.0/24(rw,no_root_squash)
/data/volumes/v4 172.188.2.0/24(rw,no_root_squash)
/data/volumes/v5 172.188.2.0/24(rw,no_root_squash)
```

`重启服务`

```shell
[root@172-188-3-24 volumes]# systemctl restart nfs
[root@172-188-3-24 volumes]# showmount -e
Export list for 172-188-3-24:
/data/volumes/v5 172.188.2.0/24
/data/volumes/v4 172.188.2.0/24
/data/volumes/v3 172.188.2.0/24
/data/volumes/v2 172.188.2.0/24
/data/volumes/v1 172.188.2.0/24
```

创建PV

`pv-demo.yaml`

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv001
  labels:
    name: pv001
spec:
  nfs:
    path: /data/volumes/v1
    server: 172.188.3.24
  accessModes: ["ReadWriteMany","ReadWriteOnce"]
  capacity:
    storage: 2Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv002
  labels:
    name: pv002
spec:
  nfs:
    path: /data/volumes/v2
    server: 172.188.3.24
  accessModes: ["ReadWriteOnce"]
  capacity:
    storage: 5Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv003
  labels:
    name: pv003
spec:
  nfs:
    path: /data/volumes/v3
    server: 172.188.3.24
  accessModes: ["ReadWriteMany","ReadWriteOnce"]
  capacity:
    storage: 20Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv004
  labels:
    name: pv004
spec:
  nfs:
    path: /data/volumes/v4
    server: 172.188.3.24
  accessModes: ["ReadWriteMany","ReadWriteOnce"]
  capacity:
    storage: 10Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv005
  labels:
    name: pv005
spec:
  nfs:
    path: /data/volumes/v5
    server: 172.188.3.24
  accessModes: ["ReadWriteMany","ReadWriteOnce"]
  capacity:
    storage: 15Gi
```

```shell
[root@master volume]# kubectl apply -f pv-demo.yaml
persistentvolume/pv001 created
persistentvolume/pv002 created
persistentvolume/pv003 created
persistentvolume/pv004 created
persistentvolume/pv005 created
[root@master volume]# kubectl get pv
NAME    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv001   2Gi        RWO,RWX        Retain           Available                                   1s
pv002   5Gi        RWO            Retain           Available                                   1s
pv003   20Gi       RWO,RWX        Retain           Available                                   1s
pv004   10Gi       RWO,RWX        Retain           Available                                   1s
pv005   15Gi       RWO,RWX        Retain           Available                                   1s
```

创建PVC和挂在PVC的Pod

`pvc-demo.yaml`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mypvc
  namespace: default
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 6Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: vol-pvc
  namespace: default
spec:
  volumes:
  - name: html
    persistentVolumeClaim:
      claimName: mypvc
  containers:
  - name: pvc-test
    image: nginx
    volumeMounts:
    - name: html
      mountPath: /usr/share/nginx/html/
```

`验证、测试`

```shell
[root@master volume]# kubectl get pvc
NAME    STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mypvc   Bound    pv005    15Gi       RWO,RWX                       4m4s
[root@master volume]# kubectl get pod -o wide
NAME                                 READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
vol-pvc                              1/1     Running   0          4m33s   10.244.1.26   node1   <none>           <none>
[root@master volume]# curl '10.244.1.26'
<h1>NFS stor 05</h1>
```

## StorageClass

动态创建PV

案例：

**kubernetes本身支持的动态PV创建不包括nfs，所以需要使用额外插件实现**

插件地址：`https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client`

`Kubernetes NFS-Client Provisioner`

```shell
[root@master volume]# helm install stable/nfs-client-provisioner --set nfs.server=172.188.3.24 --set nfs.path=/data/volumes --set storageClass.name=managed-nfs-storage
[root@master volume]# kubectl get pod
NAME                                                     READY   STATUS    RESTARTS   AGE
wistful-abalone-nfs-client-provisioner-66db557c9-42jn5   1/1     Running   0          22m
[root@master volume]# kubectl get sc
NAME                  PROVISIONER                                            AGE
managed-nfs-storage   cluster.local/wistful-abalone-nfs-client-provisioner   22m
```

`创建PVC`

`pvc-nfs.yaml`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mypvc
spec:
  storageClassName: managed-nfs-storage
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 500Mi
```

`验证、测试`

```shell
[root@master volume]# kubectl get pvc
NAME    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
mypvc   Bound    pvc-27efbcae-6304-49d9-b958-154823496214   500Mi      RWX            managed-nfs-storage   21m
[root@master volume]# kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM           STORAGECLASS          REASON   AGE
pvc-27efbcae-6304-49d9-b958-154823496214   500Mi      RWX            Delete           Bound    default/mypvc   managed-nfs-storage            21m
```

`NFS服务器`

```shell
[root@172-188-3-24 ~]# ll /data/volumes/
total 0
drwxrwxrwx 2 root root 10 Feb 23 15:23 default-mypvc-pvc-27efbcae-6304-49d9-b958-154823496214
```

参考：`https://www.cnblogs.com/rexcheny/p/10925464.html`

## configMap

### 创建

`命令行参数创建`

```shell
[root@master ~]# kubectl create configmap nginx-config --from-literal=nginx_port=80 --from-literal=server_name=www.tabops.com
configmap/nginx-config created
```

```shell
[root@master ~]# kubectl describe configmap nginx-config
Name:         nginx-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
nginx_port:
----
80
server_name:
----
www.tabops.com
Events:  <none>
```

`指定文件创建`

```shell
[root@master volume]# kubectl create configmap nginx-www --from-file=./www.conf
configmap/nginx-www created
```

```shell
[root@master volume]# kubectl describe configmap nginx-www
Name:         nginx-www
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
www.conf:
----
server {
  server_name www.tabops.com;
  listen 80;
  root /usr/share/html;
}

Events:  <none>
```

### 挂载

`pod-configmap.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-cm
  namespace: default
spec:
  containers:
  - name: myapp
    image: nginx:1.15
    ports:
    - name: http
      containerPort: 80
    volumeMounts:
    - name: nginxconf
      mountPath: /etc/nginx/conf.d/
      readOnly: true
  volumes:
  - name: nginxconf
    configMap:
      name: nginx-www
```

`验证`

```shell
[root@master volume]# kubectl exec -it pod-cm cat /etc/nginx/conf.d/www.conf
server {
	server_name www.tabops.com;
	listen 80;
	root /usr/share/html;
}
```

## secret

### 创建

```shell
[root@master ~]# kubectl create secret generic mysql-root-passwd --from-literal=password=mysql@pdd
secret/mysql-root-passwd created
```

```shell
[root@master ~]# kubectl describe secret mysql-root-passwd
Name:         mysql-root-passwd
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  9 bytes
```