---
layout: post
title: 리퀘스트 방식 수정하기 작업 중 이슈
category: [ troubleshooting ]
tags: [ troubleshooting, http, protocol ]
---

# 리퀘스트 방식 수정하기 작업 중 이슈 

## CONTEXT

클라이언트에서 서버로 요청을 보내는 방법을 get에서 post로 바꿔야 하는 작업이 생겼다. 
post는 사이드에서 content-type이 application/x-www-form-urlencoded인 경우에 기존 서치파라미터를 처리하던 로직이라 편하게 파싱을 해줘서 form을 이용하여 리퀘스트를 보냈다.
그리고 작업 중 인터셉터에서 동작을 수정 중에 토큰이 발급이 안되는 이슈가 일어났다. 

* 해당 토큰은 userId를 가져와서 userId를 서버에서 외부 서버의 API에 요청을 하여 가져온다. (관리 서버 - 타 서버)

## 안되는 이유 추측

우선 작업하면서 토큰 발급하는 리퀘스트 처리 부분을 건들인적이 없었고, 그렇다면 내가 작업한 부분과 해당 리퀘스트를 처리하는 부분에서 안보이는 접점이 있을거라고 판단하였다. 


### 1. 로그확인 

로그 확인 결과 콘솔에 error로그가 하나 찍혀있었는데, 단순하게 read timeout이라고 적혀있었다. 
그래서 그 코드를 확인해보니 아래 코드에서 이슈가 생기고 있었다.
```java
// xmlRead => xml응답형태 파싱
// httpRequestUtil => http request를 보내는 유틸
xmlRead(httpRequestUtil.req(method, charset));
```

그래서 선택지가 두 곳으로 좁혀졌다.
* http request
* xml read

### 2. http request 확인
이부분은 디버그로 찍어보고 하나씩 순차로 해보고 판단 하여 http requst 중 timeout 일어나는거로 판단

## 해결 

### 1. timeout 늘려보기

기존 default로 3000으로 되있는 것을 5000으로 변경해보았다.
페이지에서 5초간 기다렸다가 토큰 발급 실패 한 상태로 진행

### 2. 리퀘스트에 요청하는 method객체 확인해보기 

확인해봐야하는 이유는 상대 서버에서 변경점이 없다면 httpRequest는 stateless한 요청이기 때문에 
파라미터값에 따라 에러가 발생할 수 있다고 판단하였다.
그래서 메서드 객체를 확인했는데 성공했을때(get요청)와 실패한 경우(post요청)를 비교했다.
다른 점은 우리서버에 요청을 보낼때 클라이언트의 헤더를 타 서버로 요청을 보내는 헤더에 덧 씌워서 사용하고있었다.

그래서 헤더값을 보다가 헤더에 'Content-Length'를 보고 문제가 무엇인지 발견하게되었다.

### 3. 'Content-Length'가 왜 문제인가 

우리는 클라이언트 - 서버로는 post이고 서버 - 서버로는 get으로 요청을 보내고있다.
하지만 Content-Length는 requst의 body의 사이즈를 정의하는 헤더이다.
그 말은 즉 Content-Length가 정의 되어있으면 그만한 사이즈의 body를 받아야하는데 get은 body가 없으므로 타 서버측에서 아직 body데이터를 수신 못 받은거로 아는 것이다.
(http는 TCP base이고 TCP는 연결 지향형으로 데이터를 수신 못받으면 데이터를 다시 받기위한 동작을 한다, http3은 UDP base)

### 4. 'Content-Length' 지우기

(자바에서 작업할 때 기준) headers는 arrayLsit로 header가 저장 되어있는데 여기서 또 두가지 방법이 있다.
* array에서 특정 item 지우기
* 헤더값 "" 처리

본인은 후자의 방법을 사용했다. 
이유는 arrayList는 삽입 삭제시 O(n)의 성능을 내고 (그래봤자 적지만), 헤더값이 빈 문자열이어도 되는 이유는 헤더에 임의의 값도 넣어서 사용하는 경우가 있기 때문에 빈문자열을 넣는다고 차이가 없다고 생각하였다.


## 결론

* 프로토콜에 대해서는 알아도 나쁘지 않다 HTTP, UDP, TCP 정도. (mqtt나 amqp는 사용한다면..)
* 헤더를 잘 보는 습관을 갖자 보통 리퀘스트에서 이슈 가질 때 원인 잘 모르겠으면 헤더 안봐서이다 (물론 쪼렙때)
