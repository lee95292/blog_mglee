---
layout : post
title : "[Spring Boot,토막글] Spring boot 프로젝트에서 여러개의 설정파일 추가"
date : "2019-11-13"
category: spring
---

스프링에서 API Key 또는 비밀스러운 정보를 따로 관리해야 할 때(에를 들어 public git 시스템에 푸쉬), 역할에 따른 설정파일이 필요할 때는 application.yml 이외의 설정파일을 추가해야합니다.

이 떄, 스프링 부트에서 설정파일을 나누는 방법으로, 별도의 설정 없이 ***.yml파일 추가 후, 아래 코드와 같이 실행파일의 경로를 등록해주면 됩니다.

```java
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class JclipProtoApplication {
	private static final String APPLICATION=
											"spring.config.location="+
											"classpath:/application.yml,"+
											"classpath:/private.yml";

	public static void main(String[] args) {
		new SpringApplicationBuilder(JclipProtoApplication.class).properties(APPLICATION).run(args);
		
//		SpringApplication.run(JclipProtoApplication.class, args);
	}
```