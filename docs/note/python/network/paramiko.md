---
title: paramiko
---

## 简介

### 介绍

`paramiko`是Python的一个第三方库，实现了SSHv2协议

### 安装
`pip install paramiko`

## 说明

### SSHClient
SSH客户端

```python
ssh = paramiko.SSHClient()
# 自动加载系统ssh hosts文件
ssh.load_system_host_keys()
"""
设置know_hosts文件中没有远程服务器记录时的应对策略
  AutoAddPolicy:  自动添加主机名及主机密钥到本地HostKeys对象，不依赖load_system_host_key的配置。
                  即新建立ssh连接时不需要再输入yes或no进行确认
"""
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname=host,
            port=port,
            username=username,
            password=password,
            key_filename=key_filename,
            timeout=timeout)
# 执行shell命令
stdin, stdout, stderr = ssh.exec_command(cmd)
```

### SFTPClient
SFTP客户端

```python
# transport用于交互式ssh session
transport = paramiko.Transport((host, port))
transport.connect(username=username,
                  password=password,
                  pkey=pkey)
sftp_client = paramiko.SFTPClient.from_transport(transport)
# 上传文件
sftp_client.put(local_file, remote_file)
```

### 实例

```python
class SSHSession(object):
    def __init__(self, host=None, port=22, username='root', password='cloudadmin', key_filename=None, timeout=80):
        self.__host = host
        self.__port = port
        self.__username = username
        self.__password = password
        self.key_filename = key_filename
        self.__timeout = timeout
        self.ssh = None
        self.__sftp_client = None

    @property
    def login(self):
        try:
            self.ssh = paramiko.SSHClient()
            self.ssh.load_system_host_keys()
            self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.ssh.connect(hostname=self.__host,
                             port=self.__port,
                             username=self.__username,
                             password=self.__password,
                             # key_filename=self.key_filename,
                             timeout=self.__timeout)
            return True
        except Exception as e:
            self.ssh.close()
            logger.error('ssh登录异常 %s %s', self.__host, e)
            return False

    @property
    def __sftp(self):
        try:
            transport = paramiko.Transport((self.__host, self.__port))
            transport.connect(username=self.__username, password=self.__password)
            self.__sftp_client = paramiko.SFTPClient.from_transport(transport)
            return True
        except Exception as e:
            self.__sftp_client.close()
            logger.error("sftp error %s", e)
            return False

    def command(self, cmd, timeout=None):
        if self.login:
            try:
                stdin, stdout, stderr = self.ssh.exec_command(cmd)
                if timeout is not None:
                    start_time = time.time()
                    while time.time() < start_time + timeout:
                        if stdout.channel.exit_status_ready():
                            break
                        time.sleep(0.5)
                    else:
                        raise TimeoutError('time out')
            except Exception as e:
                logger.error('执行指令异常 %s %s', self.__host, e)
                return {'code': -1}

            return_code = stdout.channel.recv_exit_status()
            result = {'code': return_code, 'stdout': stdout.read().decode(), 'stderr': stderr.read().decode()}
            return result

    def put(self, local, remote):
        """
        if local == 目录 递归传输目录下文件
        :param local:
        :param remote:
        :return:
        """
        if self.__sftp:
            if os.path.isdir(local):
                #  recursively upload a full directory
                for path, _, files in os.walk(local):
                    try:
                        self.__sftp_client.mkdir(os.path.join(remote, path))
                    except:
                        pass

                    for file in files:
                        self.__sftp_client.put(os.path.join(path, file), os.path.join(remote, path, file))
            else:
                self.__sftp_client.put(local, remote)
```