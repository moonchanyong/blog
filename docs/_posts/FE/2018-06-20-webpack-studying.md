---
layout: post
title: 인프런 웹팩 공부
category: [ FE ]
tags: [ webpack, bundler ]
---

# 웹팩

* 보통 나는 cli를 통해서 사용

* 성능향상 및 구조를 위해서 권함

* webpack의 주요설정 Entry, Output, Loader, Plugins, Resolves


## 웹팩이란?

* 서로 연관 관계가 있는 웹 자원들을 js, css, img 와 같은 스태틱한 자원으로 변환해주는 모듈 번들러

**의존성있는 모듈 => webpack(module bundler) => static assets**

## 웹팩을 사용하는 이유와 배경

1. 새로운 형태의 Web Task Manager

* 기존 web Task Manager의 기능과 모듈 의존성 관리 가능 (gulp는 직접설정해서 자동화한거로 기억)

**모듈 의존성 관리가 장점인듯**

2. 자바스크립트 Code based Modules 관리

* 자바스크립트 모듈화의 필요성: AMD, commonjs, ES6(Modules)

* 기존 모듈 로더들과의 차이점: 모듈 간의 관계를 청크 단위로 나누어 필요할 때 로딩(lazy loading)

* 복잡한 웹 앱을 관리하기 위해 모듈단위로 관리하는 Common JS, AMD, ES6 Modules가 등장 (모듈단위 관리하는 thing)
    + 가독성이나 다수 모듈 미병행 처리등의 약점 보완하기 위해 Webpack이 등장

### JS module problem

* 파일단위 스코프를 가지지 않고, 같은 스코프를 가져서 문제가 생길 수 있다.

```html
<script src="module1.js"></script>
<script src="module2.js"></script>
<script src="library1.js"></script>
<script src="module3.js"></script>
```

* 위의 모듈로드 방식의 문제점: 전역변수 충돌, 스크립트 로딩 순서, 복잡도에 따른 관리상의 문제

* 이를 해결하기 위해 AMD 및 기타 모듈 로더들(requirejs), Webpack 이 등장

### 웹팩의 철학

1. Everything is Modules

* 모든 웹 자원(js, css, html)이 모듈 형태로 로딩 가능
```javascript
//로더
require('base.css');
require('main.js');
```

2. load only "what" you need and "when" you need (lazy loading)

* 초기에 불필요 한 것들을 모두 로딩하지 않고, 필요할때 필요한 것만 로딩하여 사용


## 개발환경

* webpack 4.0부터 cli를 설치해야한다고 한다.

* 설치는 이미 해놧다.
