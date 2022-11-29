---
layout: post
title:  "Spring Framework의 IoC와 Bean"
date:   "2022-11-17"
category: "spring framework"
---

본 글은 Spring 공식문서 [https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-introduction](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-introduction)에서 1절을 읽고 궁금한점을 찾아보며 정리한 글입니다.

* 1.1  Introduction to the Spring IoC Container and Beans 
* 1.2  Container Overview
* 1.3  Bean Overview


# Spring Framework의 IoC와 Bean에 대해서
IoC, Inversion of Control은 직역하면 제어의 역전이라는 뜻을 가지고있으며, Spring의 주요 특징 중 하나입니다. 

IoC의 예시로, Dependency Injection(DI)를 들 수 있는데요, 런타임 시점의 의존관계는 의존 대상 인스턴스가 아니라 컨테이너나 팩토리가 결정하며, 클래스 모델이나 코드에는 런타임 시점의 의존관계가 드러나지 않기 때문에,  (DI의 경우) 의존성 설정에 대한 제어권이 역전된 모습이라 해 제어의 역전이라고 합니다.

 ```org.springframework.beans``` 와 ```org.springframework.context``` 패키지는 Spring IoC컨테이너의 근간이 되는 패키지입니다.  
 그 중에서도, ```org.springframework.beans.factory```패키지의 ```BeanFactory``` 인터페이스는 모든 타입의 객체에 고급 설정을 구성할 수 있는 메커니즘을 제공합니다. 

![IoCContainer drawio (1)](https://user-images.githubusercontent.com/30853787/202149288-44e3789f-9fd7-4eaf-b5d3-4221be5c9e3d.png)


 ```BeanFactory``` 의 하위 인터페이스인 ```ApplicationContext```가 제공하는 기능입니다.
 
 * Spring AOP 통합

* 메시지 리소스 국제화

* 이벤트 생성

* ```WebApplicationContext```같은 애플리케이션 레이어 컨텍스트 제공

간단히 말하자면, ```BeanFactory``` 는 Spring 기본 기능과 설정 기능을 제공하고, ```ApplicationContext```는 enterprise application에 특화된 기능을 제공합니다. ```ApplicationContext```가 기능적으로 ```BeanFactory```를 모두 포함하기때문에, 위에서 설명한 추가기능을 사용하기 위해서 기본적으로 ```ApplicationContext```를 사용하는게 좋습니다. 

Spring에서는 애플리케이션의 중추를 담당하고 IoC컨테이너가 관리하는 객체를 빈(bean)이라고 합니다. 빈은 애플리케이션의 일반적인 객체와 달리, IoC Container에 의해 조합되거나 관리되는 객체이고, 컨테이너가 사용하는 설정 메타데이터에 의해 반영됩니다. (groovy script, xml파일이나 annotation 등)


# IoC Container에 대해서

`org.springframework.context.ApplicationContext` 인터페이스는 스프링의 IoC 컨테이너를 나타내고, 빈의 인스턴스화, 설정, 조합(instantiating, configuring, assembling)을 담당합니다. 즉, (IoC)컨테이너는 설정 메타정보를 읽으며 어떤 객체를 인스턴스화할지, 설정할지, 조합할지에 대한 명령어를 읽어들입니다. 설정 메타정보는 XML, Java annotations, Java code에 존재합니다. 

XML을 통한 설정이 전통적인 방식이지만, 적은 XML 코드를 추가해 Java annotation을 통한 설정을 지원할 수 있습니다.

예를 들어, 아래와같은 설정파일을 추가하면 @Component, @Repository, @Service, @Controller, @RestController, @Configuration를 base-package에서 찾아 빈으로 등록합니다.
```xml
<context : component-scan base-package="com.sample"/>

```

![img](https://docs.spring.io/spring-framework/docs/current/reference/html/images/container-magic.png)

위 그림은 IoC 컨테이너가 어떤 동작을 하는지에 대한 간단한 과정입니다. IoC Container는 비즈니스 로직을 포함한 POJO 객체와 Configuration Metadata를 로드해 실행가능한 애플리케이션을 생산해냅니다. 

이때, Business Object뒤에 POJO 객체라고 정확히 지칭한부분이 재미있습니다. 직접 의존성을 로드해 개발했을 때 객체가 무거워지고 결합도가 높아지는 단점이 생겼고, 이를 해결하기 위해 IoC의 개념 중 하나인 DI가 생겨났기 때문입니다. 

단적인 예로, 이전에는 JDBC드라이버를 직접 로드해서 커넥션을 맺고 끊는 로직을 직접 구현했다면, 최근에는 JPA나 MyBatis등의 라이브러리들을 설정파일을 통해 로드하기만 하면 실제 POJO만으로도 비즈니스 로직을 구현해낼 수 있게 되었고, 결합도가 낮아져 리팩토링이나 확장에 들어가는 작업량이 현저히 줄었습니다. 


### Configuration Metadata
위 도면에서 IoC Container가 Configuration Metadata를 사용하는 부분을 확인했습니다. Configuration Metadata는 Container에게 Bean이 무엇이고 어떻게 인스턴스화하고 조립할지에 대해 알려주는 정보입니다. 이 정보를 쓰는 방법을 간단하게만 알아보겠습니다. 

> 참고로, 스프링 설정 메타데이터를 작성하는 방법은 몇가지가 있으나, 작성하는 포멧 형식은 컨테이너와 분할되어있으므로, 어떤 형식으로 작성하는지는 중요하지 않습니다. 

-  XML: `beans`라는 루트 엘리먼트 하위에 `bean` 엘리먼트를 선언하는 방식
- Java: `@Configuration` 애너테이션을 가진 클래스 하위에 `@Bean`애너테이션을 가진 메서드를 선언하는 방식

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

일반적인 XML설정 메타데이터는 위와 같이 구성합니다. bean의 id에는 빈을 유일하게 식별할 수 있는 id, class에는 빈에 해당하는 클래스명을 패키지까지 포함해 작성합니다.

import를 통해 다른 파일의 설정을 불러올 수 있습니다. resource, 경로에 해당하는 부분은 가급적 상대경로를 포함하지 않습니다. (애플리케이션 외부에 종속성이 생길 수 있기 때문)
