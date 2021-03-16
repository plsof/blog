---
title: 函数
---

<!-- ## 函数 -->

## 传参

### 传参方式

#### 值传递
值传递（passl-by-value）过程中，被调函数的形式参数作为被调函数的局部变量处理，即在堆栈中开辟了内存空间以存放由主调函数放进来的实参的值，从而成为了实参的一个副本。值传递的特点是被调函数对形式参数的任何操作都是作为局部变量进行，不会影响主调函数的实参变量的值。

#### 引用传递
引用传递(pass-by-reference)过程中，被调函数的形式参数虽然也作为局部变量在堆栈中开辟了内存空间，但是这时存放的是由主调函数放进来的实参变量的地址。被调函数对形参的任何操作都被处理成间接寻址，即通过堆栈中存放的地址访问主调函数中的实参变量。正因为如此，被调函数对形参做的任何操作都影响了主调函数中的实参变量。

Python函数传参属于`引用传参`

例子1 实参为不可变数据类型：
```python
def test(c):
    print("test before")
    print("c address=%d" % id(c))
    c += 2
    print("test after")
    print("c address=%d" % id(c))
    return c

if __name__ == "__main__":
    a = 2
    print("main before invoke test")
    print("a address=%d" % id(a))
    n = test(a)
    print("main after invoke test")
    print("a=%d" % a)
    print("a address=%d" % id(a))
    print("n=%d" % n)
    print("n address=%d" % id(n))
```

返回结果：
```shell
main before invoke test
a address=4424321360
test before
c address=4424321360
test after
c address=4424321424
main after invoke test
a=2
a address=4424321360
n=4
n address=4424321424
```

**id函数可以获得对象的内存地址。很明显从上面例子可以看出，将a变量作为参数传递给了test函数，传递了a的一个引用，把a的地址传递过去了，所以在函数内获取的变量C的地址跟变量a的地址是一样的，但是在函数内，对C进行赋值运算，C的值从2变成了4，实际上2和4所占的内存空间都还是存在的，赋值运算后，C指向4所在的内存。而a仍然指向2所在的内存，所以后面打印a，其值还是2.**

例子2 实参为可变数据类型：
```python
def test(list2):
    print("test before")
    print("list2 address=%d" % id(list2))
    list2[1]=30
    print("test after")
    print("list2 address=%d" % id(list2))
    return list2

if __name__=="__main__":
    list1=["loleina",25,'female']
    print("main before invoke test")
    print("list1=%s" % str(list1))
    print("list1 address=%d" % id(list1))
    list3=test(list1)
    print("main after invoke test")
    print("list1=%s" % str(list1))
    print("list1 address=%d" % id(list1))
    print("list3=%s" % str(list3))
    print("list3 address=%d" % id(list3))
```

返回结果：
```shell
main before invoke test
list1=['loleina', 25, 'female']
list1 address=4566353536
test before
list2 address=4566353536
test after
list2 address=4566353536
main after invoke test
list1=['loleina', 30, 'female']
list1 address=4566353536
list3=['loleina', 30, 'female']
list3 address=4566353536
```

结论：
**Python不允许程序员选择采用传值还是传引用。Python参数传递采用的肯定是“传对象引用”的方式。这种方式相当于传值和传引用的一种综合。如果函数收到的是一个可变对象（比如字典或者列表）的引用，就能修改对象的原始值－－相当于通过“传引用”来传递对象。如果函数收到的是一个不可变对象（比如数字、字符或者元组）的引用，就不能直接修改原始对象－－相当于通过“传值'来传递对象。**

参考：`https://www.cnblogs.com/loleina/p/5276918.html`