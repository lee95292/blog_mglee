---
layout : post
title : "[BoostCourse] PJ2 Javascript 강의 정리"
date : "2019-02-18"
category: boostcourse
---

# javascript 수강내용

# 변수와 연산자

---
<br>
> 변수 선언 / 연산자 / Type 종류 / Type 확인

## 변수

변수의 선언은 **var, let, const** 키워드를 통해 선언할 수 있음.

각자 선언 방법에 따라 유효범위(scope)가 달라진다.

### 선언방법
---

* **var** - Function Scope, 함수 단위의 유효범위를 가진다.

  * **재선언**과 **재할당**이 가능하다.
  * 선언 예약어를 지정하지 않을 시, 기본으로 지정된다.
  * 즉, i =3 과  var i = 3은 같은 문장이다.

<br>

* **const** - Block Scope, 중괄호 단위의 유효범위를 가진다.
 
  * 재선언과 재할당이 불가능하다. 상수를 선언하는 키워드임

  * 즉, 값이 변경되지 않는다.

<br>

* **let** - Block Scope, 중괄호 단위의 유효범위를 가진다.

<br>

**scope는** 쉽게 말해, 변수가 지역변수가 될 수 있는 조건을 의미한다.

각각이 중괄호, 함수 내에 선언되면 지역변수가 되고, 그렇지 않으면 전역변수이다.

말은 이렇게 하지만, 정리하고있는 시점에서도 가끔씩 혼동이 온다..

let,var,const에 대해 [잘 정리된 링크](https://blog.hanumoka.net/2018/09/21/javascript-20180921-javascript-var-let-const/)를 참고하자.

## 연산자

---

사칙연산(+,-,/,*), 나머지연산, 삼항연산은 다른 프로그래밍 

언어와 동일하므로 생략

* 비교연산자

비교연산에는 ==보다 ===를 사용한다.

==으로 비교하는 경우, 좌항과 우항의 타입을 일치시킨 후 비교하고,

===으로 비교하는 경우, 좌항과 우항의 타입까지 고려하여 비교한다.

==으로 비교할 경우 고려하지 않은 결과로 인해 비교연산이 예측과 달라질 수 있다.

```javascript
var a = "1";
var b = 1;

a==b;       //true
a===b;      //false
```

## 반복 (제어문)

---

비교 및 반복문에는, if, switch, while, for(for-each, for-of, for-in), Label, do-while문 등이 있습니다. 

c언어 학습자 기준으로 생소한 문법들만 정리해보겠습니다.

* Label - 보통 루프를 식별하기 위해 사용합니다. 식별한 루프문들에 대해, break, continue문들을 사용할 수 있습니다.

```javascript
for(var a = 10; a>0; a--)
{
    innerLoop : 
    for(var b = 4; b<10; b++)
    {
        a=a+1;
        if(a<5)
            break innerLoop;       
    }
        console.log(a+b);
}

```

* for-in - 객체의 열거 속성을 통해 지정된 변수를 반복합니다.


# Window 객체(setTimeout)
---

전역객체(window)에 속한 메서드는, 경고창을 띄워주는 alert, setTimeout이라는 메서드들이 있다. 이를 통해 비동기방식을 알아본다.

> callback 함수란, 호출 즉시 실행되지 않거나 아예 실행되지 않을 수도 있는 함수이다. 호출한 대상(call)에서 되부름(callback)되기 때문에 callback이라고 부른다.

전역객체의 사용 

```javascript
window.setTimeout();
setTimeout();           //전역객체인 window 생략 가능
```

**나는 2초마다** **팝업** 알림창을 띄우는 프로그램을 작성해보았다.

```javascript
let i = 1;
function run()
{     
   setTimeout(function(){   //
        alert(i);
        i++;
    },2000);
}

for(v=0;v<10;v++){
run();
}
```

callback을 정확히 이해했다면, 이 코드는 작성자의 예상과 다르게 작동함을 알 수 있다.

**위 프로그램은 10회 run 함수를 호출함과 동시에 setTimeout메서드를 10회 호출하고,** 

2초뒤에 10개의 알림메시지를 수행하는 코드로 callback된다.

사실 2초에 한 번씩 알림을 호출하는 프로그램에는 콜백함수가 필요 없다

 (굳이 콜백을 써서 반복을 구현하려면, setInterval을 사용하면 된다고 한다.)

 <br>

# DOM과 querySelector 

 ---

 HTML의 구조와 데이터를 이해하고, javascript로 이를 변경하는 방법에 대해 이해하기

* 브라우저는 HTML 코드를 DOM이라는 객체 형태의 모델로 저장한다. (DOM tree)

> 부연설명 - 태그 요소의 아이디, 클래스, 텍스트 등의 정보를 트리형태의 객체(Object)로 저장한다는 의미

//관련 이미지 추가

<br>

### javascript의 DOM API
---

DOM, 즉 페이지 정보를 트리형태의 객체로 저장한 데이터에서

일일이 javascript로 원하는 데이터를 추출하는 알고리즘을 짜는 것은 매우 복잡하다.

이에 javascript에서는 DOM API를 제공한다.

* .getElementById() - id 기반으로 정보를 찾습니다. 마찬가지로 Class나 Tag의 이름으로 찾는것도 가능

 * Element.querySelector() - css의 selector를 기반으로 질의(query)합니다.

<br>

# 브라우저 이벤트
---

사용자로 인해 발생하는 많은 이벤트들은, 마우스 클릭, 스크롤, 이동 등등 여러 경우에 발생합니다.(키보드 등 다른 입력장치의 경우에도 마찬가지)

이러한 이벤트 발생 정보를 통해 새로운 이벤트를 등록 할 수 있습니다.

* 이벤트 등록 표준 방법

```javascript
var se = document.querySelector(.gogo);     //DOM 오브젝트 지정
se.addEventListener("click",function(evt){
    console.log(evt.target+": ouch");
})
```
<br>

# AJAX

---

AJAX는 단일 기술에 대한 내용이 아니라, 웹에서 데이터를 갱신할 때, 브라우저 새로고침 없이 비동기적으로 컨텐츠를 변경시킬 때 사용하는 모든 기술을 의미합니다. 

기본 예제코드
```javascript
var oReq=new XMLHttpRequest();
oReq.addEventListener("load",function(){
    console.log(this.responseText);
});
oReq.open("GET","https://www.exampleurl.com/example.html?data=data");    
oReq.send(null);

```
XMLHttpRequest의 메서드 (oReq에서 사용된 메서드)

open(TYPE, URL, ASYNC) - 요청객체의 커넥션을 생성

* TYPE : get,post같은 요청 메서드
* URL : 요청을 처리할 서버 URL
* ASYNC : 비동기 -true, 동기 - false

send(DATA) - 서버로 요청을 전송
* DATA : 요청 전송 시 HTTP의 body에 담길 데이터 전송. get요청이므로 null이 들어감. 

<br>

---

-끝
