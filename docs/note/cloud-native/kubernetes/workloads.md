---
title: 工作负载
---

## Pods

### 概述

`Pod`是`Kubernetes`中最基本的调度单元

**Pod示意图**

<img src="./images/pod.png" alt="Pod" />

`Pod`在`Kubernetes`中有两种使用方式

- Pods that run a single container:
  
  `Pod`中只运行一个容器

- Pods that run multiple containers that need to work together:

  `Pod`中运行多个容器，容器间共享资源

#### 网络
每个`Pod`有一个特有的IP地址，`Pod`中的各`Container`共享网络资源，`Container`之间通过localhost进行通信

#### 存储
`Pod`可以指定一个Volumes作为共享存储，`Pod`的`Containers`共享这个Volume

### 模版
Pod模版是Pod的规格说明，控制器使用Pod模版创建实际的Pod
```json
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```

### 生命周期

**生命周期示意图**

<img src="./images/podLife.jpg" alt="PodLife" style="zoom:50%;" />

#### 状态

`Pod`的状态定义在`PodStatus`对象中，其中有一个`phase`字段，查看`Pod`的状态值`kubectl explain pod.status`

下面是`phase`可能的值：
- Pending（挂起）：`Pod`已被`Kubernetes`系统接受，但有一个或者多个容器镜像尚未创建。等待时间包括调度Pod的时间和通过网络下载镜像的时间，这可能需要花点时间。
- Running（运行中）：该`Pod`已经绑定到了一个节点上，`Pod`中所有的容器都已被创建。至少有一个容器正在运行，或者正处于启动或重启状态。
- Succeeded（成功）：`Pod`中的所有容器都被成功终止，并且不会再重启。
- Failed（失败）：`Pod`中的所有容器都已终止了，并且至少有一个容器是因为失败终止。也就是说，容器以非0状态退出或者被系统终止。
- Unknown（未知）：因为某些原因无法取得`Pod`的状态，通常是因为与`Pod`所在主机通信失败。

除此之外，`PodStatus`对象中还包含一个`PodCondition`数组。 `PodCondition`数组的每个元素都有一个type字段和一个status字段。type字段是字符串，可能的值有PodScheduled、Ready、Initialized、Unschedulable、ContainersReady。status字段是一个字符串，可能的值有 True、False、Unknown。

#### 重启策略

`restartPolicy`字段设置`Pod`中所有容器的重启策略
- Always (默认)
- OnFailure
- Never

#### 初始化容器

`Init Container`就是用来做初始化工作的容器，可以是一个或者多个，如果有多个的话，这些容器会按定义的顺序依次执行。从上面的`Pod`生命周期图中可以看出初始化容器是独立于主容器之外的，只有所有的初始化容器执行完之后，主容器才会被启动。

`init-demo.yaml`
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-demo
spec:
  volumes:
  - name: workdir
    emptyDir: {}
  initContainers:
  - name: install
    image: busybox
    command: ["/bin/sh"]
    args: ["-c", "echo hello pdd > /tmp/index.html"]
    volumeMounts:
    - name: workdir
      mountPath: "/tmp"
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: workdir
      mountPath: /usr/share/nginx/html
```

#### HooK

`Kubernetes`为容器提供了生命周期的钩子，也就是`Pod Hook`，`Pod Hook`是由`Kubelet`发起的，在容器中的进程启动前或者容器中的进程终止之前运行，包含在容器的生命周期之中。我们可以同时为`Pod`中的所有容器都配置`Hook`。

钩子函数：

- `PostStart`: 这个钩子在容器创建后立即执行。但是并不能保证钩子将在容器`ENTRYPOINT`之前运行，因为没有参数传递给处理程序。主要用于资源部署、环境准备等。不过需要注意的是如果钩子花费太长时间以至于不能运行或者挂起，容器将不能达到`running`状态。

- `PreStop`: 这个钩子在容器终止之前立即被调用。它是阻塞的，意味着它是同步的，所以它必须在删除容器的调用发出之前完成。主要用于优雅关闭应用程序、通知其他系统等。如果钩子在执行期间挂起，`Pod`阶段将停留在`running`状态并且永不会达到`failed`状态。

如果`PostStart`或者`PreStop`钩子失败，它会杀死容器。所以我们应该让钩子函数尽可能的轻量。当然有些情况下，长时间运行命令是合理的，比如在停止容器之前预先保存状态。

- `EXEC`: 用于执行一段特定的命令，不过要注意的是该命令消耗的资源会被计入容器。
- `HTTP`: 对容器上的特定的端点执行 HTTP 请求。

`pod-poststart.yaml`
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hook-demo1
spec:
  containers:
  - name: hook-demo1
    image: nginx
    lifecycle:
      postStart:
        exec:
          command: ["/bin/sh", "-c", "echo Hello from the postStart handler > /usr/share/nginx/html/index.html"]
```

`pod-prestop.yaml`
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hook-demo2
spec:
  volumes:
  - name: message
    hostPath:
      path: /tmp
  containers:
  - name: hook-demo2
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: message
      mountPath: /usr/share/
    lifecycle:
      preStop:
        exec:
          command: ['/bin/sh', '-c', 'echo Hello from the preStop Handler > /usr/share/message']
```

#### 监控检查

`kubelet`可以选择性在运行的容器上执行以下三种探针：
- `livenessProbe`：指示容器是否正在运行。如果存活探测失败，则`kubelet`会杀死容器，并且容器将受到其重启策略的影响。如果容器不提供存活探针，则默认状态为`Success`。
- `readinessProbe`：指示容器是否准备好服务请求。如果就绪探测失败，端点控制器将从与`Pod`匹配的所有`Service`的端点中删除该`Pod`的IP地址。初始延迟之前的就绪状态默认为`Failure`。如果容器不提供就绪探针，则默认状态为`Success`。
- `startupProbe`：指示容器中的应用程序是否启动，在`startupProbe`探针执行成功之前，其它的探针都会失效。如果存活探测失败，则`kubelet`会杀死容器，并且容器将受到其重启策略的影响。如果容器不提供存活探针，则默认状态为`Success`。

探针支持下面几种配置方式:
- `ExecAction`：在容器内执行指定命令。如果命令退出时返回码为0则认为诊断成功。
- `TCPSocketAction`：对指定容器（IP:Port）进行TCP检查。如果端口打开，则诊断被认为是成功的。
- `HTTPGetAction`：对指定容器（http://ip:port/path）执行HTTP Get请求。如果响应的状态码大于等于200且小于400，则诊断被认为是成功的。

每次探测都将获得以下三种结果之一：
- 成功：容器通过了诊断。
- 失败：容器未通过诊断。
- 未知：诊断失败，因此不会采取任何行动。

## 控制器

### ReplicaSet
ReplicaSet在ReplicationController的基础上增加支持集合式selector

### ReplicationController
ReplicationController用来确保容器应用的副本数始终保持在用户定义的副本数，
即如果有容器异常退出，会自动创建新的Pod来替代，而如果异常多出来的容器也会自动回收。

### Deployments
Deployment控制器为Pods和ReplicaSets提供声明式的更新

#### 创建Deployment
- 命令行创建
  ```shell
  kubectl run myhttp-deployment --image=172.188.3.24:8000/library/myhttp:v1 --replicas=2
  ```

- YAML方式创建
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myhttp-deployment
    labels:
      app: myhttp
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: myhttp
    template:
      metadata:
        labels:
          app: myhttp
      spec:
        containers:
        - name: myhttp
          image: 172.188.3.24:8000/library/myhttp:v1
          ports:
          - containerPort: 8080
  ```
  创建deployment
  `kubectl apply -f ./myhttp.yaml`

查看Deplyment状态
```shell
[root@localhost ~]# kubectl get deployments
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
myhttp-deployment      2/2     2            2           6h31m
myhttp-v2-deployment   2/2     2            2           174m
```

查看Deplyment描述

`kubectl describe pod myhttp-deployment-c6b88c56b-bzfpc`

#### Deployment更新
- 命令行更新
  ```shell
  kubectl set image deployment/myhttp-deployment myhttp=172.188.3.24:8000/library/myhttp:v2 --record
  ```
  返回输出
  ```shell
  deployment.apps/myhttp-deployment image updated
  ```
- 编辑Deployment
  ```shell
  kubectl edit deployment myhttp-deployment
  ```
  返回输出
  ```shell
  deployment.apps/myhttp-deployment edited
  ```
查看Deplyment细节
```shell
kubectl describe deployment myhttp
```

#### Deployment回退
查看更新历史
```shell
kubectl rollout history deployment myhttp-deployment
```

回退到指定版本
```shell
kubectl rollout undo deployment myhttp-deployment --revision=2
```
**未指定回退版本则默认回退到上一个版本**

#### Deployment伸缩
- 手动伸缩
  ```shell
  [root@localhost ~]# kubectl scale deployment myhttp-deployment --replicas=4
  deployment.apps/myhttp-deployment scaled
  ```
- 自动伸缩
  ```shell
  kubectl autoscale deployment myhttp-deployment --min=10 --max=15 --cpu-percent=80
  ```

### StatefulSets
StatefulSet是为了解决有状态服务的问题（Deployments ReplicaSets无状态）

1. 稳定的持久化存储，即Pod重新调度后还能访问到相同的持久化数据，基于PVC实现

2. 稳定的网络标志，即Pod重新调度后其PodName和HostName不变，基于Headess
Service实现（没有Cluster IP的Service）

3. 有序部署，有序扩展，即Pod是有顺序的，在部署或扩展的时候要依据定义的顺序依
进行（从0到N-1，在下一个Pod运行之前，所有前面的Pod必须都是Running和Ready状态）基于
init container实现

4. 有序收缩，有序删除

### DaemonSet
DaemonSet确保全部（除了污点）Node上运行一个Pod的副本。当有Node加入集群时，
也会为他们新增一个Pod。当有Node从集群移除时，这些Pod也会被回收。删除Daemonset将会
删除它创建的所有Pod

使用DaemonSet的一些典型用法：

1. 运行存储集群daemon, 例如在每个Node上运行glusterd、ceph

2. 在每个Node上面运行日志收集daemon, 例如fluentd、logstash

3. 在每个Node上面运行监控daemon, 例如Prometheus Node Exporter

### Jobs

Job负责批处理任务，即仅执行一次的任务，它保证批处理任务的一个或多个Pod成功结束

### CronJob

Cronjob管理基于时间的Job