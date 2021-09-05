---
layout: post
title: "[React] React 라우트 기초 사용법"
date: "2019-09-12"
category: react
---

> 간단한 기록용 포스트

공통적으로,

```javascript
import { Router, Link } from "react-router-dom";
```

### Route - path와 component 속성으로 설명해보자.

exact path와 일치하는 component를 보여준다. 즉,

```html
<Route exact path="/" component="{Home}" />
```

위의 경우 url상에서 루트 경로일 때, Home 컴포넌트를 보여주는 것.

즉, Route는 의미적(Semantic)인 컴포넌트이고, URL의 정보를 참조해서 뷰를 보여주는 역할을 수행한다.

(이 때, exact path가 아니라 path만을 사용한다면, path="/about" 인 설정의 경우, path="/" 과 path="/about"의 라우트까지 모두 보여준다.  
즉, exact하지 않는 매칭을 한다)

### Parameter

parameter는 url path 뒤에 콜론(:)을 붙여 입력받는다.

```html
import {Router} from 'react-router-dom'; ...
<Route path="/about/:name" component="{About}" />
```

(전달예시)

```
https://localhost:3000/about/mklee
```

위의 경우, 'mklee'가 About 컴포넌트에 파라미터로 사용한다.

이 때, About의 컴포넌트는 **const name=match.params.name** 과 같이 해당 값을 사용한다

### Link 컴포넌트를 통해 새로고침 없는 Router이동

```html
import {Link} from 'react-router-dom'
...

<Link to="/about"> About </Link>
```

a 태그를 통해 URL을 변경시키고 이동할 수도 있지만, 새로고침 없이 Link 컴포넌트를 통해 새로고침 없는 페이지전환이 가능하다.
