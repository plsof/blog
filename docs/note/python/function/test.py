# def test(c):
#     print("test before")
#     print("c address=%d" % id(c))
#     c += 2
#     print("test after")
#     print("c address=%d" % id(c))
#     return c

# if __name__ == "__main__":
#     a = 2
#     print("main before invoke test")
#     print("a address=%d" % id(a))
#     n = test(a)
#     print("main after invoke test")
#     print("a=%d" % a)
#     print("a address=%d" % id(a))
#     print("n=%d" % n)
#     print("n address=%d" % id(n))

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
