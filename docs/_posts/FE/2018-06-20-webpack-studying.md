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


## NPM(부록)
* 아는 범위라 스킵

## Webpack Entry(시작점)

* webpack으로 묶은 모든 라이브러리들을 로딩할 시작점 지정

* bundle.js로 bundle

* 1개 이상의 entrypoint지정

### entry kind
```
entry: 'filepath'

entry: {
  app: 'app', // 앱 로직용
  vendors: 'thirdparty library path' // 한번만 빌드하면 되는것을 하기위해 분리
}
//페이지 별로
entry: {
  pageOne:
  pageTwo: ,
  pageThree
}


module.exports = {
  entry: {
    profile: 'fil',
    Feed: ''
  },
  output: {
    path: 'folder path'
    filename: '[name].js' // 위에 지정한 entry 키의 이름에 맞춰서 결과 산출
  }
}
```

## Webpack Output

* output의 위치와 이름 설정

```
var path = require('path');

output: {
  filename: '[name].js', // naming by entry name
  filename: '[hash].js', // webpack build에 따른 output 파일명 생성
  filename: '[chunckhash].js' // naming by chunk, recommand (why? 추적이 쉽다.)
}

// 문자열을 합치는 기능만 한다.
path.join('/foo', 'bar', 'baz/asdf');

// resolve는 오른쪽에서 왼쪽으로 파일 위치를 구성해가며 유효한 위치를 찾는다.
//값이 유효하지 않다면, 현재디렉토리 사용한다, 반환되는 URL은 절대주소
// 안전한 주소를 정하기위해 사용한다.
path.resolve();
```

## Webpack Loader

* 파일별로 특정 동작을 실행하도록 한다.
* 웹 자원들을 js로 변환하여 로딩
* 모든 자원들을 모듈로 사용하기위해 로더를 사용한다.
```
 module.exports = {
   entry: {
   },
   output: {
   },
   module: {
     rules: [
      { test: /\.css$/ , use: ['style-loader', 'css-loader'] },
      { test: /backbone/,
        use: ['expose-loader?Backbone', 'import-loader?_=underscore, jquery']}
        // 오른쪽부터 왼쪽순이라서 jquery 다음 underscore 임포트
     ]
   }
 }
```

### Babel Loader - ES6
: presets, 제공하는 플러그인등을  포함
```
module: {
  rules: [
    {
      test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015, 'react', {modules: false}] }
          }
        ]
    } //tree shaking: 쓰지않으면 추가하지않는다.
  ]
}

// in .bablerc, preset은 바깥으로 뺄수있다.
{
  "presets": ["react", "es2015"]
}
```

### code splitting practice


## What is plugin ?
* 추가적으로 커스텀 기능을 추가히가 위해서.

* 로더는 번들링 할때, 플러그인은 결과를 낼 때 작용

(loader를 활용한 기능 이외에, css를 바깥으로 빼는 등과 같은 기능 등 다른 기능)
```
module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin() // 자바에서 어글리파이 제공
  ]
}
```

## what kind of plugin is it?

### provide plubins
* 라이브러리에 전역변수 개념으로 살정
```
  new webpack.ProvidePlugin({
      $: "jquery"
    })
```

### definePlugin

* Webpack 번들링을 시작하는 시점에 사용 가능한 상수들을 정의한다.

* 일반적으로 개발계, 데스트계에 따라 다른설정을 적용할 때 유용(환경을 나눌때 환경변수 설정시인듯)

```
  new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("5dkmfdo"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object")
```

### manifestPlugin

  * 번들링시 생성되는 코드에 대한 정보를 json 파일로 저장하여 관리
  * 의존성 관리를 위해서 사용한다고 보면 된다.
```
  new ManifestPlugin({
      fileName: 'manifest.json',
      basePath: './dist/'
  })

```
