---
layout : post
title : "React.js 기초 튜터리얼, 개념 편 [1]"
date : "2019-09-12"
category: react
---

> [React.js 기초 튜터리얼](https://ko.reactjs.org)을 학습하며 작성하는 글입니다. 오류가 있을 수 있으며, 이메일을 통한 오류 수정 환영합니다.


# JSX
---

```javascript
const element = <h1> hello </h1>
```

위와 같은 문법으로 JSX를 작성한다. 

JSX는 Javascript의 String도 아니고, HTML역시 아닌데, JSX는 **React Element**를 생성하고, DOM에 렌더링한다. 

### React.js의 컴포넌트
---

```javascript
const name = 'mklee'
const element = <h1>hello, {name}</h1>;

ReactDOM.render(
    element,
    document.gelElementById('root')
);
```

JSX의 중괄호 안에는 모든 Javascript 표현식이 들어갈 수 있다.

부연설명 -  이는 React의 컴포넌트가 로직과 뷰를 분리하지 않는다는 특성과 관련있다. 컴포넌트는 엘리먼트를 포함하는 개념으로만 알고있자.

(참고로, JSX는 뷰와 로직이 섞여있기는 하지만, Javascript에 더 가깝기에, Camelcase 변수 표기법을 사용한다.)

* JSX 예제

```javascript
const element =(
<div>
    <img src={user.profileURL}/>
</div>);
```

이처럼,
* Attribute에도 Javascript 표현식이 들어갈 수 있고, 
* 자식으로 JSX를 포함할 수도 있다.
* 인터프리터 언어 특성 상, 줄바꿈 시 자동 세미콜론이 등록되므로, 엘리먼트 범위를 소괄호로 묶어주거나 한 줄에 작성하도록 하자.

# React의 엘리먼트 렌더링
---

앞의 예제에서 살펴보았듯,  **ReactDOM.render(element,,target)**를 통해 엘리먼트를 렌더링한다.

### 렌더링된 엘리먼트 업데이트

React의 엘리먼트는 불변객체(const로 선언)이므로, 이것의 내용을 변경할 수 없다.

하지만, 새로운 Element를 생성하고 이를 렌더링하는 방식으로 극복할 수 있다.

```javascript
function tick(){
    const element = (
        <h1>it's {new Date().toLocaleTimeString()} </h1>
    );
    ReactDOM.render(element,document.getElementById('root'));
}

setInterval(tick,1000)
```
참고 - 이후에 배우는 개념을 학습하면...

유상태 컴포넌트(엘리먼트 변경이 있는 컴포넌트)는 대부분 한번의 rㅣender하는 방식으로 작성할 수 있다.
ReactDom은 변경이 필요한 경우에만 업데이트를 수행한다.


# Component와 Props
---

UI를 분리하여 재사용 가능하도록 하는 React의 유닛을 컴포넌트라고 한다.

또한, 속성을 나타내는 props 객체를 통해 결과를 표현합니다.

컴포넌트 선언 시, 이름의 첫글자는 대문자입니다(컨벤션).

* 함수 컴포넌트

```javascript
function Welcome(props){
    return <h1>Hello, {props.name}</h1>
}
```

props객체를 인자로 받아 React 앨리먼트를 반환하는 Javascript 함수를 유효한 함수 컴포넌트라고 합니다.

* 클래스 컴포넌트

```javascript
Class Welcome extends React.Component{
    render(){
        return <h1>hello, {this.props.name}</h1>;
    }
}
```

* 응용 - 사용자 정의 컴포넌트로 엘리먼트 생성

```javascript
const element = <Welcome name="mklee"/>
```

### 컴포넌트 렌더링


```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

# State와 LifeCycle
---

위쪽 파트에서 작성한 시계 코드를 리팩토링 해보자.

* 기존 코드

```javascript
function tick(){
    const element = (
        <h1>it's {new Date().toLocaleTimeString()} </h1>
    );
    ReactDOM.render(element,document.getElementById('root'));
}

setInterval(tick,1000)
```

UI를 업데이트하기 위해 ReactDOM.render()를 호출해주었는데, state 개념을 활용해 효율적인 코드를 작성한다.

* 컴포넌트로 분리하기

```javascript
function Clock(props){
    return (
        <h1>it's props.date.toLocaleTimeString()</h1>
    );
}

function tick(){
    ReactDOM.render(
        <Clock date={new Date()}/>,
        document.getElementById('root')
    );
}

setInterval(tick,1000);
```

위 코드의 문제점
* 한번의 실행이 업데이트를 수행하지 않음

해결방법?
* state를 사용하자 
* state는 props와 유사한 개념
* props와 달리 비공개 객체

코드 수정하기
* 우선, 함수 컴포넌트를 클래스 컴포넌트로 전환하고
* render()의 리턴으로 해당 JSX를 추가
* 생성자를 아래와 같이 작성하고, status를 초기화해주기
* React의 컴포넌트 생명주기 메서드인 componentDidMount(), componentDidMount()를 작성해 시계가 랜더링될 때와 언마운트 될때의 수행코드 작성
* 매 초 status를 변경해주는 tick함수 작성. (이 떄, status값의 수정은 setStatus를 통해서만 갱신된다)

```javascript
Class Clock extends React.Component{   
    constructor(props){     
        super(props);
        this.state={date:new Date()};
    }

    componentDidMount(){
        this.timerID=setInterval(()=> this.tick(),1000);
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    tick(){
        this.setState({date:new Date()})
    }
    render(){
        return <h1>it's {this.props.state.date.toLocaleTimeString()}</h1>;
    }
}

ReactDOM.render(
    <Clock />,
    document.getElementById('root')
);
```
실행과정
* **ReactDOM.render()**의 Clock 컴포넌트의 생성자를 호출하고 status 초기화됨.
* **Clock의 render()**가 호출된다. 이제부터 React에서 화면에 표시될 내용과 Clock의 렌더링 출력을 비교해 DOM을 업데이트한다.
* DOM이 업데이트 된 이후, componentDidMount() (마운트 동작)를 호출하고, 매 초 tick()함수를 호출하며, tick()함수에서는 status를 새로운 날짜로 갱신합니다. 
* 만약 Clock 컴포넌트가 삭제된다면, clearInterval을 통해 타이머가 중지됩니다.
  