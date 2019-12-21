
## 安装
kubeadm config print init-defaults > kubeadm-config.yaml
kubeadm init --kubernetes-version=$(kubeadm version -o short)  --pod-network-cidr=10.244.0.0/16 --service-cidr=10.96.0.0/12 --ignore-preflight-errors=all
kubectl get pod -n kube-system
kubectl delete pod nginx-deploy-66ff98548d-95wcf
kubectl get deployment
kubectl describe pod nginx-pdd-fdc6f946f-82glf
kubectl logs -f nginx-pdd-fdc6f946f-82glf
kubectl run nginx-pdd --image=172.188.3.24:8000/library/nginx-pdd
kubectl scale --replicas=2 deployment/nginx-pdd
#### 创建service
kubectl expose deployment nginx-pdd --port 30000 --target-port=80
#### 外部访问
kubectl edit svc nginx-pdd
  type: ClusterIP -> NodePort

#### kube-proxy (默认iptables 可选用ipvs)

## 资源清单

### 集群资源分类
在k8s中、一般使用yaml格式的文件来创建符合我们预期期望的pod，这样的yaml文件我们一般
称为资源清单
1. 名称空间级别
  - 工作负载型资源（workload）：Pod、ReplicaSet、Deployment、StatefulSet、DaemonSet、
    Job、Cronjob
  - 服务发现及负载均衡型资源（ServiceDiscovery LoadBalance）：Service、Ingress、。。。
  - 配置与存储型资源：Volume（存储卷）、CSI（容器存储接口，可以扩展各种各样的第三方存储卷）
  - 特殊类型的存储卷：ConfigMap（当配置中心来使用的资源类型）、Secret（保存敏感数据）、
    DownwardAPI（把外部环境中的信息输出给容器）
2. 集群级别
  - Namespace、Node、Role、ClusterRole、RoleBinding、ClusterRoleBinding
3. 元数据级别
  - HPA、PodTemplate、LimitRange






