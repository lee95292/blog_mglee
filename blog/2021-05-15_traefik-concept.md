---
date: "2021-05-15"
title: "Traefik: 오픈소스 네트워크 게이트웨이"
category: howto
tags: ['traefik', 'opensource']
banner: "/assets/bg/2.jpg"
---

# Traefik 

리버스 프록시 및 로드밸런싱을 제공하는 오픈소스 소프트웨어.  
tyk나 nginx와 비교할 수 있음


**Edge Router**라는 표현을 사용한다.  
즉, 서버의 가장 말단에서 들어오는 모든 요청을 인터셉트하여 라우팅하는 역할을 한다는 의미

**Auto Service Discovery**를 제공한다. 정적으로 설정파일을 읽어 라우팅하는 다른 리버스 프록시들과 달리, 실시간으로 설정 수정과 반영이 가능하다는 의미.


도커에서 사용 시, traefik과 다른 컨테이너가 같은 네트워크에서 동작해야한다. 따라서 아래의 nasa-img search 앱의 network를 설정해준다. 

[docker-compose에서 network 설정 문서](https://docs.docker.com/compose/compose-file/compose-file-v3/#network-configuration-reference)

```yaml
#https://pages.wiserain.com/articles/deploying-guacamole-using-docker/
version: "3.7"

services:
  sample:
    # container_name: nasa-imagesearch
    networks:
      bridgenet: {}
    image: httpd:latest
    volumes:
      - "./build:/usr/local/apache2/htdocs"
    labels:
      - traefik.http.routers.sample.rule=Host(`nasa-imgs.mglee.dev`)
networks:
  bridgenet:
    external: true
    name: traefik_default
```
 
## HTTPS(ssl) setting

https://doc.traefik.io/traefik/https/acme/ 번역
https://github.com/cedrichopf/traefik-dockerized#lets-encrypt

### Certificate Resolvers : 인증 리졸버

ACME 서버에서 인증서를 가져오기 위해서, Traefik의 **static 설정 파일에** Certificate Resolver를 정의해야한다.

Router에서 TLS를 허용해준 뒤, tls.certresolver 설정 옵션을 통해 Certificate Resolver에 할당해주어야 한다.  

인증서들은 dynamic configuration으로부터 가져온 도메인 이름을 요청받는다.  

### Domain Definition

Certificate Resolvers들은 아래 로직으로부터 라우터에 의해 추려진, 도메인 이름의 집합에 대한 인증서를 요청한다.

- 만약 라우터가 tls.domains 옵션 집합을 가지고있다면, 라우터의 도메인 이름을 찾기 위해 certificate resolver는 tls.domains 아래의 main(또는 sans)옵션을 사용한다.

- 만약 라우터가 tls.domains옵션이 없다면, certificate resolver는 Host() matcher를 체크해 router의 규칙을 사용한다.  

++
traefik 컨테이너를 restart하는 경우 아래와 같은 에러가 발생했다.
내부적으로, 재시작하는 과정에서 네트워크가 사용이 꼬인듯 했다.
docker stop을 먼저 해주고, 잠시 뒤 docker start 해주면 에러 없이 실행되었다.

```
time="2021-04-05T13:51:58Z" level=error msg="accept tcp [::]:80: use of closed network connection" entryPointName=http
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=http
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=http
time="2021-04-05T13:51:58Z" level=error msg="accept tcp [::]:443: use of closed network connection" entryPointName=https
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=https
time="2021-04-05T13:51:58Z" level=error msg="accept tcp [::]:8080: use of closed network connection" entryPointName=traefik
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=traefik
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=https
time="2021-04-05T13:51:58Z" level=error msg="Error while starting server: http: Server closed" entryPointName=traefik
time="2021-04-05T13:51:58Z" level=error msg="close tcp [::]:8080: use of closed network connection" entryPointName=traefik
time="2021-04-05T13:51:58Z" level=error msg="close tcp [::]:443: use of closed network connection" entryPointName=https
time="2021-04-05T13:51:58Z" level=error msg="close tcp [::]:80: use of closed network connection" entryPointName=http

```

# Reference
traefik concepts - https://doc.traefik.io/traefik/providers/overview/#orchestrators  
traefik setup at docker - https://doc.traefik.io/traefik/providers/docker/  
traefik setup at k8s ingress(Router) -   
traefik setup ssl - https://doc.traefik.io/traefik/https/acme/
k8s ingress - https://kubernetes.io/ko/docs/concepts/services-networking/ingress/