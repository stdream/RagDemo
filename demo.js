// Demo functionality
const demoScenarios = {
    simple: {
        question: "이 표준의 작성일을 말해줘",
        method: "Vector Search",
        searchType: "simple_query",
        steps: [
            { step: 1, action: "질문에서 '작성일' 키워드 감지" },
            { step: 2, action: "단순 정보 검색으로 분류 → Vector Search 선택" },
            { step: 3, action: "문서 임베딩과 질문 임베딩의 코사인 유사도 계산" },
            { step: 4, action: "검색 품질: 0.92 (통과)" },
            { step: 5, action: "답변 생성 완료" }
        ],
        result: `<strong>검색 방법:</strong> Vector Search (코사인 유사도)<br>
                <strong>검색된 청크:</strong> 3개<br>
                <strong>답변:</strong><br>
                ECSS-Q-ST-70-37C 표준은 2008년 11월 15일에 작성되었습니다. 
                이는 ECSS-Q-70-31A를 ECSS 작성 규칙과 새로운 템플릿에 따라 재작성한 두 번째 버전입니다.`
    },
    
    graph: {
        question: "5장과 5.1장의 관계를 설명해줘",
        method: "Graph Search",
        searchType: "relationship_query",
        steps: [
            { step: 1, action: "질문에서 '관계' 키워드 감지" },
            { step: 2, action: "관계 검색으로 분류 → Graph Search 선택" },
            { step: 3, action: "Neo4j에서 MATCH (n)-[r]-(m) 쿼리 실행" },
            { step: 4, action: "검색 품질: 0.88 (통과)" },
            { step: 5, action: "관계 정보 기반 답변 생성" }
        ],
        result: `<strong>검색 방법:</strong> Graph Search (Neo4j)<br>
                <strong>Cypher 쿼리:</strong> MATCH (n:Chapter {id: "5"})-[r:HAS_SECTION]->(m:Section {id: "5.1"})<br>
                <strong>답변:</strong><br>
                5장 'Requirements'는 전체 요구사항을 다루는 상위 섹션이고, 
                5.1장 'Test condition'은 5장의 하위 섹션으로 구체적인 테스트 조건을 정의합니다.
                관계: PARENT-CHILD, 계층 레벨 차이: 1`
    },
    
    lattice: {
        question: "이 표준 문서의 요구사항을 계층적으로 분석해줘",
        method: "Lattice OC Search",
        searchType: "hierarchy_query",
        steps: [
            { step: 1, action: "질문에서 '계층적' 키워드 감지" },
            { step: 2, action: "계층 검색으로 분류 → Lattice OC Search 선택" },
            { step: 3, action: "FCA 개념 격자에서 상위/하위 개념 탐색" },
            { step: 4, action: "검색 품질: 0.85 (통과)" },
            { step: 5, action: "계층 구조 기반 답변 생성" }
        ],
        result: `<strong>검색 방법:</strong> Lattice Order Coverage Search<br>
                <strong>FCA 분석:</strong> 15개 개념, 4단계 계층<br>
                <strong>답변:</strong><br>
                <pre>
요구사항 계층 구조:
├── 5. Requirements (최상위)
│   ├── 5.1 Test condition
│   ├── 5.2 Preparatory conditions
│   │   ├── 5.2.1 Types of samples
│   │   ├── 5.2.2 Test specimen details
│   │   └── 5.2.3 Test apparatus conditions
│   ├── 5.3 Acceptance criteria
│   └── 5.4 Quality assurance
                </pre>`
    },
    
    hybrid: {
        question: "이 표준의 전체적인 시험 절차와 평가 방법을 종합적으로 분석해줘",
        method: "Hybrid Search",
        searchType: "complex_query",
        steps: [
            { step: 1, action: "질문에서 '전체적', '종합적' 키워드 감지" },
            { step: 2, action: "복합 검색으로 분류 → Hybrid Search 선택" },
            { step: 3, action: "Vector + Graph + Lattice 검색 병렬 실행" },
            { step: 4, action: "검색 결과 통합 및 재순위화" },
            { step: 5, action: "종합적인 답변 생성" }
        ],
        result: `<strong>검색 방법:</strong> Hybrid Search (Vector + Graph + Lattice)<br>
                <strong>검색 결과:</strong> Vector(5) + Graph(3) + Lattice(4) = 12개 소스<br>
                <strong>답변:</strong><br>
                이 표준은 금속의 응력부식균열(SCC) 저항성 평가를 위한 종합적인 시험 절차를 제시합니다:
                
                <strong>1. 시험 절차:</strong>
                - 30일간 3.5% NaCl 용액에 교대 침지
                - 23°C ±4°C 온도 유지
                - 매시간 10분 침지, 50분 건조
                
                <strong>2. 평가 방법:</strong>
                - Class 1: 높은 저항성 (파손 없음, 강도 90% 이상)
                - Class 2: 중간 저항성 (파손 없음, 미세균열 존재)
                - Class 3: 낮은 저항성 (파손 발생, 강도 90% 미만)`
    }
};

let currentDemo = null;
let demoTimer = null;

function runDemo(type) {
    // Clear previous demo
    clearDemo();
    
    currentDemo = demoScenarios[type];
    const processSteps = document.querySelectorAll('.process-step');
    const resultContent = document.getElementById('result-content');
    
    // Reset all steps
    processSteps.forEach(step => step.classList.remove('active'));
    resultContent.innerHTML = '<p style="color: #6b7280;">처리 중...</p>';
    
    // Animate through steps
    let stepIndex = 0;
    demoTimer = setInterval(() => {
        if (stepIndex < currentDemo.steps.length) {
            const step = currentDemo.steps[stepIndex];
            
            // Activate process step
            processSteps[step.step - 1].classList.add('active');
            
            // Show step action in result area
            if (stepIndex === 0) {
                resultContent.innerHTML = '<h5>처리 과정:</h5><ul id="step-list"></ul>';
            }
            
            const stepList = document.getElementById('step-list');
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check" style="color: #10b981;"></i> ${step.action}`;
            li.style.opacity = '0';
            stepList.appendChild(li);
            
            // Fade in animation
            setTimeout(() => li.style.opacity = '1', 50);
            
            stepIndex++;
        } else {
            // Show final result
            clearInterval(demoTimer);
            setTimeout(() => {
                resultContent.innerHTML = currentDemo.result;
                highlightSearchPath(currentDemo.searchType);
            }, 500);
        }
    }, 1000);
}

function clearDemo() {
    if (demoTimer) {
        clearInterval(demoTimer);
        demoTimer = null;
    }
    
    document.querySelectorAll('.process-step').forEach(step => {
        step.classList.remove('active');
    });
    
    resetHighlight();
}

function highlightSearchPath(searchType) {
    // Reset all highlights first
    d3.selectAll('.link').style('stroke', '#6b7280').style('stroke-width', 2);
    d3.selectAll('.node rect').style('opacity', 0.3);
    
    // Define paths for each search type
    const searchPaths = {
        simple_query: ['search_routing', 'vector_search', 'search_quality_eval', 
                      'context_integration', 'prompt_generate', 'answer_generate', 
                      'answer_quality_eval', 'hallucination_detect', 'answer_post'],
        relationship_query: ['search_routing', 'graph_search', 'search_quality_eval', 
                            'context_integration', 'prompt_generate', 'answer_generate', 
                            'answer_quality_eval', 'hallucination_detect', 'answer_post'],
        hierarchy_query: ['search_routing', 'lattice_oc_search', 'search_quality_eval', 
                         'context_integration', 'prompt_generate', 'answer_generate', 
                         'answer_quality_eval', 'hallucination_detect', 'answer_post'],
        complex_query: ['search_routing', 'hybrid_search', 'search_quality_eval', 
                       'context_integration', 'prompt_generate', 'answer_generate', 
                       'answer_quality_eval', 'hallucination_detect', 'answer_post']
    };
    
    const nodesToHighlight = searchPaths[searchType] || [];
    
    // Highlight nodes
    nodesToHighlight.forEach(nodeId => {
        d3.select(`#node-${nodeId} rect`)
            .style('opacity', 1)
            .style('stroke', '#ef4444')
            .style('stroke-width', 3);
    });
    
    // Highlight links
    for (let i = 0; i < nodesToHighlight.length - 1; i++) {
        const source = nodesToHighlight[i];
        const target = nodesToHighlight[i + 1];
        
        d3.select(`#link-${source}-${target}`)
            .style('stroke', '#ef4444')
            .style('stroke-width', 3);
    }
}

// Add smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add interactive hover effects for node cards
document.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => {
        const nodeId = card.getAttribute('data-node');
        
        // Highlight the node in the workflow diagram
        d3.selectAll('.node rect').style('opacity', 0.3);
        d3.select(`#node-${nodeId} rect`)
            .style('opacity', 1)
            .style('stroke', '#2563eb')
            .style('stroke-width', 4);
        
        // Scroll to workflow section
        document.querySelector('#flow').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
});

// Performance comparison animation
function animatePerformance() {
    const metrics = [
        { name: '검색 정확도', old: 75, new: 92 },
        { name: '답변 품질', old: 64, new: 90 },
        { name: '복합 질문 처리', old: 60, new: 88 }
    ];
    
    const container = document.createElement('div');
    container.className = 'performance-comparison';
    container.innerHTML = '<h3>성능 비교: 기존 RAG vs LangGraph RAG</h3>';
    
    metrics.forEach(metric => {
        const metricDiv = document.createElement('div');
        metricDiv.className = 'metric-comparison';
        metricDiv.innerHTML = `
            <h4>${metric.name}</h4>
            <div class="bar-container">
                <div class="bar old-bar" style="width: 0%">
                    <span>${metric.old}%</span>
                </div>
                <div class="bar new-bar" style="width: 0%">
                    <span>${metric.new}%</span>
                </div>
            </div>
            <div class="improvement">+${((metric.new - metric.old) / metric.old * 100).toFixed(1)}% 개선</div>
        `;
        container.appendChild(metricDiv);
    });
    
    // Add CSS for performance bars
    const style = document.createElement('style');
    style.textContent = `
        .performance-comparison {
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            margin: 2rem 0;
        }
        .metric-comparison {
            margin: 2rem 0;
        }
        .bar-container {
            margin: 1rem 0;
        }
        .bar {
            height: 30px;
            margin: 5px 0;
            border-radius: 5px;
            display: flex;
            align-items: center;
            padding: 0 1rem;
            color: white;
            font-weight: 600;
            transition: width 1s ease-out;
        }
        .old-bar {
            background: #f59e0b;
        }
        .new-bar {
            background: #10b981;
        }
        .improvement {
            text-align: right;
            color: #10b981;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    // Animate bars after adding to DOM
    setTimeout(() => {
        container.querySelectorAll('.old-bar').forEach((bar, i) => {
            bar.style.width = metrics[i].old + '%';
        });
        container.querySelectorAll('.new-bar').forEach((bar, i) => {
            bar.style.width = metrics[i].new + '%';
        });
    }, 100);
    
    return container;
}