---
layout: post
title: "[INTG, PL] 프로그래밍 언어, 프레임워크 Error Report"
date: "2019-03-04"
category: intg
---

에러 리포트 하나로 정리하기 : INTG 프로젝트

### 목차

---

* <a href="#js">Javascript</a>
* <a href="#eclipse">Eclipse_Setting</a>
* <a href="#spring">Spring</a>
* <a href="#maven">Maven</a>
* <a href="#java">Java</a>
* <a href="#git">Git</a>
* <a href="#python">python</a>
* <a href="#blog">Jekyll/Blog</a>

<br><br><br>
<h1><a name="js">Javascript</a></h1>
---
<br>

**E001**

---

에러 내용 - js파일이 html파일에 extern 형식으로 들어가 있을때,  getElementsBy... 에서는 작동하지만, querySelectorAll는 작동하지 않는다.

즉, 특정한 자바스크립트 코드가 작동하지 않는다.

해결 방법 : script의 로딩하는 태그를 html문서의 맨 뒤로 넣어보자! 

<br>
 
 - 추측) Dom tree가 만들어지기 전에 쿼리셀렉터를 작동시키면 동작하지 않는다. ~~괜히 쿼리셀렉터가 반환하는 Node에 문제가 있는줄 알았다.~~


 <h1><a name="eclipse">Eclipse_Setting</a></h1>
 ---
 <br>

 이클립스의 경우 수정사항이 제대로 바뀌지 않았을 때가 있다. 이럴 땐,

project > clean을 수행해주자.  잘못된, 꼬인 설정들을 정리해준다. [Eclipse_clean기능](https://huelet.tistory.com/entry/%EC%9D%B4%ED%81%B4%EB%A6%BD%EC%8A%A4-%ED%81%B4%EB%A6%B0clean%EA%B8%B0%EB%8A%A5)

이클립스에서 톰캣을 사용하는 경우에도 분명 실행되어야 하는 코드가 에러를 발생시킬 때,

구동 서버에서 프로젝트를 삭제하고 다시 실행시키자. (servers > project 우클릭, remove)

 **E001** ,Dynamic Web project
 --- 
 
 에러내용 - The superclass "javax.servlet.http.HttpServlet" was not found on the Java Build Path

 빌드패스에서 서블릿클래스가 없어졌다!
 
 이럴 땐, Project > properties > Project Facet 에서, Runtime 탭에 들어간다.

WAS, 서버 Runtime을 잘 설정해준다. (J2EE, Apache 서버에 체크해줌)

- 추측) 서블릿관련 클래스들은, 아파치서버에 있거나, J2EE라는 WAS에 존재하는 듯 하다. (너무 당연한 추측이다.)

<br><br>

**E002** Eclipse 서버구동 타임아웃 에러

---

"Starting Tomcat v*.0 Server at localhost' has encountered a problem.
Server Tomcat v*.0 Server at localhost was unable to start within 45 seconds. If the server requires more time, try increasing the timeout in the server editor.

* 아파치-톰캣 서버를 런타임으로 설정하면, 기본 타임아웃 세팅이 45초로 지정되어있음.

* 시작하는데 45초까진 안걸렸는데 오류를 출력하고 서버시작 실패

해결 - 서버탭 의 해당서버 우클릭 > open > 서버 설정창 내에서, timeout 탭 > strat timeout 시간을 늘려준다.


**E003** Server Tomcat vX.X Server at localhost failed to start 에러

---

>Server Tomcat v*.* Server at localhost failed to start

대화상자에는 저렇게만 표시되고 아무런 오류메시지가 없음

해결방법 

1. JRE 설정
2. 유일한 URL Mapping 사용
3. tomcat 자체 실행확인
4. Project-Java Build Path 의 Server Library[tomcat 버전] 설치

<h1><a name="spring">Spring</a></h1>
---
<br>
<h1><a name="maven">Maven</a></h1>
---

**E001** java.lang.ClassNotFoundException : org.springframework.web.servlet.DispatcherServlet 

pom.xml에 의존성 추가 후, Maven Library 탭에서도 (org.springframework.web.servlet.DispatcherServlet)의 존재가 확인되지만, 런타임에서 해당 클래스 로딩 오류 발생! 

해결 방법   [링크](https://crunchify.com/how-to-fix-java-lang-classnotfoundexception-org-springframework-web-servlet-dispatcherservlet-exception-spring-mvc-tomcat-and-404-error/)

* project 우클릭 > properties
* Deployment Assembly 탭 
* add.. 버튼
* Java BuildPath Entries 선택
* maven dependency 추가 후 적용
<br>


**E002** Maven Unknown

git에서 spring 프로젝트를 clone했는데 pom.xml에서 에러발생. 

에러로그를 확인 : Unknown..... 구글링 결과

```xml
<maven-jar-plugin.version>3.1.1</maven-jar-plugin.version>
```

properties context에 위 문구를 추가해주면 에러가 지워진다.

<h1><a name="Java">Java</a></h1>
---

**E001** Description	Resource	Path	Location	Type
Java compiler level does not match the version of the installed Java project facet.	MySchool		Unknown	Faceted Project Problem (Java Version Mismatch)

해결방법

project > properties > project facet에서의 자바 버전과,

project > properties > java compiler 에서의 자바 버전을 동일하게 설정해주자.

<br>

<h1><a name="git">Git</a></h1>
---
<br>

<h1><a name="python">Python</a></h1>
---
<br>

<h1><a name="blog">Jekyll/Blog</a></h1>
---
<br>

```
lib/bundler/runtime.rb:319:in `check_for_activated_spec!': 
You have already activated addressable 2.5.2, 
but your Gemfile requires addressable 2.4.0. Prepending `bundle exec` 
to your command may solve this.
```

테마 변경을 위해, 해당테마에서 jekyll build 수행 시 위와 같은 에러 발생.

prepending bundle exec, 즉, 수행구문 앞에 bundle exec 붙여주면 해결됨

__해결방법__

> bundle exec jekyll build

> bundle exec jekyll serve
