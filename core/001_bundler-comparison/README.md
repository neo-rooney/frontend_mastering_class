# 📦 번들러 비교 실습

번들러 없이 개발할 때와 Webpack, Vite, Parcel을 사용할 때의 차이점을 실습해보는 프로젝트입니다.

## 🎯 실습 목표

1. **번들러 없이 개발할 때의 문제점 체감**
2. **각 번들러의 특징과 장단점 이해**
3. **실제 성능 차이 측정**

## 📁 프로젝트 구조

```
bundler-comparison/
├── no-bundler/          # 번들러 없이 개발한 버전
├── webpack/            # Webpack 사용 버전
├── vite/              # Vite 사용 버전
├── parcel/            # Parcel 사용 버전
└── README.md
```

## 🚀 실습 시작

### 1단계: 번들러 없는 버전 테스트

#### 실행 방법

```bash
cd core/001_bundler-comparison/no-bundler
python3 -m http.server 8000
```

#### 브라우저에서 확인

- http://localhost:8000 접속
- 개발자 도구 콘솔에서 성능 지표 확인

#### 확인할 수 있는 문제점들

- **파일이 너무 많음**: CSS 4개 + JS 5개 = 총 9개 파일
- **네트워크 요청 수**: 각 파일마다 별도 HTTP 요청
- **로딩 순서 의존성**: script 태그 순서가 중요
- **최신 문법 호환성**: 일부 브라우저에서 문제 가능성

### 2단계: 각 번들러 버전 구현 (예정)

#### Webpack 버전

- 복잡한 설정
- 강력한 최적화 기능
- Tree shaking, 코드 분할 등

#### Vite 버전

- 빠른 개발 서버
- 간단한 설정
- ES modules 기반

#### Parcel 버전

- 설정 없이 바로 사용
- 자동 최적화
- Zero configuration

## 📊 측정 지표

### 개발 경험

- 설정 복잡도
- 개발 서버 시작 시간
- Hot Module Replacement 속도

### 빌드 결과

- 최종 번들 크기
- 청크 분할 효과
- Tree shaking 효과

### 런타임 성능

- 초기 로딩 시간
- 네트워크 요청 수
- 브라우저 호환성

## 🔍 번들러 없이 개발할 때의 문제점

### 1. 파일이 너무 많아짐

```html
<!-- CSS 파일들 -->
<link rel="stylesheet" href="css/reset.css" />
<link rel="stylesheet" href="css/main.css" />
<link rel="stylesheet" href="css/todo.css" />
<link rel="stylesheet" href="css/components.css" />

<!-- JS 파일들 -->
<script src="js/utils.js"></script>
<script src="js/todoService.js"></script>
<script src="js/todoItem.js"></script>
<script src="js/todoList.js"></script>
<script src="js/main.js"></script>
```

### 2. 로딩 순서 의존성

```html
<!-- 잘못된 순서 - 에러 발생! -->
<script src="js/main.js"></script>
<!-- todoService를 모름 -->
<script src="js/todoService.js"></script>
<!-- 너무 늦게 로드됨 -->

<!-- 올바른 순서 -->
<script src="js/todoService.js"></script>
<!-- 먼저 로드 -->
<script src="js/main.js"></script>
<!-- 이제 todoService 사용 가능 -->
```

### 3. 최신 문법 호환성 문제

```javascript
// 최신 문법 (일부 브라우저에서 문제)
const fetchData = async () => {
  const response = await fetch("/api/data");
  return response.json();
};

// 옛날 브라우저에서는 에러!
```

## 🛠️ 개발 도구

### 브라우저 개발자 도구 활용

1. **Network 탭**: 파일 로딩 시간과 요청 수 확인
2. **Console 탭**: 성능 지표와 에러 확인
3. **Performance 탭**: 상세한 성능 분석

### 성능 측정 코드

```javascript
// 페이지 로드 시간 측정
const loadTime = performance.now() - startTime;
console.log(`📈 페이지 로드 시간: ${loadTime.toFixed(2)}ms`);

// 네트워크 요청 수 계산
const resourceCount = performance.getEntriesByType("resource").length;
console.log(`🌐 네트워크 요청 수: ${resourceCount}개`);
```

## 📝 실습 체크리스트

- [ ] 번들러 없는 버전 실행 및 테스트
- [ ] 성능 지표 확인 (로딩 시간, 요청 수)
- [ ] 개발자 도구에서 문제점 분석
- [ ] Webpack 버전 구현
- [ ] Vite 버전 구현
- [ ] Parcel 버전 구현
- [ ] 각 버전별 성능 비교
- [ ] 번들러별 장단점 정리

## 🎓 학습 포인트

1. **번들러의 필요성**: 왜 번들러가 필요한지 실제로 체감
2. **각 번들러의 특징**: Webpack, Vite, Parcel의 차이점
3. **성능 최적화**: 실제 성능 개선 효과 확인
4. **개발 경험**: 설정 복잡도 vs 개발 편의성

## 🔗 참고 자료

- [Webpack 공식 문서](https://webpack.js.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Parcel 공식 문서](https://parceljs.org/)
- [번들러 비교 가이드](https://web.dev/bundler-comparison/)
