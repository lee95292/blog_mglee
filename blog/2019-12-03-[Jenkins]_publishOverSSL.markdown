---
layout : post
title : "[Jenkins] 젠킨스 원격 배포 (CD) 수행하기"
date : "2019-12-03"
category: howto
---

젠킨스 서버에서 CI된 결과물을 원격 서버에 CD하기.


선결조건
* 젠킨스 구동 중
* CI(빌드) 세팅 완료

원리
* publish over ssh 플러그인 사용
* scp를 통해 배포파일 (spring의 경우는 **.jar) 전송
* ssh를 통해 배포파일 실행(서버 가동스크립트)

### Jenkins on use -1 : 사전  설정 (원격지 등록)

* **Jenkins > Jenkins관리 > 시스템 설정화면**

<img src="/assets/img/jenkins/jenkins_001.PNG">


*아래쪽 publish over ssh 탭 작성*

Key 탭 - 원격지에 접근하기 위한 키 작성

SSH Servers탭 - 배포파일을 전송할 원격지
* Name - 구분을 위한 이름
* hostname - 호스트 주소
* username - 연결을 위한 유저 이름


왼쪽 아래 저장버튼을 눌러 원격지 등록 완료! 


### Jenkins on use -2 : 프로젝트 빌드(CI) 이후 원격지로 실제 배포하기

* **각자 프로젝트  선택 > 구성 > Build탭의 add build step > send files or execute commands over SSH**
<img src="/assets/img/jenkins/jenkins_002.PNG">

* **접속 이후 수행동작 작성하기**
<img src="/assets/img/jenkins/jenkins_003.PNG">

### 항목들  설명
* SSH Server - Name - 사전 설정과정에서 등록한 서버의 이름
* Transfes
  * Source files : 젠킨스 서버에서 빌드 완료된 배포파일(전송할 배포파일)
  * Exec command : 배포파일 실행 명령

저장을 눌러 배포 설정 완료하고,

빌드 수행!
