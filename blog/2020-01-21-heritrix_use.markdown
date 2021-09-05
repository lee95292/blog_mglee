---
layout: post
title: "heritrix 오픈소스 웹 크롤러 사용하기"
date: "2020-01-21"
category: opensource
---

> Heritrix 오픈소스 웹 크롤러를 사용해보고 방법을 정리하려합니다.

> 자세한 사용법은 [github 위키](https://github.com/internetarchive/heritrix3/wiki/)에 잘 나와있지만, 기본적인 부분,헷갈릴만한 부분이나 자주 사용할만한 옵션들을 소개해보도록 하겠습니다.

### 설치

```bash
wget http://builds.archive.org/maven2/org/archive/heritrix/heritrix/3.4.0-SNAPSHOT/heritrix-3.4.0-20190828.200101-25-dist.tar.gz

tar -xzf heritrix-3.4.0-20190828.200101-25-dist.tar.gz
```

-설치 끝

설치는 매우 간단하지만,

설정이 꽤 귀찮고 모호한 부분이 있습니다. spring xml properties를 사용해서 직접 설정합니다.

### 일단 기본 설정으로 크롤링 진행

```bash
cd Heritrix/bin

./heritrix -a admin:amdin -b /

```

- -a 옵션으로 계정을 설정하고, -b옵션을 통해 접근권한을 설정합니다.
- -b옵션 없이 실행하는 경우, localhost에서만 사용 가능하고,
- -b / 로 옵션을 주는경우, 어디서든 계정으로 엑세스할수 있습니다.
- -p 옵션으로 포트를 지정할 수 있습니다.(기본 : 8443)

(b옵션을 못찾고 포트포워딩하느라 시간을 많이 썼습니다...)

### 크롤링 수행

Create job으로 job(크롤링 작업 단위) 생성합니다.

생성하면 Hritrix_home/jobs/\[job_name\]/crawler-beans.cxml 파일 생깁니다.

웹페이지에서 해당 파일을 수정할 수도 있지만, 저같은경우 에러가 떠서 직접 수정했습니다.

기본설정

```xml
#1
metadata.operatorContactUrl=http://lee95292.github.io

...

#2
<bean id="longerOverrides" class="org.springframework.beans.factory.config.PropertyOverrideConfigurer">
  <property name="properties">
   <props>
    <prop key="seeds.textSource.value">

# URLS HERE
http://lee95292.github.io

    </prop>
   </props>
  </property>
 </bean>

```

즉, metadata.operatorContactUrl을 지정하고 #URLs Here 표시된 곳 밑에 URL을 추가해주면 됩니다.

operatorContactUrl에 대해서는 자세한 설명이 나와있지는 않네요..

저장 한 후, jobs 페이지에서 크롤링을 수행합니다.

build > launch 후 기다리시면 크롤링 작업이 완료됩니다.

pause를 통해 중지  
terminate를 통해 중단  
teardown을 통해 종료할 수 있습니다.

### 옵션

crawler-beans.cxml에서 설정가능한 옵션들입니다.

**TransclusionDecideRule을** 삭제하시면 narrow crawling을 수행합니다.

> > seed host로 등록한 이외의 호스트를 크롤링하지 않습니다.

### PostProcess

크롤링 결과물을 처리하는 방법입니다.. 유튜브에서 [참고](https://www.youtube.com/watch?v=MAHWPeBVNpI&t=447s)했습니다.

pip install warctools  
(pip3)

```python
from hanzo import warctools

warcStream=warctools.WarcRecored.open_archive("WEB-20200121115637651-00000-20607~ip-172-31-35-42.ap-northeast-2.compute.internal~8443.warc.gz")

i=0
for record in warcStream:
    print("********")
    print("warc record #",i)
    print(record.content[0][0:1000])
    i+=1
    if(i>10):
        break
```
