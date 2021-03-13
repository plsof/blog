---
title: 面向对象
---

## 封装

## 多态

## 继承

### 多重继承

```python
#!/usr/bin/env python3


class C(object):
    def __init__(self):
        print('Enter C')
        super().__init__()

    def display(self):
        print('display C')
        super().display()


class D(object):
    def __init__(self):
        super().__init__()
        print('Enter D')

    def display(self):
        print('display D')


class E(C, D):
    def __init__(self):
        print('Enter E')
        super().__init__()
        super().display()

if __name__ == '__main__':
    e = E()
```

执行结果
```
➜  ~ python3 test.py
Enter E
Enter C
Enter D
display C
display D
```

注释第七行，执行结果
```
➜  ~ python3 33.py
Enter E
Enter C
display C
display D
```