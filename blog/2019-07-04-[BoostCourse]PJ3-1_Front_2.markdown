---
layout : post
title : "[BoostCourse] PJ3 FrontEnd 강의 정리 -2"
date : "2019-07-04"
category: boostcourse
---

### CSS와 Javascript에서의 Animation

---

* Animation?

반복적인 움직임의 처리! 간단하고 규칙적인 움직임은 CSS3의 transition, transform 속성으로 처리 가능하며, javascript보다 좋은 성능을 보장함.

* javascript Animation

복잡하고 정밀한 애니메이션을 표현하기 위해 주로 사용
 *  setInterval, setTimeout, requestAnimationFrame, Animations API 등을 활용할 수 있음

하지만, setInterval같은 경우 애니메이션 구현에 사용되지 않음.
<img src="/assets/img/boostcourse/setinterval.png">
위 그림에서 설명하는 "지연문제" 때문인데, 부스트코스에서는 이를 "제 때 일어나야 할 이벤트 콜백이 지연/사라지는 현상"이라고 설명했음.

자세한 설명은 [Javascript_Event_Scheduling](https://javascript.info/settimeout-setinterval)에서 확인.

### Javascript의 requestAnimationFrame

---

위 상황처럼, setTimeout,setInterval은 애니매이션을 위해 최적화되지 않음. animation 주기가 16.6ms 미만으로 내려갈 경우, 불필요한 frame이 생기기 때문임.

이에 대한 대안으로 **requestAnimationFrame**이 탄생함.
사용법은 setTimeout과 크게 다르지 않은듯.

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .mynode{
            position:relative;
        }
    </style>
</head>
<body>
    <div class="mynode">
        testyest
    </div>
</body>
</html>
```

```javascript
let count =0;
let node = document.querySelector('.mynode');
node.style.left="0px";

function run(){
    if(count>40)return;
    
    count++;
    node.style.left=count+"px";
    requestAnimationFrame(run);
}

requestAnimationFrame(run);
```

### CSS3 transition

GPU 가속을 이용하는 CSS 속성들을 사용하면 
Javascript로 구현하는 것보다 더 빠르다고 알려짐!

* transform:translateXX();
* transform:scale();
* transform: rotate();
* opacity


transition 으로 변화시킬 속성과 변화 시간을 지정할 수 있음

transition [property] [duration] [timing-function] [delay]

```css
transform : scale(1);
transition : transform 2s
```
