---
layout : post
title : "[BoostCourse] PJ3 BackEnd 강의 정리(Spring 개요)"
date : "2019-07-08"
category: boostcourse
---


## Spring이란? 

---

엔터프라이즈급 웹 어플리케이션을 제작하기 위한 솔루션. AOP, IoC, DI, 선언적 트랜잭션등 여러 기능을 제공하며,

 이들의 모듈화된 부분들을 사용할 수 있도록 설계된 프레임워크.

여기서 프레임워크란, 라이브러리와는 확연한 차이가 있다. 

강의에서는 라이브러리와 프레임워크를 원재료와 반제품으로 묘사하였다.

* 라이브러리 - 자주 사용하는 기능들을 함수 또는 기능으로 제작하여, 컴파일 타임에 링킹되는 소스코드(또는 기능)

* 프레임워크 - 자주 사용되는 기능이나 기본적인 실행환경 및 구조를 제공한다. (Spring에서는 DI,IoC,AOP etc..)

A 라이브러리 사용한 프로그램이 어떤 종류의 프로그램인지 알지 못하지만-->'원재료 비유',

B 프레임워크에서 동작하는 프로그램은 어떤 프로그램인지 알 수 있다. --> '반제품 비유'
BCI : 실행시간에 .class 바이트코드 수정

## Spring Framework의 모듈 및 특징

### **AOP와 Instrumentation**

---

**AOP가 뭔데?** __important

[AOP_링크](https://blog.naver.com/kyh31126/221496146885) - 자세한 AOP 설명은 여기에서 많이 참고했다.

Aspect Oriented Programming 직역하면 관점지향 프로그래밍인데, 이는 비즈니스 로직과 공통 모듈을 구분하여, 비즈니스 로직에 공통 모듈을 삽입하는 개발 방법이다.

대표적으로 메소드의 성능을 검사할 때, 비즈니스 로직에 System.currentTimeMills() 메서드를 삽입해 성능을 측정하는 방법이 있지만, AOP를 이용해 해당 로직 밖에서 성능 측정코드를 삽입하는 AOP방법이 사용된다.

---

* spring-AOP - AOP얼라이언스와 호환되는 방법으로 AOP지원
* spring-aspects - AspectJ와의 통합 제공 (AspectJ는 BCI 제공 툴)

Spring의 AOP에는 [BCI(Btye Code Instrumentation)](https://ukja.tistory.com/17) 이라는 기술이 핵심적으로 사용된다.

* spring-instrument 


### **Messaging**

---

메시지란, 네트워크에서 컴퓨터간 일반 통신을 의미.

spring-messaging - 스프링4에서는 메시지 기반 어플리케이션을 작성하기 위해 Message, MessageChannel, MessageHadler, 메시지 매핑 어노테이션 제공

### **Data Access/ Integration**

---

spring-jdbc, spring-tx(선언적 트랜잭션 관리), spring-orm(JPA,JDO,Hibernate), spring-oxm, spring-jms

### **Web**

---

* spring-web - 멀티파트 파일 업로드, 서블릿 리스너 등의 웹 지향 통합 기능 제공

* spring-webmvc - webservlet모듈, SpringMVC 및 REST 웹서비스 구현 포함

* spring-websocket - 웹소켓  지원



---

XML, java_config 설정부분

Spring JDBC 부분

## Spring MVC  __important

---

* MVC?

Model - View - Controller 

서비스에서 저장되는 데이터, 주문목록, 회원정보, 상품목록 자체를 **Model**이라고 함. 

최종적으로 말단 기기에서 유저에게 보여지는 화면. 또는 화면을 렌더링하는 주체를 **View라고** 함

사용자의 요청에 의해 Model에서 비즈니스 로직을 거쳐 View를 만들기 까지의 액션을 수행하는 주체를 **Controller**라고 함

웹 상에서 MVC  구조는 몇 단계의 발전을 이뤄왔다.

---

<img src="/assets/img/boostcourse/mvc.png">

위 MVC 구조에서는 JSP Page 내에 html과 java 코드가 섞여있어 유지/보수가 힘들었다. 

뷰를 담당하는 영역과 컨트롤을 담당하는 영역이 혼재되어 있어, 한사람이 본다면 문제가 없겠지만, 

뷰와 컨트롤을 담당하는 사람이 분리된 프로젝트의 경우 상당한 불편함을 초래했다.

---

<img src="/assets/img/boostcourse/mvc1.png">

MVC2 구조에서는 요청을 servlet이 받아, Controll 작업을 수행해, 로직과 뷰를 분리하였다.

이는 다음과 같은 장점을 갖는다

* 관리 및 테스트의 용이
* 확장성 증가
* 관심사의 효과적인 분리

---

<img src="/assets/img/boostcourse/mvc2.png">

위의 MVC2 발전형태에서는, Front Controller가 요청을 받고, 또 다른 Controller 클래스가 요청을 위임받는다.

이를 ControllerClass, HandlerClass라고 한다.

### Spring MVC 구성요소

Spring은 model2 아키텍처로 구현되어 있음.

<img src="/assets/img/boostcourse/springmvc.png">

### **mvc 동작순서**  __important

---

* HandlerMapping객체 통해 어떤 Controller가 동작할 것인지 Mapping 조회 (자바 config or xml) -->2
* Handler Adapter를 통해 실행할 Controller에게 실행 요청 -->3,4
* 컨트롤러가 리턴하는 뷰를 DispatcherServlet에 전달-->5
* View Resolver와 View 이름을 통해 뷰를 조회하고 -->6 뷰를 렌더링 후 응답 -->7,8

붉은색(보라색) 부분이 개발자가 구현하는 부분.

초록색은 가끔씩 개발자가 구현하는 부분.


### DispatcherServlet 동작과정 

<img src="/assets/img/boostcourse/dpservlet.png">

* 요청 선처리 작업 (뒷부분에서 추가설명)
* HandelrExecutionChain 탐색 
* HandlerExecutionChain 결정 --> 없으면 404에러 출력
* HandelrAdapter 결정 -->없다면 ServletException 발생
* 요청 처리

### 요청 선처리 작업 (DispatcherServlet) 동작과정

---

<img src="/assets/img/boostcourse/befrq.png">

* Locale 결정 : Locale에 설정된 지역정보를 통해 지역화 
* RequestContextHolder에 요청 저장 : 요청을 받아 응답하기 이전까지 HTTPServlet Request, Response 객체를 저장함. --> 일반 빈에서 바로 선언해서 사용할 수 있도록 함
* FlashMap 복원 : redirect로 파라미터 전달 시 URL을 복잡하게 하는부분들을 정리해주는 역할
* 멀티파트 요청인 경우,  요청 제어를 MultipartResolver로 넘김 
* 핸들러 결정과 실행

### DispatcherServlet > 요청처리 과정

---

<img src="/assets/img/boostcourse/handreq.png">
