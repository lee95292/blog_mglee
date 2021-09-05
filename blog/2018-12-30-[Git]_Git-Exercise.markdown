---
layout : post
title : "Git 명령어 예제 정리"
date : "2018-12-30"
category: git
---
Git 사용법을 정리하는 시간을 갖겠습니다.

기초적인 내용만을 정리하도록 하겠습니다.
#### 참고 및 연습 링크
---

* [지옥에서 온 Git](https://www.youtube.com/watch?v=hFJZwOfme6w&list=PLuHgQVnccGMA8iwZwrGyNXCGy2LAAsTXk) - egoing님 생활코딩Youtube


* [Git 연습용 웹페이지](https://learngitbranching.js.org/) - git 버전관리 상태를 시각적으로 보여줍니다.


# Starting a project & configuration
---
<br>
*starting a project*

* git init : 로컬 디렉터리에 깃 저장소를 생성

* git clone \[git path\]: 원격 저장소에 존재하는 깃허브 프로젝트를 가져옴 (복사)
<br><br><br>

*configuration*

유저 이름과 이메일 설정

* git config --global user.name \[myName\]

* git config --global user.email \[myEmail\]
<br><br><br>

# Git 을 통한 버전관리
---
<br>

* git status : commit 대기 상태의 stage area의 파일들을 출력

* git add fileName : git stage area에 관리할 파일 또는 디렉토리 등록

* git commit -m "commit message" : 현재 stage area의 파일들(add된 파일들)을 프로젝트 버전으로 적용시킨다. 


# 원격 저장소 생성 및 사용하기
---

> 원격 저장소(Remote Repository)란? 로컬 저장소(Local Repository)와 대비되는 개념으로, 협업을 위해 인터넷 상에 위치한 저장소를 의미한다.

* git remote add origin \[Path\] : 해당 경로에 존재하는 원격 저장소를 origin이라는 이름으로 설정.

>git remote -v 명령으로, 추가된 저장소 위치 확인 가능

* git stage에 소스코드를 등록하는 방법은, 로컬 저장소의 방법과 같다.

* git push origin master : master 브랜치로 git stage에 커밋된 소스코드들을 원격 저장소에 저장한다.

> master branch의 upstream

