---
layout : post
title : "[BoostCourse] PJ3 FrontEnd 강의 정리 -1"
date : "2019-03-26"
category: boostcourse
---

### javascript 배열

---

* 선언 : new Array()를 통해서 가능하지만, 보통 a = [] 처럼 간단히 선언

* 모든 데이터타입이 들어갈 수 있다. (객체, 함수, null 등등 )

```javascript
sa=[4];
a[100]=4;
console.log(a.length);      // 101 출력
```

### javascript 배열의 유용한 메서드들

---

```javascript
a=[];
```

* push - a.push(10); //a=[10], 배열에 순차적으로 원소 삽입,pop도 있음

* indexof - a.indexof(10);  // =0, 특정원소가 존재하는 인덱스 반환. 

* concat - a=a.concat(1,2,3) //a=[1,2,3,10] 배열에 원소 이어붙임, (이어붙인 배열을 반환).

* join - a=a.join() // ="1,2,3,10" 배열을 문자열로 합친 후 반환.

> join,concat같은 경우, 실행시 배열의 내용이 직접 바뀌지 않고, 수행된 값을 반환하는 작업만을 함에 유의하자.

**배열탐색**

* foreach(function(v,i)) : v,i를 각각 value, index에 파싱하여 function에 해당하는 내용 루프돌며 실행한다.

* map(function(v,i)) :  function의 리턴값들의 배열을 리턴합니다.

```javascirpt
var newArr = ["apple","tomato"].map(function(value, index) {
   return index + "번째 과일은 " + value + "입니다";
});
console.log(newArr)     //문자열 배열로 리턴
```

### javascript 객체

---

* key, value로 이루어진 js의 대표적인  자료구조 .(온점)을 통해 접근.

* ,(콤마)를 통해 속성을 구분, :(콜론) 을 통해 키/벨류를 바인딩.

* for-in 문을 사용하여 순회.

* Object.keys() - 오브젝트의 키로 이루어진 배열 반환 

>Object.keys()로도 객체 순회 가능

```javascript
obj = {'a':123, 'b':"myName"};

Object.keys(obj).forEach(function(value){
    console.log(obj[value]);
    });
```

* 객체의 속성 추가는 접근방법과 같다.

* 속성 제거에는 delete 키워드를 통해 가능하다.

``` javascript
obj["name"]="mleek";    //name 속성 생성

delete obj.name;        //name속성 제거
```
<br>

**실습 1.**

---

[링크](https://gist.github.com/nigayo/ade2c3f74417fc202c8097214c965f27) 에서, 숫자타입의 키값들만 출력하기.

``` javascript
function findTypeKeys(v,type){
    for(key in v){
        if(typeof(v[key])=="object"){
            findTypeKeys(v[key],type);
        }else if(typeof(v[key])==type){
            console.log(key);
        }
    }
}
findTypeKeys(data,"number");

```
<br>

**실습 2.**

---


[링크](https://gist.github.com/nigayo/a9a118977f82780441db664d6785efe3) 에서, "type"키 값이 "sk"인것의 name 출력하기 

``` javascript
function findPropAttr (v){
    for(key in v){
        if(typeof(v[key])=="object"){
            findPropAttr(v[key]);
        }
        if(key=="type"&&v[key]=="sk"){
            console.log(v["name"]);
        }
    }
}
```

### DOM Node 조작하기 (DOM API)

---

[Document노드_API](https://www.w3schools.com/jsref/dom_obj_document.asp)

[Elements노드_API](https://www.w3schools.com/jsref/dom_obj_all.asp)

DOM 엘리먼트 속성

 * tagName : 엘리먼트 태그명 변환
 * textContent

 ### DOM API로 Node 조작 실습

 ---

 실습 1.
 지금 나온 DOM API를 사용해서, strawberry 아래에 새로운 과일을 하나 더 추가하시오.

추가 된 이후에는 다시 삭제하시오.

<img src="/assets/img/boostcourse/pr01.JPG">

```javascript
var list  = document.querySelector('ul');

var addNode= document.createElement('li');
var textNode = document.createTextNode('pineapple');
addNode.appendChild(textNode);
list.appendChild(addNode);
setTimeout(function(){
  list.removeChild(addNode);
},1000);

```

노드 생성 후, setTimeout 메서드를 통해 1초 후 지우는 동작 수행

---

실습2 & 실습 3

insertBefore메서드를 사용해서, orange와  banana 사이에 새로운 과일을 추가하시오.

실습2를 insertAdjacentHTML메서드를 사용해서, orange와 banana 사이에 새로운 과일을 추가하시오.

<img src="/assets/img/boostcourse/pr023.JPG">

```javascript
var fruitNode = document.createElement('li');
var fruitText = document.createTextNode('water mellon');
fruitNode.appendChild(fruitText);

var list = document.querySelector('ul');
list.insertBefore(fruitNode,list.childNodes[4]);

fruitNode.insertAdjacentHTML('afterend','orange');
```

참고링크 
[insertBefore_Docuemnt](https://developer.mozilla.org/ko/docs/Web/API/Node/insertBefore)

[insertAdjacentHTML_Document](https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML)

---


실습4

apple을 grape 와 strawberry 사이로 옮기시오.

<img src="/assets/img/boostcourse/pr04.JPG">

```javascript
var list = document.querySelector('ul');

var app = list.childNodes[1];
var grp = list.childNodes[9];
list.removeChild(app);
list.insertBefore(app,grp);
```

---

실습5

class 가 'red'인 노드만 삭제하시오.

<img src="/assets/img/boostcourse/pr05.JPG">

```javascript
var list= document.querySelector('ul');
var rm = document.querySelectorAll('ul>li.red');

rm.forEach(function(v){
  list.removeChild(v);
});
```

---

실습6

section 태그의 자손 중에 blue라는 클래스를 가지고 있는 노드가 있다면, 그 하위에 있는 h2 노드를 삭제하시오.

<img src="/assets/img/boostcourse/pr06.JPG">

```javascript
var sec = document.querySelectorAll('section');

sec.forEach(function(v){
  var blueNode = v.querySelectorAll('.blue');
  console.log(blueNode.length);
  if(blueNode.length>0){
    v.querySelectorAll('h2').forEach(function(v){
      v.remove();
    })
  }
})
```