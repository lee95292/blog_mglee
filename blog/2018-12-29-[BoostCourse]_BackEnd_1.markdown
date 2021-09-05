---
layout : post
title : "[BoostCourse] PJ1. 백엔드 강의 정리"
date : "2018-12-28"
category: boostcourse
---


# Dynamic Web Project 프로젝트 Hello world 작성하기
---
<br>
(프로젝트 생성)
> File > new > Other  > Dynamic WebProject 선택

> 프로젝트 이름 지정 및 Target Runtime 지정 (WAS:톰캣 설치디렉터리 지정)

<br>


### Hellow Servlet 작성
---
1.project에서 new > servlet 으로 서블릿 생성.

doGet메서드에 다음과 같이 작성

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("text/html;charset=UTF-8");
                 //response 데이터의 meta정보 지정

		PrintWriter out = response.getWriter();
		
		out.print("<h1>한글 테스트, hello! servlet</h1><br>"
			+LocalDate.now().toString()+"<br>"+LocalTime.now().toString());	
	}
```
//관련이미지 추가
<br><br>

# 자바 웹 어플리케이션과 서블릿에 관해서..

---
<br><br>
### - 자바 웹 어플리케이션
---
<br>
* 자바 웹 어플리케이션이란, WAS에 배치(desploy)되어 동작하는 애플리케이션이다.

* 자바 웹 어플리케이션에는 HTML, CSS, Image, Java Class, Setting 등등을 저장한 파이들이 포함된다.

* 특히, 톰캣에서는 <span class="bBorder">**web.xml**</span> 파일이 <span class="bBorder">**배치 기술자**</span> 라고 불리며, 중요한 설정들이 저장된다.

* Servlet3.0 미만에서는 필수적으로 존재해야 하지만, 3.0 이후 버전에서는 **어노테이션**을 사용한다.

(but Spring에서는 다른 설정들을 저장하기 위해 사용한다.)

<br>
#### - 서블릿
---
<br>
* 자바 웹 어플리케이션 내에서, 동적인 처리를하는 프로그램의 역할.

* WAS 내에서 동작하며, HttpServlet클래스를 상속받는 JAVA 클래스.

* JSP가 <span class="bBorder">View</span> 역할을 맡는다면, 서블릿은 <span class="bBorder">Controller</span> 역할


<br>
#### - 서블릿의 라이프사이클
---
* 클라이언트가 서버에게 요청.

* URL을 받아, URL Mapping에 해당하는 서블릿 존재여부 검증.

##### (여기서의 검증이란, 서블릿이 메모리에 올라가있는지 판단하는 것. 서블릿은 하나의 객체만이 메모리에 올라가기 때문에, 서버 구동 이후 Init 과정이 한 번만 실행됨)
* 검증 후, 서블릿이 생성되지 않았다면, init 과정을 수행하고, service 과정 수행 

* 생성되어있는 경우, 바로 service 과정 수행.

* **서버를 종료**시키는 경우 destroy 과정 수행.

* 또는, 서블릿이 **수정된** 경우, 메모리에서 servlet을 제거해야 하므로, destroy 과정 수행.

<br><br>
#### - 서블릿의 구현
---
<br>

서블릿은 HttpServlet클래스를 상속받는다. 

이후 필요에 따라 메서드를 오버라이딩을 통해 구현한다. 

이와 같은 디자인패턴을 [템플릿 메서드 패턴](https://terms.naver.com/entry.nhn?docId=3532974&cid=58528&categoryId=58528) 이라고 한다.

<br><br>
#### Request, Response 객체 이해하기
---

*서블릿의 동작..*

WAS는 브라우저로부터 요청을 받으면, HttpServletRequest객체를 생성합니다. 이후 이 객체에게 요청에 관한 정보들을 전부 저장해줍니다.

*HttpServletRequest*

* http프로토콜의 요청정보를 서블릿에게 전달하기 위한 목적
* 헤더정보 / 파라미터 / 쿠키 / URI / URL 등의 정보를 읽어들이는 메서드를 가지고 있다.
* Body의 Stream을 읽어들이는 메서드를 가지고 있다. (이해가 잘 안돼서, 질문글 남김) 

*HttpServletResponse*
* 응답을 보내기 위해 해당 객체를 생성합니다.
* 서블릿은 해당 객체를 사용해, content type 이나, 응답코드, 응답 메시지들을 전송해줍니다.

<br><br><br>
#### - 요청 정보의 종류들 알아내기
---
<br>
```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException {

		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
				
		Enumeration<String> headers =  request.getHeaderNames();
		
		while(headers.hasMoreElements())
		{
			String headerName =headers.nextElement();
			String headerValue = request.getHeader(headerName);
			out.print(headerName+" : "+headerValue+"<br>");
		}
		out.close();
	}

``` 

HttpServletRequest 객체에 있는 헤더정보를 모두 출력해주는 코드입니다.

헤더란, HTTP 프로토콜 메시지의 맨 앞에서, 클라이언트의 정보 또는 메시지의 형태를 알려주는 역할을 하는 HTTP 메시지의 구성요소.
<br><br><br>

#### - 요청 정보의 파라미터들을 알아내기
---
<br>

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException {

		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();

		out.print("______________Parameter 정보_______________<br>");
		
		Enumeration<String> paramNames = request.getParameterNames();
		
		while(paramNames.hasMoreElements())
		{
			String paramName = paramNames.nextElement();
			String paramValue = request.getParameter(paramName);
			out.println(paramName+" : "+paramValue+"<br>");
		}
		

		out.close();
	}
```

HttpServletRequest 객체에 있는 파라미터정보를 모두 출력해주는 코드입니다.

이 떄, get을 통해 전달되는 파라미터는, 위 사진처럼 URL을 통해 전달할 수도 있으며, html의 form 태그를 통해서도 전달가능.

<br><br>

---
<br>
**-끝-**