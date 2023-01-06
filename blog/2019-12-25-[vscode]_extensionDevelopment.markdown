---
layout: post
title: "[vscode] vscode 확장 프로그램 환경 구성"
date: "2019-12-25"
category: howto
---

본 포스팅은, [VSCode extension development docs](https://code.visualstudio.com/api)를 학습하며 작성했습니다.

- git과 Node.js를 사전 설치 후에 진행해주시기 바랍니다.

## 1. 프로젝트 생성

```cmd
npm install -g yo generator-code
```

npm을 통해 위 두 개 모듈을 설치합니다.

- yo (yoman) -코드 스캐폴딩 도구 : 프로젝트 뼈대를 생성해주는 도구
- generator-code - vsocde ext 뼈대 코드

```
yo code
```

설치한 모듈을 통해 프로젝트 뼈대를 생성하고 커멘드라인에 정보를 알맞게 제공합니다 ( 프로젝트 이름 등등,,)

```
code ./[project_name]
```

F5버튼을 눌러 빌드하면, **Extension Development Host**가 동작합니다.

확장도구 테스팅 환경이라 보시면 될 듯 합니다.

- 개발환경에서 소스코드 저장 후, **Extension Development Host**에서 리로드(Ctrl + R)하면 변경사항이 저장됩니다.

## 2. Extension 세부정보

```
.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // Extension source code
├── package.json        // Extension manifest
├── tsconfig.json
```

yoman으로 뼈대를 생성하면 코드 구조는 위와 유사합니다.

이 때 ,확장 프로그램의 세부정보(Manifest)는 package.json에 위치합니다.

- **name,publisher** 는 프로젝트의 유니크한 아이디를 구성하는데 사용합니다.
- main은 extension 실행의 entry point를 가르킵니다. (프로젝트의 시작점)
