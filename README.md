# LangGraph RAG 웹 프레젠테이션

## 🚀 실행 방법

### 1. 로컬에서 실행하기

```bash
# 프레젠테이션 폴더로 이동
cd /mnt/c/Users/stdre/LangGraph_Rag/presentation

# Python 간단 HTTP 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js http-server 사용
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

### 2. VS Code Live Server 사용

1. VS Code에서 `presentation/index.html` 파일 열기
2. 우클릭 → "Open with Live Server" 선택
3. 자동으로 브라우저가 열림

## 📁 파일 구조

```
presentation/
├── index.html      # 메인 HTML 파일
├── styles.css      # 스타일시트
├── workflow.js     # LangGraph 워크플로우 시각화
├── demo.js         # 데모 기능
└── README.md       # 이 파일
```

## 🎯 주요 기능

### 1. 인터랙티브 워크플로우 다이어그램
- D3.js를 사용한 동적 시각화
- 노드 클릭 시 상세 정보 모달 표시
- 경로별 하이라이트 기능
  - 인덱싱 경로
  - Vector 검색 경로
  - Graph 검색 경로
  - Lattice 검색 경로

### 2. 노드 상세 설명
- 각 노드의 역할과 기능
- 입력/출력 데이터 형식
- 실제 코드 예시

### 3. 라이브 데모
- 4가지 검색 시나리오
  - Vector Search: 단순 정보 검색
  - Graph Search: 관계 검색
  - Lattice Search: 계층적 분석
  - Hybrid Search: 복합 분석
- 단계별 처리 과정 애니메이션
- 실시간 결과 표시

### 4. 반응형 디자인
- 모바일/태블릿 지원
- 부드러운 스크롤 효과
- 호버 인터랙션

## 🎨 커스터마이징

### 색상 변경
`styles.css`의 CSS 변수 수정:
```css
:root {
    --primary-color: #2563eb;  /* 메인 색상 */
    --secondary-color: #7c3aed; /* 보조 색상 */
}
```

### 노드 추가
`workflow.js`의 `workflowData` 객체에 노드 추가:
```javascript
nodes: [
    { id: 'new_node', label: 'New Node', type: 'custom', x: 500, y: 300 }
]
```

### 데모 시나리오 추가
`demo.js`의 `demoScenarios` 객체에 시나리오 추가:
```javascript
demoScenarios.custom = {
    question: "커스텀 질문",
    method: "Custom Search",
    // ...
}
```

## 📱 브라우저 호환성

- Chrome (권장)
- Firefox
- Safari
- Edge

## 🛠️ 문제 해결

### CORS 오류 발생 시
로컬 파일을 직접 열지 말고 HTTP 서버를 통해 실행하세요.

### D3.js 로드 실패 시
인터넷 연결을 확인하거나 D3.js를 로컬에 다운로드하여 사용하세요.

## 📝 발표 팁

1. **전체 화면 모드**: F11 키로 전체 화면 전환
2. **줌 조절**: Ctrl + 마우스 휠로 확대/축소
3. **네비게이션**: 상단 메뉴 또는 스크롤 사용
4. **데모 실행**: 질문 예시 클릭 후 처리 과정 관찰

---

세미나 성공을 기원합니다! 🎉