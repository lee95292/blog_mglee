---
layout : post
title : "[BoostCourse] PJ2 BackEnd 강의 정리"
date : "2019-02-24"
category: boostcourse
---

## JSP 강의정리

---

Java Server Page, 자바 언어를 통해, 웹 페이지를 표시하는 기술

<br>

# Scope란?

---


웹을 개발하면서 사용할 변수들에 대해, 유지되는 범위(scope)를 의미한다. 

page > request > session > application 의 포함관계가 있다.

<br>

# page scope 

---

서블릿의 PageContext

* pageContext 내장객체 사용(jsp)
* 웹 페이지가 실행되는 동안 사용됨 (forward시, 내장객체 사라짐)

<br>

# request scope

---

서블릿의 HttpServeltRequest

* request 내장객체 사용(jsp), set,get Attribute 메서드, 디스패쳐 메서드 존재
* 요청이 들어오고 응답이 나갈 때 까지 사용됨
* 페이지가 이동하는 forward에서도 객체 유지됨

<br>

# session scope

---

서블릿의 HttpSession

* 세션이 유지되는 동안 객체 유지됨, session 내장객체(jsp) 사용
* set,get Attribute 메서드 존재
* 클라이언트(browser) 별로 변수 관리

<br>

# application scope

---

서블릿의 ServletContext

* 여러 개의 클라이언트들이 값을 공유, application 내장객체(jsp) 사용

<br>

# Expression Language

---

EL은, 값을 표현하는 데 사용되는 스크립트언어로서 JSP 문법을 보완하는 역할을 하며, 기능은 다음과 같다.

* JSP의 스코프에 맞는 속성 사용
* 집합 객체에 대한 접근 방법 제공
* 수치, 관계, 논리 연산자 제공
* 자바 클래스 메서드 호출 기능 제공
* EL만의 기본객체 제공

<br>

## 표현언어의 사용방법

```java
${expression} 
```

위의 기본예제와 같이, $달러 옆의 {}중괄호 내에 표현식을 작성한다.


```jsp
<jsp:include page = "/module/${skin.id}/header.jsp" flush="true">
<b>${sessionScope.member.id}</b>님 환영합니다.
```

jsp로 작성된 EL 예제


표현언어가 제공하는 기본객체는 아래와 같다.

* pageContext

* pageScope, requestScope, sessionScope, applicationScope - 기본객체에 저장된 **속성-값** 매핑을 저장한 Map 객체

* param - 요청 파라미터의 **파라미터이름-값** 매핑을 저장한 Map 객체

* paramValues - 요청 파라미터의 값들을 **파라미터이름 - 값배열** 매핑을 저장한 Map 객체

* header - 요청정보의 헤더이름-값 매핑을 저장한 Map 객체

* headerValues - 위 관계와 동일

* cookie - 쿠키이름 - 쿠키 매핑저장

* initParam - 초기화 파라미터의 이름- 값 매핑 저장

<br>
<br>
# JSTL - JSP Standard Tag Library

생략


# DataBase

데이터베이스는 따로 Mysql 설치, 문법 예제 연습 의 2개 시리즈의 포스팅으로 나누어 작성