---
layout: post
title: "[blog] Git Hosting을 통한 Jekyll 블로그 관리"
date: "2018-12-22"
category: blog
---



이번 포스팅은 메모용도로 작성된 포스팅으로, 로컬 PC에 jekyll 소프트웨어, git page 호스팅 및 저장소 생성 등의 작업이 끝난 상태를 기준으로 합니다. 

깃허브 블로그에 포스트를 추가하는 방법, 레이아웃, 웹로그 분석 등 블로그 관리에 관한 글을 기록하는 용도입니다.

또한 추가된 개인적인 설정에 관한 설명이 들어있습니다.

### 0. 설치, 추가기능 구현을 위한 mark

저는 Windows Subsystem for Linux(wsl) 환경에서, ruby를 설치하여 진행했습니다.

[참고링크](http://jekyllrb-ko.github.io/docs/installation/#ubuntu)

후에 추가기능을 adapt하기 위해 

* __important --> 강조표시 CSS 추가
### 1. 기본 커밋(포스팅)
---

* 로컬에서 변경된 내용들을 _site 디렉터리로 빌드합니다.
```
jekyll build

```
* 저의 사이트를 호스팅하고 있는 git repository에 project/_site 디렉터리가 변경된 사항을 적용해줍니다.
```
git add .
git commit -m "first commit" 
git push origin master
```
### 2. 지킬 프로젝트 변경사항 적용
---
<br>
변경된 설정들을 적용하여 _site 디렉터리를 빌드합니다.

```
```
### 3. 추가된 설정

1_ 글자 테두리 CSS
```css
<style>
 .rBorder {
       border: 1px solid #990066;
       padding: 2px;
       border-radius: 0.3em 0.3em 0.3em 0.3em;
     }
 .bBorder{
       border: 1px solid #7ad1db;
       padding: 2px;
       border-radius: 0.3em 0.3em 0.3em 0.3em;
 }
</style>
```
### 오류
---
가끔씩 날짜를 현재 시각보다 늦은 시간이나 비슷한 시각으로 설정하여 포스팅 할 경우, 포스트가 올라가지 않는 오류 발생.

원인 모름.