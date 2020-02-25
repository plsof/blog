---
title: 镜像
---

```yaml
FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
COPY httpserver1.py /code/
WORKDIR /code/
CMD [ "python", "httpserver1.py" ]
EXPOSE 80
```

## 制作镜像
```shell
➜  ~ docker build -t myhttp:v2 .
```
