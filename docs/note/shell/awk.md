<center>
    <h1>Awk</h1>
</center>

## 分隔符

#### FS : The input field separator, a space by default; 字段分隔符

#### OFS: The output field separator, a space by default; 输出字段分隔符

#### RS: The input record separator, by default a newline; 记录分隔符

#### ORS: The output record separator, by default a newline; 输出记录分隔符

#### 示例

```shell
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucp:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
gopher:x:13:30:gopher:/var/gopher:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
```

#### FS

```shell
[root@localhost ~]# awk 'BEGIN{FS=":"}{print $1,$2,$3,$4,$5}' passwd
mail x 8 12 mail
uucp x 10 14 uucp
operator x 11 0 operator
games x 12 100 games
gopher x 13 30 gopher
ftp x 14 50 FTP User
```

#### OFS

```
[root@localhost ~]# awk 'BEGIN{FS=":";OFS="#"}{print $1,$2,$3,$4,$5}' passwd
mail#x#8#12#mail
uucp#x#10#14#uucp
operator#x#11#0#operator
games#x#12#100#games
gopher#x#13#30#gopher
ftp#x#14#50#FTP User
```

#### RS

```shell
[root@localhost ~]# awk 'BEGIN{RS=":"}{print $0}' passwd
mail
x
8
12
mail
/var/spool/mail
/sbin/nologin
uucp
x
10
14
uucp
/var/spool/uucp
/sbin/nologin
operator
x
11
0
operator
/root
/sbin/nologin
games
```

#### ORS

```shell
[root@localhost ~]# awk 'BEGIN{FS=":";ORS="#"}{print $0}' passwd
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin#uucp:x:10:14:uucp:/var/spool/uucp:/sbin/nologin#operator:x:11:0:operator:/root:/sbin/nologin#games:x:12:100:games:/usr/games:/sbin/nologin#gopher:x:13:30:gopher:/var/gopher:/sbin/nologin#ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin#
```



## 指定多个FS

#### 示例

```shell
mail:x 8#12:mail:/var/spool/mail:/sbin/nologin
uucp:x  10#14:uucp  /var/spool/uucp:/sbin/nologin
operatorx   11#0:operator?/root:/sbin/nologin
games:x   12#100:games?/usr/games:/sbin/nologin
gopher:x    13#30:gopher?/var/gopher:/sbin/nologin
```

#### 指定多个FS(空格，多个空格，：，#，？)

```
[root@localhost ~]# awk -F '[ ]+|[:#?]' '{print $1,$2,$3,$4,$5,$6,$7}' passwd
mail x 8 12 mail /var/spool/mail /sbin/nologin
uucp x 10 14 uucp /var/spool/uucp /sbin/nologin
operatorx 11 0 operator /root /sbin/nologin
games x 12 100 games /usr/games /sbin/nologin
gopher x 13 30 gopher /var/gopher /sbin/nologin
```



## 数组

#### 示例

```shell
80.80.80.67 - - [2019-10-29T00:01:01+08:00] "GET /ysten-lvoms-epg/epg/getChannelNextProgram.shtml?uuid=cctv-14&curprogramId=175430298&programName=%E5%8A%A8%E7%94%BB%E5%A4%A7%E6%94%BE%E6%98%A0:%E5%96%80%E6%96%AF%E7%89%B9%E7%A5%9E%E5%A5%87%E4%B9%8B%E6%97%85&startTime=1572220920&action=next&templateId=02850&deviceGroupId=556&districtCode=510600&random=0.23766797524876893 HTTP/1.1"  "200" 149 "-" "http://jtdsepg.cdzgys.cn/watchTV2.0/watchTV11.0/index.html?businessType=livereplay&mediaType=live&fromwhere=playback&templateId=02850&catgId=ysten-cctv-1&userId=25539939"  "gefo5(ysten)" - "0.000"  "looktvepg.sc.ysten.com" "7070" "-" "HIT" "-" "-"
80.80.80.40 - - [2019-10-29T00:01:01+08:00] "GET /ysten-lvoms-epg/epg/getChannelNextProgram.shtml?uuid=cctv-6&curprogramId=175106624&programName=%E7%AC%91%E5%82%B2%E6%B1%9F%E6%B9%96&startTime=1572185700&action=next&templateId=0286&deviceGroupId=821&districtCode=510100&random=0.8053548543248326 HTTP/1.1"  "200" 135 "-" "http://jtdsepg.cdzgys.cn/watchTV2.0/watchTV11.0/index.html?businessType=livereplay&mediaType=live&fromwhere=playback&templateId=0286&catgId=ysten-cctv-1&userId=25690871"  "gefo5(ysten)" - "0.000"  "looktvepg.sc.ysten.com" "7070" "-" "HIT" "-" "-"
```

```shell
[root@localhost ~]# awk -F "[ ]+|?" '{a[$12]++;n++}END{for(i in a)print i,a[i],a[i]/n}' looktvepg.access.log20191029 | sort -n -r -k2
```



## 条件判断

```shell
awk '$4>="[2019-10-28T01:00:00+08:00]" && $4<"[2019-10-28T03:00:00+08:00]" {print}' looktvepg.access.log20191029
```

```shell
#!/bin/bash
#2017/07/05 @pdd
# egrep "015164026490197|015164026498133|015164026498581|015164026496744|015164026495932|015373001004176" /nginxlogs/tms.access.log

LOG="/nginxlogs/tms.access.log"

MIN=$1

# minutes must great than 30
if [[ -n "$1" && "$1" -gt 30 ]];then
    PRETIME=$(date -d "-$1 min" "+%Y-%m-%dT%T")
else
    PRETIME=$(date -d "-30 min" "+%Y-%m-%dT%T")
fi

TIME="["${PRETIME}"+08:00]"

# 时间 HTTP状态码 串号 节点
awk -v actime=$TIME '$4 >= actime {print $4,$8,substr($12,2,15),$15}' $LOG | awk '{if($3==015164026498581) print "A在线",$0; else if($3==015164026490197) print "B在线"; else if($3==015373001004176) print "C在线",$0}'
```



## 变量传值

#### 每分钟的请求占比

```shell
#!/bin/bash

for i in $(seq 20)
do
    ptime=`date -d "$(($i-1)) minute 20191001 0950" "+[%Y-%m-%dT%H:%M:%S+08:00]"`
    ntime=`date -d "$(($i)) minute 20191001 0950" "+[%Y-%m-%dT%H:%M:%S+08:00]"`
    echo "$ptime - $ntime"
    awk -v ptime=$ptime -v ntime=$ntime '$4 >=ptime && $4<ntime {a[$NF]++;n++} END{for(i in a)print i,a[i]/n*100"%";print "一分钟总行数"n}' looktvepg.access.log20191001
    echo
done
```

#### 每十秒的访问量

```shell
#!/bin/bash

for i in $(seq 0 16)
do
    ptime=`date -d "$(($i*10)) seconds 20191106 01:03" "+[%Y-%m-%dT%H:%M:%S+08:00]"`
    ntime=`date -d "$(($i*10+9)) seconds 20191106 01:03" "+[%Y-%m-%dT%H:%M:%S+08:00]"`
    echo "$ptime - $ntime"
    grep getChannelNextProgram looktvepg.access.log | grep ysten-cctv-5 | awk -v ptime=$ptime -v ntime=$ntime '$4 >=ptime && $4<=ntime {n++} END{print "cctv5出现次数 ", n}'
done
```

