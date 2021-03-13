---
title: logging
---

## 前言

### 模块介绍

Python内置的日志模块

#### 日志级别
由高往低
```text
critical
error
warn
info
debug
notset
```

*`NOTSET`表示所有级别的日志消息都要记录*

#### 处理流程

`logger -> filter -> handler`

## 配置

### 代码显式创建

日志输出到屏幕，写入到文件

`logger.py`

```python
import logging


log = logging.getLogger('logger')
log.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(message)s')

handler_file = logging.FileHandler('test.log', mode='w', encoding='utf-8')
handler_file.setLevel(logging.DEBUG)
handler_file.setFormatter(formatter)
log.addHandler(handler_file)

handler_screen = logging.StreamHandler()
handler_screen.setLevel(logging.INFO)
handler_screen.setFormatter(formatter)
log.addHandler(handler_screen)
```

### 通过配置文件

日志输出到屏幕，写入到文件

`config/logger.conf`

```text
[loggers]
keys=root,lcm

[logger_root]
level=DEBUG
handlers=file

[logger_lcm]
level=DEBUG
handlers=screen,file
qualname=lcm
propagate=0

[formatters]
keys=simple,complex

[formatter_simple]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s

[formatter_complex]
format=%(asctime)s - %(name)s - %(levelname)s - %(module)s : %(lineno)d - %(message)s

[handlers]
keys=file,screen

[handler_file]
class=handlers.TimedRotatingFileHandler
interval=midnight
backupCount=5
formatter=complex
level=DEBUG
args=('logs/test.log',)

[handler_screen]
class=StreamHandler
formatter=simple
level=INFO
args=(sys.stdout,)
```

`logger.py`

```python
import logging.config

logging.config.fileConfig("config/logger.conf")
logger = logging.getLogger("lcm")
```

### 配置项说明

1. 配置文件中一定要包含`loggers`、`handlers`、`formatters`这些section，它们通过keys这个option
来指定该配置文件中已经定义好的`loggers`、`handlers`和`formatters`，多个值之间用逗号分隔。
另外`loggers`这个section中的keys一定要包含root这个值

2. `loggers`、`handlers`、`formatters`中所指定的日志器、处理器和格式器都需要在下面以单独的section进行定义。
seciton的命名规则为[logger_loggerName]、[formatter_formatterName]、[handler_handlerName]

3. 定义`logger`的section必须指定`level`和`handlers`这两个option，level的可取值为`NOTSET`、`DEBUG`、`INFO`、`WARNING`、`ERROR`、`CRITICAL`，其中`NOTSET`表示所有级别的日志消息都要记录，包括用户定义级别。`handlers`的值是以逗号分隔的`handler`名字列表，这里出现的`handler`必须出现在[handlers]这个section中，并且相应的`handler`必须在配置文件中有对应的section定义

4. 对于非root`logger`来说，除了`level`和`handlers`这两个option之外，还需要一些额外的option，其中`qualname`是必须提供的option，它表示在`logger`层级中的名字，在应用代码中通过这个名字得到`logger`。**`propagate`是可选项，其默认是为1，表示消息将会传递给高层次logger的handler，通常我们需要指定其值为0**。另外，对于非root`logger`的`level`如果设置为`NOTSET`，系统将会查找高层次的`logger`来决定此`logger`的有效`level`

5. 定义`handler`的section中必须指定`class`和`args`这两个option，`level`和`formatter`为可选option。`class`表示用于创建`handler`的类名，`args`表示传递给`class`所指定的`handler`类初始化方法参数，它必须是一个元组（tuple）的形式，即便只有一个参数值也需要是一个元组的形式；`level`与`logger`中的`level`一样，而`formatter`指定的是该处理器所使用的格式器，这里指定的格式器名称必须出现在`formatters`这个section中，且在配置文件中必须要有这个`formatter`的section定义；如果不指定`formatter`则该`handler`将会以消息本身作为日志消息进行记录，而不添加额外的时间、日志器名称等信息

6. 定义`formatter`的sectioin中的option都是可选的，其中包括`format`用于指定格式字符串，默认为消息字符串本身；datefmt用于指定asctime的时间格式，默认为`'%Y-%m-%d %H:%M:%S'`。`class`用于指定格式器类名，默认为`logging.Formatter`

### 参考

`https://www.cnblogs.com/yyds/p/6885182.html`