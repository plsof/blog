---
title: 工作负载
---

## Pods

### Pod Overview
Pod是k8s应用程序中最基本的执行单元

Pod在k8s中有两种使用方式
- Pods that run a single container: Pod中只运行一个容器
- Pods that run multiple containers that need to work together: Pod中运行多个容器，容器间共享资源

#### Networking
每个Pod有一个特有的IP地址，Pod中的各container共享网络资源，container之间通过localhost进行通信

#### Storage
Pod可以指定一个Volumes作为共享存储，Pod的containers共享这个Volume

### Working with Pods
Controllers可以创建和管理多个Pod，

### Pod Templates
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

### Pod Lifecycle

#### Pod phase
Pod的status定义在PodStatus对象中，其中有一个phase字段。

Pod的运行阶段（phase）是Pod在其生命周期中的简单宏观概述。该阶段并不是对容器或Pod的综合汇总，也不是为了做为综合状态机。

Pod相位的数量和含义是严格指定的。除了本文档中列举的内容外，不应该再假定Pod有其他的phase值。

下面是 phase 可能的值：
- Pending（挂起）：Pod已被Kubernetes系统接受，但有一个或者多个容器镜像尚未创建。等待时间包括调度Pod的时间和通过网络下载镜像的时间，这可能需要花点时间。
- Running（运行中）：该Pod已经绑定到了一个节点上，Pod中所有的容器都已被创建。至少有一个容器正在运行，或者正处于启动或重启状态。
- Succeeded（成功）：Pod中的所有容器都被成功终止，并且不会再重启。
- Failed（失败）：Pod中的所有容器都已终止了，并且至少有一个容器是因为失败终止。也就是说，容器以非0状态退出或者被系统终止。
- Unknown（未知）：因为某些原因无法取得Pod的状态，通常是因为与Pod所在主机通信失败。

#### Pod conditions
Pod有一个PodStatus对象，其中包含一个PodCondition数组。 PodCondition数组的每个元素都有一个type字段和一个status字段。type字段是字符串，可能的值有PodScheduled、Ready、Initialized、Unschedulable、ContainersReady。status字段是一个字符串，可能的值有 True、False、Unknown。

#### Container probes
探针是由kubelet对容器执行的定期诊断。要执行诊断，kubelet调用由容器实现的Handler。有三种类型的处理程序:
- ExecAction：在容器内执行指定命令。如果命令退出时返回码为 0 则认为诊断成功。
- TCPSocketAction：对指定容器（IP:Port）进行TCP检查。如果端口打开，则诊断被认为是成功的。
- HTTPGetAction：对指定容器（http://ip:port/path）执行HTTP Get请求。如果响应的状态码大于等于200且小于400，则诊断被认为是成功的。

每次探测都将获得以下三种结果之一：
- 成功：容器通过了诊断。
- 失败：容器未通过诊断。
- 未知：诊断失败，因此不会采取任何行动。

kubelet可以选择性在运行的容器上执行以下三种探针：
- livenessProbe：指示容器是否正在运行。如果存活探测失败，则kubelet会杀死容器，并且容器将受到其重启策略的影响。如果容器不提供存活探针，则默认状态为Success。
- readinessProbe：指示容器是否准备好服务请求。如果就绪探测失败，端点控制器将从与Pod匹配的所有Service的端点中删除该Pod的IP地址。初始延迟之前的就绪状态默认为Failure。如果容器不提供就绪探针，则默认状态为Success。
- startupProbe：指示容器中的应用程序是否启动，在startupProbe探针执行成功之前，其它的探针都会失效。如果存活探测失败，则kubelet会杀死容器，并且容器将受到其重启策略的影响。如果容器不提供存活探针，则默认状态为Success。

#### Pod and Container status

#### Container States
- Waiting
- Running
- Terminated

#### Pod readiness gate

#### Restart policy
- Always (default)
- OnFailure
- Never

#### Pod lifetime
一般来说，Pod不会消失，直到人为销毁他们。这可能是一个人或控制器。这个规则的唯一例外是成功或失败的phase超过一段时间（由master确定）的Pod将过期并被自动销毁。

postStart
preStop

有三种可用的控制器：
- 使用Job运行预期会终止的Pod，例如批量计算。Job仅适用于重启策略为OnFailure或Never的Pod。
- 对预期不会终止的Pod使用ReplicationController、ReplicaSet和Deployment，例如Web服务器。ReplicationController仅适用于具有 restartPolicy为Always的Pod。
- 提供特定于机器的系统服务，使用DaemonSet为每台机器运行一个Pod。

所有这三种类型的控制器都包含一个PodTemplate。建议创建适当的控制器，让它们来创建Pod，而不是直接自己创建Pod。这是因为单独的Pod在机器故障的情况下没有办法自动复原，而控制器却可以。

如果节点死亡或与集群的其余部分断开连接，则 Kubernetes 将应用一个策略将丢失节点上的所有 Pod 的 phase 设置为 Failed。

### Init Containers

### Pod Preset

## Controllers

### ReplicaSet
ReplicaSet在ReplicationController的基础上增加支持集合式selector

### ReplicationController
ReplicationController用来确保容器应用的副本数始终保持在用户定义的副本数，
即如果有容器异常退出，会自动创建新的Pod来替代，而如果异常多出来的容器也会自动回收。

### Deployments
Deployment在前面的基础上支持rolling-update（更新回滚）

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