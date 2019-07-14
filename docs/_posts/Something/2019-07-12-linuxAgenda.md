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
* linux fd 위치 ```/proc/[PID]/fd/ ```

## [procfs](https://ko.wikipedia.org/wiki/Procfs) 
프로세스와 다른 시스템정보를 계층적 파일 구조 형식으로 보여주기 위한 파일 시스템. 부트타임에 /proc에 마운트 된다. procfs는 커널 내부 데이터 구조체에 대한 인터페이스처럼 동작. 커널영역과 유저영역 사이의 통신에 대한 방식을 제공한다. 

* 각 실행중인 프로세스는 /proc/[PID]를 가진다.
* /proc 디렉토리에는 시스템 정보도 포함한다. 

```
# wiki 펌
/proc/PID/cmdline, 프로세스를 시작한 명령어.
/proc/PID/cwd, 프로세스의 현재 작업 디렉토리에 대한 심볼릭 링크.
/proc/PID/environ는 프로세스에 영향을 미치는 환경 변수들의 이름과 값들을 포함한다.
/proc/PID/exe, 존재하는 경우 원본 실행 파일에 대한 심볼릭 링크.
/proc/PID/fd, 각 열린 파일 서술자에 대한 심볼릭 링크를 포함하는 디렉토리.
/proc/PID/fdinfo, 각 열린 파일 서술자에 대한 위치와 플래그들을 서술하는 엔트리들을 포함하는 디렉토리.
/proc/PID/maps, 매핑된 파일들과 블록들(힙과 스택 같은)에 대한 정보를 포함하는 텍스트 파일.
/proc/PID/mem, 프로세스의 가상 메모리를 보여주는 바이너리 이미지로서 오직 ptrace 하는 프로세스에 의해서만 접근될 수 있다.
/proc/PID/root, 프로세스에 의해 보여지는 루트 경로에 대한 심볼릭 링크. 프로세스가 chroot jail에서 실행중이지 않은 이상 대부분의 프로세스들에서 이것은 /에 링크된다.
/proc/PID/status는 실행 상태와 메모리 사용을 포함하는 프로세스에 대한 기본 정보들을 갖는다.

```



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

#### pgrep: pattern을 통해 command setch 후 모든 PID 출력

#### grep: 패턴 탐색

#### [awk](http://www.incodom.kr/Linux/%EA%B8%B0%EB%B3%B8%EB%AA%85%EB%A0%B9%EC%96%B4/awk): 패턴 탐색 및 처리, grep 과 다른 점은 처리를 추가 할 수 있다.


## tool

#### strace: systemcall trace 도구
* 소켓 열 때 옵션 setsockopt, connect, close 확인
* 파일 access, read 확인