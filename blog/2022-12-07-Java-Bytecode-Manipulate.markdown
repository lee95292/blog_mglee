<!-- ---
layout: post
title:  "Spring Autowired는 어떻게 동작할까?"
date:   "2022-11-17"
category: "spring framework"
---

본 글은 Spring Framework에서 @Autowired이나 Lombok의 Annotation Processor에서 바이트코드 조작을 통한 애너테이션이 어떻게 동작하는지 원리에 대한 궁금증 해결을 목표로 합니다

호수 위의 백조처럼 마법처럼 사용했던 코드들이 Spring과 같은 프레임워크들이 어떤 발짓을 통해 우아하게 구현해냈는지 알아보려 합니다.

Java의 `바이트코드 조작`과 `리플랙션`, `프록시` 등에 대해 다룹니다.  -->