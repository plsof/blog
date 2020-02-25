---
title: 安装
---

## 准备

### 系统配置

环境
Kubernetes版本：`1.15.7`
```shell
# CentOS7
172.188.2.71 # master
172.188.2.86 # node1
172.188.2.87 # node2
```

关闭防火墙
```shell
systemctl stop firewalld
systemctl disable firewalld
```

禁用SELINUX
```shell
vi /etc/selinux/config
SELINUX=disabled
```

优化内核参数
`/etc/sysctl.d/k8s.conf`

```shell
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
```

```shell
modprobe br_netfilter
sysctl -p /etc/sysctl.d/k8s.conf
```

kube-proxy开启ipvs的前置条件

`由于ipvs已经加入到了内核，所以为kube-proxy开启ipvs的前提需要加载以下的内核模块`
```shell
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack_ipv4
```
在所有机器上执行以下脚本
```shell
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

上面脚本创建了的/etc/sysconfig/modules/ipvs.modules文件，保证在节点重启后能自动加载所需模块。 使用lsmod | grep -e ip_vs -e nf_conntrack_ipv4命令查看是否已经正确加载所需的内核模块。

接下来还需要确保各个节点上已经安装了ipset软件包yum install ipset。 为了便于查看ipvs的代理规则，最好安装一下管理工具ipvsadm yum install ipvsadm。

如果以上前提条件如果不满足，则即使kube-proxy的配置开启了ipvs模式，也会退回到iptables模式。

### 安装Docker

安装docker的yum源
```shell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

查看最新的Docker版本
```shell
yum list docker-ce.x86_64  --showduplicates |sort -r
docker-ce.x86_64            3:19.03.5-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.4-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.3-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.2-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.1-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.0-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.9-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.8-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.7-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.7-3.el7                    @docker-ce-stable
docker-ce.x86_64            3:18.09.6-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.5-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.4-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.3-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.2-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.1-3.el7                    docker-ce-stable
docker-ce.x86_64            3:18.09.0-3.el7                    docker-ce-stable
docker-ce.x86_64            18.06.3.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.06.2.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.06.1.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.06.0.ce-3.el7                   docker-ce-stable
...
```

Kubernetes 1.15当前支持的docker版本列表是1.13.1, 17.03, 17.06, 17.09, 18.06, 18.09。这里在各节点安装docker的18.09.7版本
```shell
yum makecache fast

yum install -y --setopt=obsoletes=0 docker-ce-18.09.7-3.el7 

systemctl start docker
systemctl enable docker
```

确认一下iptables filter表中FOWARD链的默认策略(pllicy)为ACCEPT
```shell
[root@master ~]# iptables -L -n -v
Chain INPUT (policy ACCEPT 1928 packets, 317K bytes)
 pkts bytes target     prot opt in     out     source               destination
30616 1597K KUBE-SERVICES  all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate NEW /* kubernetes service portals */
30616 1597K KUBE-EXTERNAL-SERVICES  all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate NEW /* kubernetes externally-visible service portals */
1249K  222M KUBE-FIREWALL  all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
 3816  175K KUBE-FORWARD  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* kubernetes forwarding rules */
 3812  174K KUBE-SERVICES  all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate NEW /* kubernetes service portals */
 3812  174K DOCKER-USER  all  --  *      *       0.0.0.0/0            0.0.0.0/0
```

修改docker cgroup driver为systemd

根据文档CRI installation中的内容，对于使用systemd作为init system的Linux的发行版，使用systemd作为docker的cgroup driver可以确保服务器节点在资源紧张的情况更加稳定，因此这里修改各个节点上docker的cgroup driver为systemd。

创建或修改`/etc/docker/daemon.json`
```shell
{
  "exec-opts": ["native.cgroupdriver=systemd"]
}
```

```shell
systemctl restart docker

docker info | grep Cgroup
Cgroup Driver: systemd
```

### 关闭Swap
Kubernetes 1.8开始要求关闭系统的Swap，如果不关闭，默认配置下kubelet将无法启动。关闭系统的Swap方法如下
```shell
swapoff -a
```
修改 /etc/fstab 文件，注释掉 SWAP 的自动挂载，使用free -m确认swap已经关闭。 swappiness参数调整，修改/etc/sysctl.d/k8s.conf添加下面一行
```shell
vm.swappiness=0
```

执行`sysctl -p /etc/sysctl.d/k8s.conf`使修改生效。

## 使用kubeadm部署k8s

### 安装kubeadm

安装yum源
```shell
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

安装kubelet kubeadm kubectl
```shell
yum install -y kubelet-1.15.7 kubeadm-1.15.7 kubectl-1.15.7
```

各节点开机启动kubelet服务
```shell
systemctl enable kubelet.service
```

### 初始化Master

生成master初始化文件
```shell
kubeadm config print init-defaults > kubeadm-init.yaml
```

该文件有三处需要修改
1. 将`advertiseAddress: 1.2.3.4`修改为本机地址
2. 将`imageRepository: k8s.gcr.io`修改为`imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers`
3. 添加`--pod-network-cidr`配置`podSubnet`

修改完毕后文件如下
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 172.188.2.71
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: master
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers
kind: ClusterConfiguration
kubernetesVersion: v1.15.7
networking:
  dnsDomain: cluster.local
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/12
scheduler: {}
```

下载镜像
```shell
kubeadm config images pull --config kubeadm-init.yaml
```

执行初始化

1. 配置文件初始化
```shell
kubeadm init --config kubeadm-init.yaml
```

```shell
To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.188.2.71:6443 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:cd6a2ec0a5da2060bfe0be4b43078f5f11e1dbd1b0d9b0e4d47fce7b764f1f66
```

2. 命令行初始化
```shell
kubeadm init --kubernetes-version=$(kubeadm version -o short)  --pod-network-cidr=10.244.0.0/16 --service-cidr=10.96.0.0/12
```

配置环境, 让当前用户可以执行kubectl命令
```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 安装Pod Network
这里选用flannel
```shell
curl -O https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml
```

查看各pod的状态，确保都是Running
```shell
[root@master ~]# kubectl get pod --all-namespaces -o wide
NAMESPACE     NAME                             READY   STATUS              RESTARTS   AGE    IP             NODE     NOMINATED NODE   READINESS GATES
kube-system   coredns-645bfc575f-c6rdw         1/1     Running             0          133m   10.244.0.18    master   <none>           <none>
kube-system   coredns-645bfc575f-jvxd2         1/1     Running             0          133m   10.244.0.19    master   <none>           <none>
kube-system   etcd-master                      1/1     Running             0          132m   172.188.2.71   master   <none>           <none>
kube-system   kube-apiserver-master            1/1     Running             0          132m   172.188.2.71   master   <none>           <none>
kube-system   kube-controller-manager-master   1/1     Running             0          133m   172.188.2.71   master   <none>           <none>
kube-system   kube-flannel-ds-amd64-hsxbq      1/1     Running             0          131m   172.188.2.71   master   <none>           <none>
kube-system   kube-flannel-ds-amd64-nd65q      1/1     Running             0          131m   172.188.2.87   node2    <none>           <none>
kube-system   kube-flannel-ds-amd64-zx4bq      1/1     Running             0          131m   172.188.2.86   node1    <none>           <none>
kube-system   kube-proxy-22rtl                 1/1     Running             0          72m    172.188.2.86   node1    <none>           <none>
kube-system   kube-proxy-j7wp8                 1/1     Running             0          72m    172.188.2.87   node2    <none>           <none>
kube-system   kube-proxy-jrttm                 1/1     Running             0          72m    172.188.2.71   master   <none>           <none>
kube-system   kube-scheduler-master            1/1     Running             0          132m   172.188.2.71   master   <none>           <none>
```

### 添加Node节点
node加入节点，node节点上面执行
```shell
kubeadm join 172.188.2.71:6443 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:cd6a2ec0a5da2060bfe0be4b43078f5f11e1dbd1b0d9b0e4d47fce7b764f1f66
```

查看节点状态
```shell
[root@master ~]# kubectl get node
NAME     STATUS   ROLES    AGE    VERSION
master   Ready    master   138m   v1.15.7
node1    Ready    <none>   135m   v1.15.7
node2    Ready    <none>   135m   v1.15.7
```

### 重置
集群初始化如果遇到问题，可以使用下面的命令进行清理

master
```shell
kubeadm reset
rm -f .kube/config
```

node
```shell
kubeadm reset
```

### kube-proxy开启ipvs
修改ConfigMap的kube-system/kube-proxy中的config.conf，`mode: "ipvs":`
```shell
kubectl edit cm kube-proxy -n kube-system
```

重启Pod
```shell
kubectl get pod -n kube-system | grep kube-proxy | awk '{system("kubectl delete pod "$1" -n kube-system")}'
```

```shell
[root@master ~]# kubectl get pod -n kube-system | grep kube-proxy
kube-proxy-22rtl                 1/1     Running   0          87m
kube-proxy-j7wp8                 1/1     Running   0          87m
kube-proxy-jrttm                 1/1     Running   0          87m

[root@master ~]# kubectl logs kube-proxy-22rtl -n kube-system
I0208 08:03:17.814816       1 server_others.go:170] Using ipvs Proxier.
W0208 08:03:17.815165       1 proxier.go:401] IPVS scheduler not specified, use rr by default
I0208 08:03:17.815331       1 server.go:534] Version: v1.15.7
I0208 08:03:17.828436       1 conntrack.go:52] Setting nf_conntrack_max to 524288
I0208 08:03:17.828670       1 config.go:187] Starting service config controller
I0208 08:03:17.828708       1 controller_utils.go:1029] Waiting for caches to sync for service config controller
I0208 08:03:17.828846       1 config.go:96] Starting endpoints config controller
I0208 08:03:17.828895       1 controller_utils.go:1029] Waiting for caches to sync for endpoints config controller
I0208 08:03:17.928850       1 controller_utils.go:1036] Caches are synced for service config controller
I0208 08:03:17.929058       1 controller_utils.go:1036] Caches are synced for endpoints config controller
```

## 参考
`https://blog.frognew.com/2019/07/kubeadm-install-kubernetes-1.15.html`

`https://juejin.im/post/5d7fb46d5188253264365dcf`