---
layout: post
title: "[VSCode 확장앱] 개발 contribute 개념 소개"
date: "2020-04-25"
category: vscode
---

# Introduce

- [VSCode 개발환경 구성](https://lee95292.github.io/boostcourse/2019/12/26/vscode-_extensionDevelopment.html)이 완료된 상태라고 가정하고, 제가 사용했던 VSCode Extension API를 소개합니다.

* 실제 사용 예시는 [ms 공식 샘플들](https://github.com/microsoft/vscode-extension-samples/)를 참고하시면 좋습니다.

---

Extension을 개발한다는 이야기는 , **contributes**를 통해 Command를 추가하거나 View를 개선 등등, 각각의 Context에 맞는 기능들을 개발한다는 이야기입니다.

실제로 extension 설명 페이지에서 **contributes** 라는 탭은 유저의 조작을 통해 실행할 수 있는 모든 포인트를 설명합니다.

## contribution points?

---

contribute는, VSCode UI 또는 컨텍스트에서 유저와 Extension 사이의 Interface역할을 합니다.

즉, 개발자는 Extension을 개발하기 전에 [모든 contributes](https://code.visualstudio.com/api/references/contribution-points#contributes)를 참고하고 적절한 contribution API를 사용해 extension을 구현해야합니다.

# Contribute의 종류

---

User와 IDE 사이에 상호작용을 위한 많은 Contribution point가 있습니다. 자주 사용되는 내용들을 설명하도록 하겠습니다.

## command

> vscode에서 명령 팔레트를 통해 실행하는 Command context입니다. 가장 많이 사용되는 contribute중 하나입니다.

```json
// 유저가 vscode "hello world" 커멘드를 실행시키면 extension.commandTest에 바인딩된 메서드 실행
"contributes":{
   "commands": [
      {
        "command": "extension.commandTest",
        "title": "hello world!"
      },
   ]
}
```

---

## menus

> editor, file treeview,context menu 등에 바인딩되는 contribute입니다.

아래는 에디터에서 우클릭 시 나타나는 메뉴에 대한 contribute입니다.  
확장자가 .java인 파일의 에디터에의 컨텍스트 메뉴에서 나타나며, 선택 시 extension.commandTest에 바인딩된 메서드가 실행됩니다.

```json
"contributes":{
    "editor/context": [
        {
          "command": "extension.commandTest",
          "when": "resourceExtname==.java"
        }
    ]
}
```

---

## configuration

### overview: vscode 또는 workspace의 설정에 해당하는 contribute입니다.

```js
vscode.workspace.getConfiguration("myExtension");
```

위처럼 extension 에서 불러와 값을 사용할 수도 있으며, 마찬가지로 vscode API를 통해 setting도 가능합니다.

<img src = "https://code.visualstudio.com/assets/api/references/contribution-points/configuration.png" 
width="50%"/>

<img src= "https://code.visualstudio.com/assets/api/references/contribution-points/settings-ui.png" width=
"50%" />

---

유저는 configuration key를 통해 key에 해당하는 value를 editor, UI, json 등에서 설정을 편집할 수 있도록 해줍니다.

### practical: 기본 세팅

```javascript
{
  "contributes": {
    "configuration": {
      "title": "TypeScript",
      "properties": {
        "typescript.useCodeSnippetsOnMethodSuggest": {
          "type": "boolean",
          "default": false,
          "description": "Complete functions with their parameter signature."
        },
        "typescript.tsdk": {
          "type": ["string", "null"],
          "default": null,
          "description": "Specifies the folder path containing the tsserver and lib*.d.ts files to use."
        }
      }
    }
  }
}
```

- **contribution > properties > [설정 KEY]**가 위치합니다.
  - 위의 예시에서는 _typescript.useCodeSnippetsOnMethodSuggest_, *typescript.tsdk*가 KEY로 등록되었습니다.
  - .(dot)을 기준으로 계층을 이룹니다.

설정의 메타정보는 아래와 같습니다.

- 설정의 메타정보로 들어가는 필드
  - type: 설정 값의 타입: boolean, string, number, null 등 javascript 변수가 들어간다.
  - scope: workspace, folder, user, window 설정의 적용 범위
  - default: 설정의 기본값. type과 일치해야한다.
  - enum: dropdown처럼

---

## language

> practical: 선언형 언어의 특징에 해당하는 아래 내용들을 컨트롤할 수 있는 API를 제공합니다.

(주로 특정 언어에서 사용되는 확장프로그램 개발 시 자주 사용됩니다)

- Comment toggling
- Brackets definition
- Autoclosing
- Autosurrounding
- Folding
- Word pattern
- Indentation Rules

---

### keybinding

> 단축키 관련 설정입니다.

<img src="https://code.visualstudio.com/assets/api/references/contribution-points/keybindings.png" />

---

### Closing

- 자주 사용되는 contribute를 간단하게 설명했습니다. contribution point에 대한 자세한 설명과 사용법은 [공식 페이지의 Contribution-point](https://code.visualstudio.com/api/references/contribution-points#contributes)를 참고하시면 됩니다.

- extension 개발을 위해 contribute와 바인딩되는 메서드들을 구현하기 위해서는 [공식 페이지의 VScode-API](https://code.visualstudio.com/api/references/vscode-api)를 참고해 개발하시면 됩니다.

더 많은 contributes API를 사용해보고 설명 업데이트 하겠습니다 :)
