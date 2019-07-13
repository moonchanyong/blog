---
layout: post
title: 리눅스 키워드 인덱싱
category: [ Something ]
tags: [ linux, command, tips ]
---

# Linux Agenda

리눅스 키워드 인덱싱

## [file discriptor(FD)](https://en.wikipedia.org/wiki/File_descriptor)
유닉스 시스템에서 프로세스가 이 파일들을 접근할 때에 사용.
 파일 디스크립터 숫자 중 사용하지 않은 가장 작은 값을 할당한다. 해당 파일에 시스템 콜을 이용해 접근 할 때 FD값을 이용해 파일에 접근한다.

* file descriptor -> file table -> inode table 색인
* 기본으로 표준 입출력 번호가 매핑 
* linux fd 위치 ```/proc/PID/fd/ ```


##### standard POSIX file descriptors
* stdout(standard output stream): 1
* stderr(standard error stream): 2
* stdin(standard error stream): 0

## command

#### man: 명령어의 정보를 알 수 있다. 
```bash
$ man man
```

#### head: 파일의 앞 10줄(기본) 출력

#### tail: 파일의 뒤 10줄(기본) 출력
```bash
$ tail access.log.2019XXXX.txt

// EOF 나올 때까지 프로세스가 멈추지 않는다. 서버에서 쌓이고 있는 로그를 볼 때 유용
$ tail -f access.log.2019XXXX.txt
```

#### ldd: 라이브러리 의존성 확인

#### n>, n>>(redirection): 표준 스트림의 흐름 변경, n은  file descriptor
``` bash
// ls의 출력 스트림을 ls.txt라는 파일로 사용, 기존 파일 삭제
$ ls > ls.txt

// ls 출력 스트림을 ls.txt라는 파일로 사용, 기존 파일에 append 
$ ls >> ls.txt

// head의 입력 스트림으로 ls.txt를 사용
$ head < ls.txt

// ((head < ls.txt) > ls2.txt)
$ head < ls.txt > ls2.txt


```


#### |(pipe): 프로세스 간 스트림 입출력 흐름 연결
```bash
// 간단한 예, apache process 찾기
$ ps -ef | grep httpd

```


#### grep: 패턴 탐색

#### [awk](http://www.incodom.kr/Linux/%EA%B8%B0%EB%B3%B8%EB%AA%85%EB%A0%B9%EC%96%B4/awk): 패턴 탐색 및 처리, grep 과 다른 점은 처리를 추가 할 수 있다.


## tool

#### strace: systemcall trace 도구
* 소켓 열 때 옵션 setsockopt, connect, close 확인
* 파일 access, read 확인