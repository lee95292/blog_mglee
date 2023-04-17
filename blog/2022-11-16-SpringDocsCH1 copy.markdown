---
layout: post
title:  "Spring Framework의 IoC와 Bean이란"
date:   "2022-11-17"
category: "tech"
tags: ["spring framework", "IoC", "Bean"]
---

본 글은  [Link: Spring 공식문서에서 1절](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-introduction)을 읽고 궁금한점을 찾아보며 정리한 글입니다.

* 1.1  Introduction to the Spring IoC Container and Beans 
* 1.2  Container Overview
* 1.3  Bean Overview   
...and so on


# Spring IoC Container와 ApplicationContext
IoC, Inversion of Control은 직역하면 제어의 역전이라는 뜻을 가지고있으며, Spring의 주요 특징 중 하나입니다. 

IoC의 예시로, Dependency Injection(DI)를 들 수 있는데요, 런타임 시점의 의존관계는 의존 대상 인스턴스가 아니라 컨테이너나 팩토리가 결정하며, 클래스 모델이나 코드에는 런타임 시점의 의존관계가 드러나지 않기 때문에,  (DI의 경우) 의존성 설정에 대한 제어권이 역전된 모습이라 해 제어의 역전이라고 합니다.

 **org.springframework.beans** 와 **org.springframework.context** 패키지는 Spring IoC컨테이너의 근간이 되는 패키지입니다.  
 그 중에서도, **org.springframework.beans.factory**패키지의 **BeanFactory** 인터페이스는 모든 타입의 객체에 고급 설정을 구성할 수 있는 메커니즘을 제공합니다. 

![IoCContainer drawio (1)](https://user-images.githubusercontent.com/30853787/202149288-44e3789f-9fd7-4eaf-b5d3-4221be5c9e3d.png)


 **BeanFactory** 하위 인터페이스인 **ApplicationContext**가 제공하는 기능입니다.
 
 * Spring AOP 통합

* 메시지 리소스 국제화

* 이벤트 생성

* **WebApplicationContext**같은 애플리케이션 레이어 컨텍스트 제공

간단히 말하자면, **BeanFactory** 는 Spring 기본 기능과 설정 기능을 제공하고, **ApplicationContext**는 enterprise application에 특화된 기능을 제공합니다. **ApplicationContext**가 기능적으로 **BeanFactory**를 모두 포함하기때문에, 위에서 설명한 추가기능을 사용하기 위해서 기본적으로 **ApplicationContext**를 사용하는게 좋습니다. 

Spring에서는 애플리케이션의 중추를 담당하고 IoC컨테이너가 관리하는 객체를 빈(bean)이라고 합니다. 빈은 애플리케이션의 일반적인 객체와 달리, IoC 컨테이너에 의해 조합되거나 관리되는 객체이고, 컨테이너가 사용하는 설정 메타데이터에 의해 반영됩니다. (groovy script, xml파일이나 annotation 등)


# IoC Container에 대해서


**org.springframework.context.ApplicationContext** 인터페이스는 스프링의 IoC 컨테이너를 나타내고, 빈의 인스턴스화, 설정, 조합(instantiating, configuring, assembling)을 담당합니다. 즉, (IoC)컨테이너는 설정 메타정보를 읽으며 어떤 객체를 인스턴스화할지, 설정할지, 조합할지에 대한 명령어를 읽어들입니다. 설정 메타데이터는 XML, Java annotations, Java code에 존재합니다. 

기존에 많은 경우에 XML을 통해 설정을 해왔지만, XML 코드를 추가해 Java annotation을 통해 설정할 수 있도록 합니다.

```xml
<context : component-scan base-package="com.sample"/>

```

위와같은 설정파일을 추가하면 **@Component, @Repository, @Service, @Controller, @RestController, @Configuration**를 base-package에서 찾아 빈으로 등록합니다.


![img](https://docs.spring.io/spring-framework/docs/current/reference/html/images/container-magic.png)

위 그림은 IoC 컨테이너가 어떤 동작을 하는지에 대한 간단한 과정입니다. 컨테이너는 비즈니스 로직을 포함한 POJO 객체와 설정 메타데이터를 로드해 실행가능한 애플리케이션을 생산해냅니다. 

이때, Business Object뒤에 POJO 객체라고 정확히 지칭한부분이 재미있습니다. 직접 의존성을 로드해 개발했을 때 객체가 무거워지고 결합도가 높아지는 단점이 생겼고, 의존성 라이브러리를 결합해서 사용할 수 있도록 IoC의 개념 중 하나인 DI가 생겨났기 때문입니다. POJO라고 특정지어서 말하는 부분은 이 부분을 강조하는듯 합니다.

단적인 예로, 이전에는 JDBC드라이버를 직접 로드해서 커넥션을 맺고 끊는 로직을 직접 구현했다면, 최근에는 JPA나 MyBatis등의 라이브러리, 심지어 JDBC API까지도 XML설정 또는 애너테이션을 통해 DAO 빈을 생성하면 POJO만으로도 비즈니스 로직을 구현해낼 수 있게 되었고, 결합도가 낮아져 리팩토링이나 확장에 들어가는 작업량이 현저히 줄었습니다. 


### Configuration Metadata
그림에서 컨테이너가 설정 메타데이터를 사용하는 부분을 확인했습니다. 설정 메타데이터는 컨테이너에게 Bean이 무엇이고 어떻게 인스턴스화하고 조립할지에 대해 알려주는 정보입니다. 이 정보를 쓰는 방법을 간단하게만 알아보겠습니다. 

> 참고로, 스프링 설정 메타데이터를 작성하는 방법은 몇가지가 있으나, 작성하는 포멧 형식은 컨테이너와 분할되어있으므로, 어떤 형식으로 작성하는지는 중요하지 않습니다. 

-  XML: **beans**라는 루트 엘리먼트 하위에 **bean** 엘리먼트를 선언하는 방식
- Java: **@Configuration** 애너테이션을 가진 클래스 하위에 **@Bean**애너테이션을 가진 메서드를 선언하는 방식

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

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

PetStoreService service = context.getBean("petStore", PetStoreService.class);

List<String> userList = service.getUsernameList();
```

또한 앞서 언급했듯 빈들은 BeanFactory를 상속한 **ApplicationContext**에 의해 관리되므로, 위같은 방법으로  인스턴스화된 빈들을 가져올 수 있습니다. 하지만 비즈니스로직에서 이같이 선언적 방법으로 빈을 로드하는것은 권장하지 않는 방법입니다.

# Bean에 대해서

아래 내용은 [1.3 Bean Overview](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition) 및 [1.The IoC Container](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)에서 원문으로 확인할 수 있습니다.
 
### Bean의 생성과정

* Bean을 생성하기 위해 [XML,Java,Groovy]로 이뤄진 Configuration Metadata(설정 메타데이터)를 작성합니다. 

* 컨테이너는 설정 메타데이터를 통해 **패키지가 포함된 클래스명** **동작 구성요소(생명주기, 콜백,스코프 등)** **다른 Bean 의존성**, **Bean 설정(property)**를 **XML,Java,Groovy BeanDefinitionReader**를 통해 **BeanDefinition**으로 구성합니다. 

* **BeanDefinition은** 아래와 같은 정보를 포함하게 되며, 결과적으로 컨테이너는 설정파일을 어떤 형식으로 구성해도 **BeanDefinition**이라는 일관된 객체를 불러올 수 있습니다. 공식문서에서는 BeanDefinition객체를 '레시피'라고 표현합니다. 여러개의 Bean 인스턴스를 생성해도 같은 객체를 생성할 수 있도록 합니다.


### BeanDefinition의 구성요소와 Bean의 특징

* Class: 인스턴스화할 빈 클래스. Java Config의 경우 Return Class의 패키지경로+클래스이름, XML Config의 경우 class 프로퍼티로 자동 지정되며, 필수값입니다.

* Name: Bean을 하나로 구분할 수 있도록 하는 식별자. XML의 경우 id, name프로퍼티를 사용해 IoC Container가 지정합니다. Java의 경우, @Bean프로퍼티가 붙은 메서드의 이름으로 지정됩니다. 

```java
//(Class, Id, Name 적용 예시)
@Configuration
public class AppConfig{
    @Bean
    public CouponService couponService(){
        return new CouponService()
    }
}
```

```xml
<beans>
    <bean id="couponService" class="com.demo.service.CouponService">
</beans>
```

* Scope: singleton, prototype, session, request 등 Bean을 생성하는 방법과 생명주기에 관련된 요소입니다.

* Constructor arguments: 생성자 인자들입니다. 생성자를 통해서 Bean 의존성을 설정할 수 있습니다.

* Properties: Bean에 저장되는 속성값입니다.(JDBC의 경우 max-pool등의 것들)

* Autowiring mode: 

* Late initialization mode

* Initialization method

* Destruction  method


### Bean 의 scope

앞서 말했듯, scope는 Bean의 생성방법이나 생명주기를 나타내는 요소입니다. BeanDefinition에서 scope라는 구성을 제공하므로서 Bean을 생성하고 Java Class계층에서 자신의 생성방법을 정의하지 않아도 되고, 생성/소멸에 관련된 부분에 대해 이미 정해진 방법으로 동작할 수 있도록 합니다.

**singleton**: 기본값이며, 하나의 빈 인스턴스가 공유됩니다. 컨테이너는 여러번의 생성 요청에도 하나의 특정 빈 인스턴스만을 리턴하기때문에, 하나의 BeanDefinition에 하나의 Bean 인스턴스를 갖습니다.

![img_singleton](https://docs.spring.io/spring-framework/docs/current/reference/html/images/singleton.png)

**prototype**: 싱글톤과 달리, 모든 요청에 대해 Bean을 인스턴스화하므로, == 연산자 비교(레퍼런스 비교) 시 false를 반환합니다. **또한 prototype으로 생성된 bean instance들은 spring container의 관리대상이 아니므로, 사용을 완료한 prototype bean은 직접 자원을 해제하거나 lifecycle callback등을 이용해 자원을 해제해야 합니다.**


![img_prototype](https://docs.spring.io/spring-framework/docs/6.0.3-SNAPSHOT/reference/html/images/prototype.png)

<Singleton과 Prototype Bean 비교>

JPA같이 EntityManager를 통해 데이터를 관리하는 경우, 이를 prototype bean으로 설정하는 경우, 매번 새로운 EM을 반환합니다. 이런 경우, singleton으로 빈을 생성해야 합니다. 

유저 정보를 저장하는 Bean이 있다고 가정하면, singleton으로 생성하는 경우 동시성 문제 또는 초기화 문제로 잘못된 데이터를 사용할 걱정이 있습니다. 이런 경우 prototype 빈을 생성해야 합니다.


아래의 request, session, application, socket scope는 Spring framework의 ApplicationContext아래에서만 사용할 수 있는 scope입니다.

**request**: HTTP 단일 요청과 같은 생명주기를 갖는 BeanDefinition. 각각의 요청이 하나의 Bean 인스턴스를 갖게됩니다.

**session**: HTTP Session과 같은 생명주기를 갖습니다. 


**application**: ServletContext와 같은 생명주기를 갖습니다.


**websocket**: Websocket과 같은 생명주기를 갖습니다.



# 후기
Spring은 추상화가 정말 잘 되어있는 프레임워크라 개인적으로 공부할때 의문이 생기는게 많았는데, 오히려 자세히 설명된 글을 읽으니까 더 재밌네요. 다음으론 추상화 끝판왕 AOP부분에 대해 살펴볼듯 싶습니다.

Spring의 IoC, Bean을 공부하며 이 개념으로 뭔갈 할 수 있겠다 라는 생각보다는 이미 숨쉬듯 사용하던 코드들이 
내부적으로 어떻게 동작하는지 공부한 느낌이었습니다! Bean과 관련된 에러는 이제 조금 친숙하지 않을까 생각합니다.
