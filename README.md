# Claude's React Component Collection 🎨

Claude AI가 생성한 React 컴포넌트들을 모아둔 레포지토리입니다. 각 컴포넌트는 TypeScript로 작성되었으며, Tailwind CSS와 shadcn/ui를 기반으로 합니다.

## 🚀 시작하기

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/jhleee/react-claude-playground.git

# 의존성 설치
cd claude-react-components
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

## 🛠️ 기술 스택

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vite
- Recharts
- Lucide React

## 📂 프로젝트 구조

```
├─public
└─src
    ├─components          # 생성된 컴포넌트를 넣어둡니다.
    │  ├─ManyCompoent
    │  ├─...
    │  └─ui               # shadcn/ui 컴포넌트
    ├─hooks               # 커스텀 훅
    └─lib                 # 유틸리티 함수
```

## 🔧 컴포넌트 추가하기

1. `src/components` 디렉토리에 새 컴포넌트 폴더 생성
2. 컴포넌트 코드 작성 (`index.tsx`)
3. 스타일 정의 (Tailwind CSS 사용)
4. 테스트 코드 작성 (선택사항)
5. 문서 업데이트

## ⚙️ 설정 커스터마이징

### Tailwind 설정

`tailwind.config.js`에서 테마 및 플러그인을 설정할 수 있습니다.

### Vite 설정

`vite.config.ts`에서 빌드 및 개발 설정을 변경할 수 있습니다.

## 🤝 기여하기

1. 이 레포지토리를 포크합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다
