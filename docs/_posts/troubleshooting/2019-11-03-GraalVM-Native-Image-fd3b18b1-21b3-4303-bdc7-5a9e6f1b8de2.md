---
layout: post
title: GraalVM Native-Image 삽질
category: [ troubleshooting ]
tags: [ graalVM, native-image, spring ]
---

# GraalVM Native-Image 삽질

**motivation**

Armeria(아르메리아로 읽어라)의 아래 이슈를 맡기로하면서 OAS로 코드를 제너레이팅하는 기본 기능을 구현 후 어떻게 유저에게 좋은 인터페이스를 제공 할 것인가에 대해서 고민을 했다. 우연히 Kafractive를 최근에 둘러보면서 spring-shell에 대해 알게되어서 CLI형태로 지원해보는것은 어떨까란 생각이 들어서 CLI로 제공하려했다.

[Provide a way to support OpenAPI Specification · Issue #1951 · line/armeria](https://github.com/line/armeria/issues/1951#issue-476723420)

[gnu-gnu/kafractive](https://github.com/gnu-gnu/kafractive)

하지만 다른문제점으로 유저에게 jar파일로 주면 유저가 알아서 java -jar [파일명] 이런식으로 사용 할 수는 있겠지만 더 편한 방밥이 없을까 고민하던중 graalVM으로 native-image로 제공하는건 어떻냐는 갓님의 말씀에 graalVM으로 새로 시도해보는것도 재밌을것 같아서 하게 되었다. 

## 작업 순서

### GraalVM 설치

Getting started, [https://www.graalvm.org/docs/getting-started/](https://www.graalvm.org/docs/getting-started/)

`gu` 설치 후 community version 설치 

    gu install native-image

### Spring-shell

Spring-shell로 간단히 작성 한 프로그램에 대해서 Native-image를 이용해 빌드를 해보았다.

--no-fallback: 이슈가 있는경우 런타임에 JVM을 사용하도록 만들어져서 fallback을 시도하지 않도록 한다.

```bash
native-image --no-server --no-fallback -jar api-generator-0.94.1-SNAPSHOT.jar
```
![](/Describing-Blog/assets/img/troubleshooting/2019110302.png)

com.oracle.svm.hosted.substitute.DeletedElementException이라는 Exception이 뜨는데 해결한 케이스인 경우는 이것을 런타임 Exception으로 넘기기위해서 `--report-unsupported-elements-at-runtime` 플래그를 사용한다. 이 플래그는 지금 빌드단계에서는 그냥 빌드하고 런타임에 Exception을 던진다.

그리고 위의 플래그로 다시 만든 이미지로 실행해보면 아래와 같은  Excpetion이 일어난다.

![](/Describing-Blog/assets/img/troubleshooting/2019110301.png)

위의 Exception을 해결하려고 우선 구글에 검색을 해보면 직접적인 방법이 아닌 JAVA버전을 바꿔서 해결을 하는 방법 외에는 대부분 답글을 안달았다. 하지만 JAVA 버전은 graalvm을 사용하기때문에 1.8고정이고, 이미 document를 읽으면서 왜 문제가 있나 의심이 되는 부분이 있었다.

### GraalVM Native-Image LImitation

GraalVM Native-Image는 모든 자바의 피쳐를 제공하지않으므로 제약이 있는데, 아래의 표와 같다.

![](/Describing-Blog/assets/img/troubleshooting/2019110303.png)

[oracle/graal](https://github.com/oracle/graal/blob/master/substratevm/LIMITATIONS.md)

이게 무엇이 문제이냐면 spring-boot를 사용하여 문제가 있었다. (spring은 DI를 위해서 Reflection을 많이 사용하고 그 외에도 위에 해당되는 제약이 있을수 있을듯 하다.)

그리고 graalVM이슈에서도 spring-boot에 대한 제한이 있다는것을 issue에서 확인했다. aclement라는 아재가 graal 지원을 위한 spring boot 서브 프로젝트를 만드는것을 확인했다.(현재는 Springframework 레포에 experimental단계에 있다.)

[spring-projects-experimental/spring-graal-native](https://github.com/spring-projects-experimental/spring-graal-native)

결국 위의 experimental 프로젝트를 사용하면 되지만, 의존성에 experimental을 추가해도 되는가란 생각이 들어서.. 원래 기능은 mustache를 사용하는 POJO로 만들었기 때문에 CLI는 그냥 Plain JAVA로 만들려고 한다. (도망치는게 아니라 리소스를 아끼고 직접 argument 파서를 만다는 재미를 위한 선택이다.)

## 결론

- Spring앱을 Native-Image로 만들려면 아래 링크의 exprerimental 프로젝트를 사용해라(2019.11.03)

[spring-projects-experimental/spring-graal-native](https://github.com/spring-projects-experimental/spring-graal-native)