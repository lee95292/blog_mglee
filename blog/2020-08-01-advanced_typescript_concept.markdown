---
layout: post
title: "타입스크립트 핵심 Concepts! (번역)"
date: "2020-08-01"
category: tech
tags: ['typescript', 'javascript'] 
---

> 본문은 [Typescript 핵심 개념](https://www.educative.io/blog/advanced-typescript-concepts) 을 번역(+ 개인적인 의견 추가)한 글입니다.

> OOP에 대한 기본 지식이 있으신 분은 [Learn Typescript in Y minutes](https://learnxinyminutes.com/docs/typescript/)또는 [MS 공식 DOCS](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)에서 문법만 훑어보시면 좋습니다.

---

타입스크립트를 접했을때 드는 느낌은 OOP + Compile + javascript => typescript로 요약할 수 있겠습니다.

typechecking, OOP개념이 분명하지 않은 Javscript(이하 JS)의 단점을 커버하는 언어입니다.

실제로 typechecking을 하지 않음으로 인해 발생하는 런타임에러는 꽤 큰 골칫거리기에 , typechekcing, compilable한 typescript의 개념이 아주 매력적입니다.

그리고 javascript에 익숙하다면 학습난이도도 높지 않은듯 합니다.

_(통번역입니다. 오역주의) Lets go!_

---

자바스크립트를 사용할 때, 디버깅은 많은 개발자들의 골칫거리입니다! 프로그램을 실행하고, 버그를 찾고 고치기를 반복합니다. 디버깅을 시작한지 몇시간 뒤에야 마침내 버그를 고치곤 합니다. 이러한 문제는 자바스크립트같이 컴파일을 하지 않는 언어(인터프리터 언어)의 공통적인 특징입니다.

_python 역시 타입체킹을 하지 않는 인터프리터 언어인데 디버깅이나 런타임 에러 문제에 대해 논의하는것을 보지 못했네요.. 왜 그럴까요..?_

이런 자바스크립트의 단점을 고치기 위해 Microsoft는 Typescript를 만들어냅니다. 거대한 팀들이 Typescript의 장점을 깨닫고 그들의 기술스택에 적용하면서, 많은 개발자들이 이를 학습하게 되었습니다!

- Typescript란?
- Strict types 소개
- Typescript와 OOP(객체지향 프로그래밍)
- Typescript의 타입들
- 그 외 알아야하는 것들

## Typescript란?

Microsoft가 만들고 관리하는, javascript의 모집합(superset)으로, 모든 자바스크립트 코드는 Typescript에서 유효하다는 특징을 가지고있습니다.

```
즉, JS로 할 수 있는건, TS로 할 수 있다는 뜻.
```

TS는 아래 두개의 핵심 개념에 초점을 맞춘 Application 규모(대규모) 개발을 위한 Javascript입니다.

- 현재버전 이후의 자바스크립트 엔진의 기능을 현재 자바스크립트 엔진에서 제공

- Javascript에서 type system 제공

Typescript의 구성요소는

1. 기본적으로 javascript와 추가적인 특징/문법들로 이루어진 Typescript 자체 문법과,
2. Typescript 코드를 javascript 코드로 변환해주는 컴파일러,
3. Compiler 파이프라인의 끝에서 에디터같은 기능을 제공하는 Language service가 있습니다.

(3번기능은 지금으로서 어떤 기능인지 와닿지 않네요.)

Typescript를 사용하는 이유!

- 타입체킹 : MS나 Google같은 거대한 팀들이 Typescript의 정적 타입 체크가 개발 프로세스 간소화에 있어 유용함을 알아냈습니다.

- 객채지향 프로그래밍 : Typescript는 인터페이스, 상속, 클래스 등의 객체지향 프로그래밍 개념을 지원합니다.

- 컴파일 : Typescript는 인터프리팅 언어인 JS와 달리 컴파일을 지원하며, 이는 여러분 코드의 컴파일 에러를 찾아주고, 디버깅을 간편하게 해줍니다.

Typescript 설치

```bash
> npm install -g typescript
```

compile

```bash
> tsc hellowrold.ts
```

npm을 사용하지 않는다면, [링크](https://www.typescriptlang.org/#download-links)에서 typescript패키지를 다운받을 수 있습니다.

## Typescript의 장점과 한계

### 타입체킹

Javascript는 동적으로 타입을 체킹하는 언어로, 오직 런타임에서만 에러를 찾을 수 있음을 의미합니다. 이것은 복잡한 프로젝트를 진행하는 큰 팀에게 거대한 단점으로, 코드에 대한 모든 실수를 미리 찾는 방법이 더 수월합니다.

Typescript는 선택적(optional) 정적 타입체킹을 제공하므로, 변수는 타입을 바꿀 수 없으며, 특정 값만을 받을 수 있습니다. 이를 통해 Typescript 컴파일러가 에러가 발생하기 쉬운 코드에서 더 많은 버그를 잡을 수 있도록 합니다. 또한 타입은 가독성있고 쉽게 리팩토링하기 위한 구조를 만듭니다.

Typescript와 Javacsript의 차이점을 보고싶다면 [여기](https://www.typescriptlang.org/#download-links)로!

### IDE 지원

Typescript가 정적 타입체킹을 지원하므로, 코드 에디터 또는 IDE에서 더 많은 이점을 가질 수 있다.

1. 자동완성( Javascript의 변수는 type이 존재하지 않으므로, 변수에 대한 자동완성을 지원하지 않는다. 지원하더라도, 에디터 또는 IDE는 변수의 타입을 모르기에, 적절한 메서드명이나 애트리뷰트 명을 자동완성할 수 없음),
2. [code navigation](https://visualstudio.microsoft.com/ko/services/rich-code-navigation/),
3. type에 의한 Error flagging

이런 IDE에서의 기능 지원은, Tpyescript로 작성해야하는 코드량이 Javascript보다 많더라도, 생산성 경쟁력에 많은 부분을 기여하고 있다.

Typescrpt3를 지원하는 인기있는 IDE들

- MS Visual Studio
- Webstorm
- Visual Studio Code
- Atom

### Browser 호환성

브라우저 호환성은 Typescript의 강력한 특징중 하나입니다. Typescript는 모든 모던 브라우저와 호환 가능한 코드로 Typescript 코드를 컴파일합니다. 이런 높은 호환성이 가능한 이유는, Typescript코드를 모든 기기와 플랫폼, 브라우저를 지원하는 vanilla JS(순수 Javscript)로 컴파일할 수 있기 때문에 가능합니다.

Typescript를 사용하며 얻는 많은 장점이 있음에도, 이것은 완벽한 솔루션은 아닙니다.

---

코드 가독성을 높히는 것에 있어 하나의 단점은, VanillaJS를 사용할 때와 비교해 Typescript를 사용할때는 가독성있는 코드를 위해 더 많은 코드를 써야하고,
이는 잠재적으로 여러분의 개발 시간을 증가시킵니다.

---
