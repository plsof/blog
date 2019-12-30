---
title: Dashboard
---

## 概述
Kubernetes Dashboard是Kubernetes的官方Web UI。项目地址`https://github.com/kubernetes/dashboard`

## 安装
版本`v2.0.0-beta8`，支持的k8s版本`1.16`

删除之前的旧版本
```shell
[root@localhost ~]# kubectl delete ns kubernetes-dashboard
```

安装新版本
```shell
[root@localhost ~]# kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml
```

## 访问
Kubernetes Dashboard 当前，只支持使用Bearer Token登录。由于Kubernetes Dashboard默认部署时，只配置了最低权限的RBAC。因此，我们要创建一个名为`admin-user`的ServiceAccount，再创建一个ClusterRolebinding，将其绑定到Kubernetes集群中默认初始化的`cluster-admin`这个ClusterRole。
> 更多关于权限管理的信息，请参考[Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

### 创建账号

创建Service Account和ClusterRoleBinding，使用kubeadm安装集群时，默认创建了ClusterRole`cluster-admin`。此时我们可以直接为刚才的ServiceAccount创建ClusterRoleBinding。
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

将上述yaml内容保存为auth.yaml并执行
```shell
[root@localhost ~]# kubectl apply -f ./auth.yaml
```

### 获取token

```shell
[root@localhost ~]# kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')
```

输出如下
```shell
Name:         admin-user-token-62n7k
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: c5974a9e-3e40-4cf0-bf55-414293a39de3

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IjcyRGtNcmY5YW50TjYxRjZDZ0R3VmxLdldDNlRRRjFEcnVxQndKRW04YzgifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLTYybjdrIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJjNTk3NGE5ZS0zZTQwLTRjZjAtYmY1NS00MTQyOTNhMzlkZTMiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.ExrfCmoCGqRXIrhOnNnSZE6to56TDJJxvarVpje6SphMeIQE2eSFtgsPWxAAwHROWX86kOjx82X_M-pRxFfBVeAJEmgjBiNsunEQ86dDMQLbbqmUX5TINNpk4Xhc7xOtnlP7JmHFoOYibTCH1BUC3BvFmCbFm2q7y2_MERDyIHL2B0aFe8MGhVRlLBmf0qTYQr11JZWL9JSI9037gG_rXdJpdDZFrvAygJ6P-klqw5BHDA8EWu4s7qrPODVqwTBi_7sHgmQ0qRLU7gJOJy0Xha9e12yINoVKx_F8dAQH-YfEXqyAhtcbAfPZnk9JVCI3uGuEhnDpoAyX9X7vSt8gKA
```

### 访问方式
这里我们使用API Server方式访问Dashboard，对于API Server来说，它是使用证书进行认证的，我们需要先创建一个证书
- 创建.kube文件夹并把admin.conf复制到此文件夹
  ```shell
  [root@localhost ~]# mkdir -p $HOME/.kube
  [root@localhost ~]# sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  ```
- 生成client-certificate-data
  ```shell
  [root@localhost ~]# grep 'client-certificate-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.crt
  ```
- 生成client-key-data
  ```shell
  [root@localhost ~]# grep 'client-key-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.key
  ```
- 生成p12
  ```shell
  [root@localhost ~]# openssl pkcs12 -export -clcerts -inkey kubecfg.key -in kubecfg.crt -out kubecfg.p12 -name "kubernetes-client"
  ```
  **这里会提示输入密码，这个密码是证书导入浏览器要输入的密码**

浏览器导入kubecfg.p12，Dashboard入口url地址`https://192.168.0.1:6443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login`
