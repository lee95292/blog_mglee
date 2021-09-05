---
layout : post
title : "[Mysql] mysql 원격 접속 가능하도록 설정하기"
date : "2019-12-04"
category: boostcourse
---


0. mysql 서버에서, remote주소를 통해 접근가능한 계정을 생성한다

```mysql
create user [usrname]@[remote_addr] identified by [passowrd];
```

```bash
sudo vi /etc/mysql/mysqld/mysqld.conf.d/mysqld.cnf
```

아래와 같은 내용이 들어있는 설정파일에서,

1. bind-address항목을 mysql 서버의 주소(외부에서 접근가능한 자기자신의 퍼블릭 주소)를 기재한다.

```bash
[mysqld]
#
# * Basic Settings
#
user            = mysql
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
port            = 3306
basedir         = /usr
datadir         = /var/lib/mysql
tmpdir          = /tmp
lc-messages-dir = /usr/share/mysql
skip-external-locking
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address            = 127.0.0.1

```



2. 이후, servicee mysql restart