---
layout: post
title: Keep calm and use The platform
category: [ FE ]
tags: [ webComponenet, 웹 컴포넌트 ]
---

# 웹 컴포넌트 공부하기

[자료출처 NHNent](https://github.com/nhnent/fe.javascript/wiki/April-24---April-28,-2017);


## Keep calm and use The platform

침착하고 플랫폼을 이용해! => 플랫폼은 브라우저를 일컫는다.

현재는 프레임워크 전성시대. 제이쿼리를 선두로 앵귤러, 뷰, 리액트 등 여러 프레임워크가 웹시장을 점령하고있다. 하지만 프레임워크는 앱을 무겁게 만들고, 리소스를 사용자에게 전가 시키며, 프레임워크 종속적인 코드를 생산한다.

그리고 구글이 제시한 이러한 문제들의 해결방법은 Keep calm and use The platform. 문제를 프레임워크 대신 브라우저 기능을 사용하여 해결하면 프레임워크를 가볍게 마늗ㄹ어도 되고, 더 적은 자바스크립트 코드를 사용하게되어 표준 코드로 만든 성능 좋은 앱을 만든다.

가능을 표준으로 정하고 표준대로 코딩하자

## 웹 컴포넌트란

* 자바스크립트, CSS, HTML을 컴포넌트화 하기위해 필요한 4개의 표준을 묶어서 부르는 이름

## 커스텀 컴포넌트


W3C에서 Custom Elements 표준 서문은 이를 새로운 DOM Elements를 정의하고 사용하는 방법이라 말한다. -> HTML의 부족한부분을 직접 태그와 클래스의 연동으로..


### class js of custom component & js for manipulating dom

* 결론을 말하면 돔을 다루는 자바스크립트 코드는 자바스크립트가 엘리먼트를 다룬다(엘리먼트는 프로퍼티에 저장하고 조작해야할 3인칭 대상) =하지만> Custom Element는 클래스의 인스턴스 this가 엘리먼트 인스턴스이다. 엘리먼트의 라이프사이클을 맞추기위한 Mutation Observer가 필요없다.

#### custom element 등록하기

```
<!-- CustomElementRegistry에 명시한 태그와클래스를 묶는 역할을 한다. -->
window.customElements.defin('명시한 태그', class extends HTMLElement {});
```
#### custom element naming convention

* 예약된 키워드를 피하자
* '-'를 1개이상 포함하자

#### HTML Element의 상속과 constructor

* Custom Tag가 DOM에 추가 될 때 클래스의 constructor가 똑같이 동작한다.
* HTMLElement를 상속받은 Custom Elements의 constructor의 실행 시점은 아직 DOM에 추가되지 않은 상태이다. constructor 에서는 어떠한 DOM조작도 할 수 없다. 그러므로, 이곳에서는 DOM과 무관한 클래스 인스턴스 자체의 준비만 해야한다.
```javascript
// good
constructor(val) {

  super(); // 항상 맨 앞에!

  console.log('yey!'); // yey
  console.log(val); // val 출력
}

// bad
constructor() {
  super(); // 항상 맨 앞에!

  console.log(this.parentNode); // null
  console.log(this.firstChild); // null
  console.log(this.innerHTML); // ""
  console.log(this.getAttribute('locale')); // null
  this.setAttribute('locale', 'ko-KR'); // 에러: Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes
  this.innerText = 'Arr'; // 에러: Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children
}
```

#### connectCallback & disconnectedCallback

* (HTML Element를 상속받았을 경우)
  + connectedCallback: DOM에 추가 되었을때 =주의점> custom element가 DOM에 추가 될 때는 child element가 아직 DOM에 추가 되지 않아있다.(당연한건데 놓치기 쉬울 것 같다.) 그래서 자식 Element에 접근을 할 수 없다.
  + disconnectedCallback: DOM에서 제거 되었을때.

#### attributeChangedCallback & observedAttributes

* observedAttributes: 모니터링 할 속성 이름 추가

* attributeChangedCallback: 속성이 변경 되었을때 콜백

#### adoptedCallback

* 해당 엘리먼트가 다른 Document에서 옮겨져 올 때 수행 => document.adoptNode()가 이 Element를 대상으로 실행 되었을때.

#### upgrade

* CustomElements.define메서드를 통해 선언되지 않았지만 DOM에 있는 ELEment는 Span과 동작한다. 추후 Custom Elements.define을 통해 선언되면 주어진 클래스를 묶어주는 동작
* =왜> 이 동작은 DOMContentLoaded 이벤트를 보고 인스턴스 초기화 하는 이유와 마찬가지로, DOM이 생성된 이후, JS가 수행될 경우, DOM에 있는 Custom Elements는 스타일도 동작도 못가진 채로 화면에 노출 될 수있어서이다.

* 이를 극복하려면.. [defined pseudo](https://www.w3.org/TR/custom-elements/#selector-defined) 클래스를 사용하라고 한다
```css
  current-time:not(:defined) {
      display: hidden;
  }
```
#### childElement

* 부모엘리먼트가 생성돠었을때 child에 해당하는 작업을 수행하지 말고, ChildElement에서 DOM에 추가되었을때(connectedCallback) 부모 Element의 메소드를 실행시킨다.

#### break time Mutation observer
**[내가 모른다 Mutation Observer](https://developer.mozilla.org/ko/docs/Web/API/MutationObserver)**

* 개발자들에게 DOM 변경 감시를 제공한다.
* Mutation Events를 대체한다.

#### custom element 브라우저 지원

* can i use에서 확인해본 결과 기본적으로 지원은 안하지만 사용은 할 수 있는 곳이있다 IE는 지원안해서 현재는 polyfill로 지원한다고 한다.


## Shadow Dom

* HTML, css 에 OOP처럼 은닉이 가능하게한다. => 실제로 접근을 하지말고 속성을 통해서 엘리먼트의 상태 변화를 일으키자.
* 스코프를 나눈다.


* 장점: 스코프를 나누기, iframe대비 장점으로 http요청이 1번 줄고, 별도의 페이지가 아니라서 리소스가 낮고, 도메인이 아니어도 접근이 가능하다. + slot

* 라이트 돔 => slot에 삽입


# polymer3 분석하기

## 폴리머 스택을 가질까 말까 고민 중..
* 긍정적 측면
  + 폴리머, 웹컴포넌트 기반이라 폴리머팀의 폴리필(11kb)로 모든 브라우저에서 지원가능하다.
  + 앵귤러 처럼 데이터 바인딩 등 비슷한 문법을 내포한다.
* 부정적 측면
  + 내가 이 프레임워크를 쓰게 될까? (개인적으로는 쓸것 같다.) => 답이나왔다. 개인 공부로 하자
  + 지금 과제에 집중할 때이다.. 퇴근하고 과제에 관련된 공부 하는게 좋지않나 ? => 맞는말이다.. 그럼 공부할게 없을때 폴리머를 해보는건 ?₩

## lit-html

* lit은 리터럴, 원래 웹컴포넌트 초기에는 템플릿 엘리먼트지원과 link 태그의 import를 지원 하려고 했다. 하지만 대표적으로 파이어폭스에서 import지원을 안하겟다고 말한다.
* 타당한 이유가 있다고한다. 쨋든 그래서 방향이 바뀌어서 html import를 대신해서 html이아닌 js를 가져오도록, 마크업은 template 대신 template literal을 사용하려고 방향이 바뀌엇다.


### html tag

* html tag of polymer

```javascript
<!-- html template로 만든다. -->
exports.html = function html(strings) {
  var values = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    values[_i - 1] = arguments[_i];
  }
  var template = /** @type {!HTMLTemplateElement} */ (document.createElement('template'));
  template.innerHTML = values.reduce(function (acc, v, idx) {
    return acc + htmlValue(v) + strings[idx + 1];
  }, strings[0]);
  return template;
};
```

### shadow dom

```javascript
<!-- template 생성시 shaodw dom으로 적용  -->
static get template () {return html`some template`;}
```

### user data binding
* 표준 커스텀컴포넌트는 와칭할 속성값을 추가하지만, 값을 추가하면 자동으로 바인딩된다.
* 변화전파에 빠르다. => 렌더링콕스트를 줄인다.
* {{}} 이중 브라켓으로 씌우면 데이터 바인딩이 된다.

```javascript
<!-- this.data 변경시 자동으로 적용 -->
static get template () {return html`some {{this.data}} template`;}

```

### declare property 

```javascript
static get properties () {
    return {
      // Configure owner property
      owner: { // watching attribute
        type: String,
          value: 'Daniel', //default value
      }
    };
  }
<!-- property bind [[]] -->
static get template () { 
    return html`
      <!-- bind to the "owners" property -->
      This is <b>[[owners]]</b>'s name-tag element.
    `;
  }
```