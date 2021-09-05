---
layout: post
title: "[INTG, SQL] SQL Cheet Sheet 구문 예제 및 문법 정리"
date: "2019-03-04"
category: intg
---


SQL 하나로 정리하기 : INTG 프로젝트

### 목차

---

* <a href="#select">select</a>
* <a href="#create">create</a>  //([https://sqlzoo.net/wiki/CREATE_and_DROP_Reference](https://sqlzoo.net/wiki/CREATE_and_DROP_Reference))

<br><br>

### 레퍼런스
---

* [SQLzoo](https://sqlzoo.net/) :sql 예제 연습사이트
* [TCPschool](http://tcpschool.com/mysql/intro) : sql을 비롯한 여러가지 프로그래밍 언어 정리된 사이트

<br><br><br>
<h1><a name="select">select문</a></h1>
---

# 001 SELECT basics
---

1번 : 독일의 인구 찾기

```sql
SELECT population FROM world
  WHERE name='Germany'
```
<br><br>


2번 IN 사용 :(스웨덴 ,노르웨이, 덴마크)의  이름, 인구 출력

```sql
SELECT name,population FROM world 
  WHERE name IN ('Sweden','Norway','Denmark');
```
<br><br>

3번 BETWEEN ~ AND 사용 - 인구가 20만~25만 사이 국가 이름,영토 출력

```sql
SELECT name,area FROM world 
  WHERE area BETWEEN 200000 AND 250000
```
<br><br>

# 002 SELECT name
---
<br><br>

>pattern matching strings

1번  LIKE, multicharacter wildcard(%)사용 

```sql
SELECT name FROM world
  WHERE name LIKE 'Y%' -- Y로 시작하는 이름
```
<br><br>

7번 LIKE,wildcard(%) 응용

```sql
SELECT name FROM world 
  where name LIKE '%a%a%a%'  -- a가 세번이상 들어가는 국가
```
<br><br>

8번 LIKE,single character wildcard(%) 사용

```sql
SELECT name FROM world 
  where name LIKE '_t' -- 두 번째 글자가 t
```
<br><br>

12번 LIKE, CONCAT 사용
```sql
SELECT name FROM world 
  WHERE capital LIKE concat(name,' City')  -- Mexico - Mexico City 같은 관계를 가진 수도 출력
```

<br><br>

15번 꽤 어려운 문제 - 수도가 국가이름의 확정인 경우, 국가이름과 확장된부분 출력
```sql
SELECT name,REPLACE(capital,name,'') AS extension FROM world
 WHERE capital LIKE concat(name,' %') 
   OR capital LIKE concat(name,'-%');
```


<h1><a name="create">create문</a></h1>

---
<br><br>

### 테이블 생성 제약조건

--- 

1. NOT NULL : 해당 필드는 NULL 값을 저장할 수 없게 됩니다. INSERT 구문에서 해당 영역을 생략할 시, 기본값이 삽입됩니다.

2. UNIQUE : 해당 필드는 서로 다른 값을 가져야만 합니다.

3. PRIMARY KEY : 해당 필드가 NOT NULL과 UNIQUE 제약 조건의 특징을 모두 가지게 됩니다.

4. FOREIGN KEY : 하나의 테이블을 다른 테이블에 의존하게 만듭니다.

5. DEFAULT : 해당 필드의 기본값을 설정합니다.

