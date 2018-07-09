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
// bad
constructor() {
  // good
  constructor(val) {
    super(); // 항상 맨 앞에!

    console.log('yey!'); // yey
    console.log(val); // val 출력
  }

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
