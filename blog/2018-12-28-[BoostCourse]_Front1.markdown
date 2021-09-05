---
layout : post
title : "[BoostCourse] PJ1. 프론트엔드 강의 정리"
date : "2018-12-27"
category: boostcourse
---


# CSS 1227 수강내용
---
<br><br>
### 선언방법
---
선언방법에는, 

* 태그 속성으로 지정해주는 **inline**방법,

* style 태그 내에 지정해주는 **internal** 방법,

* 외부 파일을 link 태그로 연결해주어 지정하는 **external**방법이 있습니다.

선언방법 간 , **우선순위** 는 다음과 같습니다.

**inline > (internal = external)** 

인라인 코드가 가장 높은 우선순위를 갖고,  그렇지 않은 경우 나중에 선언된 코드가 높은 우선순위를 갖습니다.
<br><br>
### 상속과 우선순위 결정
---
1. 상위 태그에서 적용한 스타일은 하위에서도 반영(상속).

2. but, Box-Model이라 불리는 속성들(width, height, margin, padding, border)은, 배치관련 속성이므로 상속되지 않음.

3. id > class > 엘리먼트(태그) 순서로 우선순위를 가짐.

```
#a{
 color : red;
}

.b{
 color : blue;
}

div{
 color : green;
}
```

위와 같은 경우, **<div class="b" id="a"> color</div>**의 색상은 **red**로 결정됨. 이러한 성질을 Cascading, 캐스캐이이딩 이라 부른다.

4. 선언 방식에 따라, 표현이 구체적인 선택자가 적용된다. 만약 선택자가 같을 경우, 나중에 선언한 것이 적용된다.

body>span (0)

span(x)

### color 속성 지정
---
1. 색상의 이름으로 지정

> color : red

(또는 magenta, green,orange, cyan, black, white 등등,,)


2. 16진수로 RGB 조정, 가장 많이 사용되는 방법

> color : #ffa024

3. rgba를 소괄호로 지정

> color : rgb(255, 0, 0, 0.5)

<br><br>
### 폰트
---
<br>
>font-size : 16px

>font-size :2em    

**em**은 상대적인 값, 상속받은 픽셀의 2배를 뜻함

<br>

>font-family : monospace, sans-serif, Gulim 

코마(,)를 기준으로 순서대로 브라우저가 지원하는 폰트를 적용.

<br><br>
### CSS의 레이아웃 속성들
---

CSS가 엘리먼트의 효과적인 배치를 위해 제공하는 속성들

1. display 속성 : block, inline, inline-block

---
	>block : 벽돌처럼, **세로로 쌓이는** 속성. 대부분의 엘리먼트들이 block으로 설정되어 있다.

	>inlline : 엘리먼트가 **옆으로 흐르도록** 설정하는 속성. a, strong ,u 태그 등등.. 몇가지 안된다.

2. position 속성 : static, absolute, relative, fixed

---

엘리먼트가 기본적인 틀을 벗어난 배치를 제공하기 위해 존재.

* static 
> 기본값
	
* absolute
> **static이 아닌 기준 엘리먼트로부터 일정한 거리 떨어진 만큼 위치시킴**

* relative	
>  원래 있어야하는 위치를 기준으로 일정한 거리 떨어진 만큼 위치시킴

* fixed 	
>  viewport를 기준으로 엘리먼트 위치시킴. 따라다니는 광고같은 것.

3.float 속성 : left, right 속성
---
**다른 레이어**에 존재하는 느낌. 2단, 3단 컬럼 배치를 할 수 있다.

---
### float 


부모 엘리먼트의 속성에 <span class="bBorder">overflow : auto</span> 를 지정하여 float 설정된 엘리먼트를 자식으로 인식시킨다.

