---
layout: post
title: "[Javascript Function] call, apply, bind 메서드"
date: "2020-08-14"
category: javascript
---

## Intro

여기 링크에서도 자세한 설명을 확인할 수 있습니다.

- [함수의 메소드와 arguments: 제로초님 블로그](https://www.zerocho.com/category/JavaScript/post/57433645a48729787807c3fd)
- [자바스크립트 this 바인딩 우선순위 : 김정환님 블로그](http://jeonghwan-kim.github.io/2017/10/22/js-context-binding.html)

Function.prototype의 call, apply, bind 메서드,
공부를 해도 사용시에 헷갈릴때가 많아서 정리합니다..!

## call, apply

Call과 Assign은 함수에 객체를 바인딩 후 호출하는 방법입니다.

Javascript에서는 함수 역시 객체이므로, 함수 객체 내에서 call, apply, bind 메서드 역시 객체의 프로퍼티 메서드로 가지고있습니다.

따라서 **myFunction.call()**, **myFunction.bind()**와 같은 형태로 호출해서 사용하지만, 그 역할은 **myFunction()**과 비슷합니다.

예시)

```javascript
const myMethod = (arg1, arg2, arg3) => {
  this.attr = "my attr";
  console.log(this.attr, arg1, arg2, arg3);
};

myMethod.call(null, 1, 2, 3);
myMethod.apply(null, [1, 2, 4]);
myMethod(1, 2, 5);

//result
// myattr 1 2 3
// myattr 1 2 4
// myattr 1,2,5
```

예시와 결과로 알 수 있듯, call(null, arg, arg2, arg)와 apply(null, [arg1, arg2, arg3])은 메서드 호출의 역할을 함을 알 수 있습니다.

그렇다면 첫 번째 인자는 어떤 역할을 수행할까요?

바로 this 객체를 바인딩 역할을 수행합니다.

예시는 어떻게 출력될까요?

```javascript
const myObj = {
  attr: "myattr",
  log: function () {
    console.log(this.attr);
  },
};

myObj.log.call({ attr: "your attr" }, 1, 2, 3);
```

너무 티나는 예시때문에 알 수 있듯 아래와 같이 출력됩니다.

your attr 1 2 3

myMethod.call의 첫 번째 인자가 실행 컨텍스트를 바꿨기 때문이죠.

```javascript
const va = "globalValue";
const myObj = {
  va: "asd",
  log: function myFunc2(a) {
    const va = "lexicalSocpe";
    console.log(va); //(1)
    console.log(this.va); //(2)
  },
};

myObj.log.call({ va: "callValue" }, "arg");
```

이건 본문과는 관련성이 떨어지지만 조금 헷갈리는 예제네요~

(1): Lexical scope에 의해 "lexicalSocpe"가 출력됩니다.

- 함수가 실행될 때, 변수 참조 체인은 Call Stack이 아닌 Lexical stack에서 참조된다는 의미입니다.

(2): call함수가 this를 교체했으므로, "callValue"가 출력됩니다.

- myFunc.call에서, myFunc.va = "callValue"로 교체해 실행합니다.

## bind

Function.prototype.bind는 apply, call과 조금 다릅니다,

apply, call 은 bind + execute였다면, bind는 메서드와 오브젝트를 바인딩합니다.

```javascript
myObj = {
  va: "value",
  log: function () {
    console.log(this.va);
  },
};

const binded = myObj.log.bind({ va: "binded value" });

binded(); // result: bindex value
```

이렇게 this가 바뀌는 것은, new 키워드에서도 확인할 수 있습니다.

```javascript
function Persion(name, age) {
  this.age = age;
  this.name = name;
  introduce: () => console.log(this.name, this.age);
}

const myeonggyu = new Person("mklee", 23);
myeonggyu.introduce(); // mklee 23
```

!! 글을 작성하다가 알게되었는데, 위 예시의 log선언부를 익명함수로 고치면 this.attr이 undefinded가 출력됩니다. 익명함수는 무조건 this가 루트를 가르키는듯 합니다.

위에서 new를 이용해 this를 바인딩한것이 **new 바인딩**,

bind,call,apply를 통해 바인딩한것이 **명시적 바인딩**,

상위객체의 this값을 가지는 방법으로 바인딩되는것이 **암시적 바인딩입니다.**

결과적으로, 바인딩 우선순위는 **new > 명시적 > 암시적** 바인딩 순으로 결합되며,

[자바스크립트 this 바인딩 우선순위 : 김정환님 블로그](http://jeonghwan-kim.github.io/2017/10/22/js-context-binding.html)에 잘 설명되어있습니다.

## Close

사용되는것이 종종 보이긴 하지만, 볼때마다 헷갈려서 학습하곤 합니다. 관련 내용을 찾아가다 보면 Javascript동작구조에 대한 재미있는 글들이 많이 보이니, 위 글에서 얻은 키워드를 바탕으로 더 찾아보시면 도움될것 같습니다.
