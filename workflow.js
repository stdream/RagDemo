// LangGraph Workflow Visualization
const workflowData = {
    nodes: [
        // Start
        { id: 'start', label: 'START', type: 'start', x: 600, y: 30 },
        
        // Indexing nodes
        { id: 'doc_loading', label: 'doc_loading', type: 'indexing', x: 600, y: 120 },
        { id: 'doc_chunking', label: 'doc_chunking', type: 'indexing', x: 600, y: 210 },
        { id: 'doc_embedding', label: 'doc_embedding', type: 'indexing', x: 400, y: 320 },
        { id: 'keyword_extract', label: 'keyword_extract', type: 'indexing', x: 800, y: 320 },
        { id: 'neo4j_save', label: 'neo4j_save', type: 'indexing', x: 400, y: 430 },
        { id: 'fc_extract', label: 'fc_extract', type: 'indexing', x: 800, y: 430 },
        { id: 'fc_csv_save', label: 'fc_csv_save', type: 'indexing', x: 800, y: 540 },
        
        // Router
        { id: 'search_routing', label: 'search_routing', type: 'router', x: 600, y: 650 },
        
        // Search nodes
        { id: 'vector_search', label: 'vector_search', type: 'search', x: 150, y: 760 },
        { id: 'graph_search', label: 'graph_search', type: 'search', x: 375, y: 760 },
        { id: 'lattice_oc_search', label: 'lattice_oc_search', type: 'search', x: 600, y: 760 },
        { id: 'lattice_jaccard_search', label: 'lattice_jaccard_search', type: 'search', x: 825, y: 760 },
        { id: 'hybrid_search', label: 'hybrid_search', type: 'search', x: 1050, y: 760 },
        
        // Quality evaluation
        { id: 'search_quality_eval', label: 'search_quality_eval', type: 'quality', x: 600, y: 870 },
        
        // Generation nodes
        { id: 'context_integration', label: 'context_integration', type: 'generation', x: 600, y: 980 },
        { id: 'prompt_generate', label: 'prompt_generate', type: 'generation', x: 600, y: 1070 },
        { id: 'answer_generate', label: 'answer_generate', type: 'generation', x: 600, y: 1160 },
        { id: 'answer_quality_eval', label: 'answer_quality_eval', type: 'quality', x: 600, y: 1250 },
        { id: 'hallucination_detect', label: 'hallucination_detect', type: 'quality', x: 600, y: 1340 },
        { id: 'query_rewrite', label: 'query_rewrite', type: 'generation', x: 900, y: 980 },
        { id: 'answer_post', label: 'answer_post', type: 'generation', x: 600, y: 1430 },
        
        // End
        { id: 'end', label: 'END', type: 'end', x: 600, y: 1520 }
    ],
    
    links: [
        // Initial flow
        { source: 'start', target: 'doc_loading', type: 'normal' },
        { source: 'start', target: 'search_routing', type: 'conditional', label: 'indexed' },
        
        // Indexing flow
        { source: 'doc_loading', target: 'doc_chunking', type: 'normal' },
        { source: 'doc_chunking', target: 'doc_embedding', type: 'normal' },
        { source: 'doc_chunking', target: 'keyword_extract', type: 'normal' },
        { source: 'doc_embedding', target: 'neo4j_save', type: 'normal' },
        { source: 'keyword_extract', target: 'fc_extract', type: 'normal' },
        { source: 'fc_extract', target: 'fc_csv_save', type: 'normal' },
        { source: 'neo4j_save', target: 'search_routing', type: 'conditional' },
        { source: 'fc_csv_save', target: 'search_routing', type: 'conditional' },
        
        // Search routing
        { source: 'search_routing', target: 'vector_search', type: 'conditional', label: 'simple' },
        { source: 'search_routing', target: 'graph_search', type: 'conditional', label: 'relation' },
        { source: 'search_routing', target: 'lattice_oc_search', type: 'conditional', label: 'hierarchy' },
        { source: 'search_routing', target: 'lattice_jaccard_search', type: 'conditional', label: 'similarity' },
        { source: 'search_routing', target: 'hybrid_search', type: 'conditional', label: 'complex' },
        
        // Quality evaluation
        { source: 'vector_search', target: 'search_quality_eval', type: 'normal' },
        { source: 'graph_search', target: 'search_quality_eval', type: 'normal' },
        { source: 'lattice_oc_search', target: 'search_quality_eval', type: 'normal' },
        { source: 'lattice_jaccard_search', target: 'search_quality_eval', type: 'normal' },
        { source: 'hybrid_search', target: 'search_quality_eval', type: 'normal' },
        
        { source: 'search_quality_eval', target: 'context_integration', type: 'conditional', label: 'pass' },
        { source: 'search_quality_eval', target: 'query_rewrite', type: 'conditional', label: 'fail' },
        
        // Generation flow
        { source: 'context_integration', target: 'prompt_generate', type: 'normal' },
        { source: 'prompt_generate', target: 'answer_generate', type: 'normal' },
        { source: 'answer_generate', target: 'answer_quality_eval', type: 'normal' },
        { source: 'answer_quality_eval', target: 'hallucination_detect', type: 'normal' },
        
        { source: 'hallucination_detect', target: 'answer_post', type: 'conditional', label: 'pass' },
        { source: 'hallucination_detect', target: 'query_rewrite', type: 'conditional', label: 'rewrite' },
        { source: 'hallucination_detect', target: 'search_routing', type: 'conditional', label: 'research' },
        
        { source: 'query_rewrite', target: 'search_routing', type: 'conditional' },
        { source: 'query_rewrite', target: 'answer_post', type: 'conditional', label: 'max_iter' },
        
        { source: 'answer_post', target: 'end', type: 'normal' }
    ]
};

// Color scheme for node types
const nodeColors = {
    start: '#10b981',
    end: '#ef4444',
    indexing: '#3b82f6',
    router: '#8b5cf6',
    search: '#f59e0b',
    quality: '#ec4899',
    generation: '#06b6d4'
};

// Initialize D3 visualization
function initializeWorkflow() {
    const svg = d3.select('#workflow-svg');
    const width = 1200;
    const height = 1600;
    
    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3, 0 6')
        .style('fill', '#6b7280');
    
    // Create links
    const links = svg.append('g')
        .attr('class', 'links')
        .selectAll('g')
        .data(workflowData.links)
        .enter()
        .append('g');
    
    // Draw curved paths
    links.append('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('id', d => `link-${d.source}-${d.target}`)
        .attr('d', d => {
            const source = workflowData.nodes.find(n => n.id === d.source);
            const target = workflowData.nodes.find(n => n.id === d.target);
            
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 0.5;
            
            // Straight line for normal links, curved for conditional
            if (d.type === 'normal') {
                return `M${source.x},${source.y + 25} L${target.x},${target.y - 25}`;
            } else {
                return `M${source.x},${source.y + 25} Q${(source.x + target.x) / 2 + dx * 0.2},${(source.y + target.y) / 2} ${target.x},${target.y - 25}`;
            }
        });
    
    // Add link labels
    links.filter(d => d.label)
        .append('text')
        .attr('class', 'link-label')
        .attr('dy', -5)
        .append('textPath')
        .attr('href', d => `#link-${d.source}-${d.target}`)
        .attr('startOffset', '50%')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#6b7280')
        .text(d => d.label);
    
    // Create nodes
    const nodes = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(workflowData.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('id', d => `node-${d.id}`)
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .on('click', showNodeDetails)
        .on('mouseover', highlightConnections)
        .on('mouseout', resetHighlight);
    
    // Node rectangles
    nodes.append('rect')
        .attr('x', d => -d.label.length * 6 - 15)
        .attr('y', -25)
        .attr('width', d => d.label.length * 12 + 30)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('ry', 8)
        .style('fill', d => nodeColors[d.type])
        .style('stroke', '#374151')
        .style('stroke-width', 2);
    
    // Node labels
    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .style('fill', 'white')
        .style('font-weight', '600')
        .style('font-size', '14px')
        .text(d => d.label);
}

// Highlight path functions
function highlightPath(pathType) {
    // Reset all highlights first
    d3.selectAll('.link').classed('highlighted', false);
    d3.selectAll('.node rect').style('opacity', 0.3);
    
    let nodesToHighlight = [];
    
    switch(pathType) {
        case 'indexing':
            nodesToHighlight = ['start', 'doc_loading', 'doc_chunking', 'doc_embedding', 
                              'keyword_extract', 'neo4j_save', 'fc_extract', 'fc_csv_save'];
            break;
        case 'vector':
            nodesToHighlight = ['search_routing', 'vector_search', 'search_quality_eval', 
                              'context_integration', 'prompt_generate', 'answer_generate', 
                              'answer_quality_eval', 'hallucination_detect', 'answer_post', 'end'];
            break;
        case 'graph':
            nodesToHighlight = ['search_routing', 'graph_search', 'search_quality_eval', 
                              'context_integration', 'prompt_generate', 'answer_generate', 
                              'answer_quality_eval', 'hallucination_detect', 'answer_post', 'end'];
            break;
        case 'lattice':
            nodesToHighlight = ['search_routing', 'lattice_oc_search', 'search_quality_eval', 
                              'context_integration', 'prompt_generate', 'answer_generate', 
                              'answer_quality_eval', 'hallucination_detect', 'answer_post', 'end'];
            break;
    }
    
    // Highlight nodes
    nodesToHighlight.forEach(nodeId => {
        d3.select(`#node-${nodeId} rect`).style('opacity', 1);
    });
    
    // Highlight links between highlighted nodes
    workflowData.links.forEach(link => {
        if (nodesToHighlight.includes(link.source) && nodesToHighlight.includes(link.target)) {
            d3.select(`#link-${link.source}-${link.target}`).classed('highlighted', true);
        }
    });
}

function resetHighlight() {
    d3.selectAll('.link').classed('highlighted', false);
    d3.selectAll('.node rect').style('opacity', 1);
}

function highlightConnections(event, d) {
    // Highlight connected nodes and edges on hover
    const connectedNodes = new Set([d.id]);
    
    workflowData.links.forEach(link => {
        if (link.source === d.id) connectedNodes.add(link.target);
        if (link.target === d.id) connectedNodes.add(link.source);
    });
    
    d3.selectAll('.node rect').style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.3);
    d3.selectAll('.link').style('opacity', l => 
        (l.source === d.id || l.target === d.id) ? 1 : 0.2
    );
}

// Node detail information
const nodeDetails = {
    'start': {
        title: 'START - 시작 노드',
        category: 'system',
        description: '워크플로우의 시작점입니다. 사용자 질문을 받아 시스템을 초기화합니다.',
        function: '시스템 초기화 및 라우팅 결정',
        details: `• 인덱싱 완료 여부 확인
• 질문이 있으면 검색 모드로 진입
• 질문이 없으면 인덱싱 모드로 진입`,
        input: '사용자 질문 (선택적)',
        output: '초기 상태 설정',
        code: `def should_start_indexing(state):
    question = state.get("question", "").strip()
    if not question:
        return "doc_loading"  # 질문이 없으면 인덱싱
    
    if state.get("indexing_complete", False):
        return "search_routing"  # 인덱싱 완료면 검색
    return "doc_loading"  # 인덱싱 필요`
    },
    
    'doc_loading': {
        title: 'doc_loading - 문서 로딩',
        category: 'indexing',
        description: 'JSON 문서를 파일 시스템에서 로드하고 파싱합니다.',
        function: '데이터 파일 읽기 및 JSON 파싱',
        details: `• data/ 폴더의 모든 JSON 파일 로드
• 각 파일을 Python 딕셔너리로 변환
• 에러 처리 및 검증 수행`,
        input: 'data/technical_docs.json',
        output: 'List[Dict] - 파싱된 문서들',
        code: `def doc_loading(state):
    json_data = []
    for filename in os.listdir("data"):
        if filename.endswith(".json"):
            with open(f"data/{filename}", 'r') as f:
                json_data.append(json.load(f))
    return {"documents": json_data}`
    },
    
    'doc_chunking': {
        title: 'doc_chunking - 문서 청킹',
        category: 'indexing',
        description: '문서를 의미 있는 단위로 분할합니다.',
        function: '텍스트를 검색 가능한 작은 단위로 분할',
        details: `• 섹션별 분할 (헤더 기준)
• 고정 크기 분할 (토큰 수 기준)
• 오버랩 설정으로 문맥 보존
• 메타데이터 유지`,
        input: 'documents: List[Dict]',
        output: 'chunks: List[Chunk]',
        code: `def doc_chunking(state):
    chunks = []
    for doc in state["documents"]:
        sections = split_by_sections(doc)
        for section in sections:
            chunk = {
                "text": section["content"],
                "metadata": {
                    "source": doc["title"],
                    "section": section["header"]
                }
            }
            chunks.append(chunk)
    return {"chunks": chunks}`
    },
    
    'doc_embedding': {
        title: 'doc_embedding - 임베딩 생성',
        category: 'indexing',
        description: '텍스트 청크를 벡터로 변환합니다.',
        function: 'OpenAI 임베딩 모델로 벡터 생성',
        details: `• OpenAI text-embedding-ada-002 사용
• 1536 차원 벡터 생성
• 배치 처리로 효율성 향상
• 비용 최적화`,
        input: 'chunks: List[Chunk]',
        output: 'embeddings: List[Vector]',
        code: `def doc_embedding(state):
    embedder = OpenAIEmbeddings(
        model="text-embedding-ada-002"
    )
    texts = [chunk["text"] for chunk in state["chunks"]]
    embeddings = embedder.embed_documents(texts)
    
    for chunk, embedding in zip(state["chunks"], embeddings):
        chunk["embedding"] = embedding
    
    return {"embedding_complete": True}`
    },
    
    'keyword_extract': {
        title: 'keyword_extract - 키워드 추출',
        category: 'indexing',
        description: 'spaCy를 사용하여 핵심 키워드를 추출합니다.',
        function: 'NER 및 TF-IDF 기반 키워드 추출',
        details: `• Named Entity Recognition (NER)
• TF-IDF 점수 계산
• 도메인 특화 키워드 사전 활용
• 불용어 제거 및 정규화`,
        input: 'chunks: List[Chunk]',
        output: 'keywords: List[str]',
        code: `def keyword_extract(state):
    nlp = spacy.load("en_core_web_sm")
    keywords = []
    
    for chunk in state["chunks"]:
        doc = nlp(chunk["text"])
        # NER
        entities = [ent.text for ent in doc.ents]
        # 명사구 추출
        noun_phrases = [chunk.text for chunk in doc.noun_chunks]
        keywords.extend(entities + noun_phrases)
    
    return {"keywords": list(set(keywords))}`
    },
    
    'neo4j_save': {
        title: 'neo4j_save - 그래프 DB 저장',
        category: 'indexing',
        description: 'Neo4j 그래프 데이터베이스에 저장합니다.',
        function: '노드와 관계 생성',
        details: `• Chunk 노드 생성
• 임베딩 프로퍼티 추가
• 문서 간 관계 설정
• 벡터 인덱스 생성`,
        input: 'chunks with embeddings',
        output: 'graph_complete: True',
        code: `def neo4j_save(state):
    for chunk in state["chunks"]:
        query = """
        CREATE (c:Chunk {
            text: $text,
            embedding: $embedding,
            source: $source
        })
        """
        graph.query(query, {
            "text": chunk["text"],
            "embedding": chunk["embedding"],
            "source": chunk["metadata"]["source"]
        })
    return {"graph_complete": True}`
    },
    
    'fc_extract': {
        title: 'fc_extract - FCA 분석',
        category: 'indexing',
        description: 'Formal Concept Analysis를 수행합니다.',
        function: '개념 격자 구축',
        details: `• 문서-키워드 이진 매트릭스 생성
• 형식 개념 추출
• 개념 간 계층 관계 계산
• 격자 구조 생성`,
        input: 'documents, keywords',
        output: 'concept_lattice',
        code: `def fc_extract(state):
    # 이진 매트릭스 생성
    binary_matrix = create_binary_matrix(
        state["documents"], 
        state["keywords"]
    )
    
    # FCA 수행
    context = Context(binary_matrix)
    concepts = context.intension()
    lattice = build_lattice(concepts)
    
    return {"concept_lattice": lattice}`
    },
    
    'fc_csv_save': {
        title: 'fc_csv_save - FCA 저장',
        category: 'indexing',
        description: 'FCA 결과를 CSV 파일로 저장합니다.',
        function: 'CSV 형식으로 개념 격자 저장',
        details: `• formal_concept.csv 생성
• lattice_binary_table.csv 생성
• 계층 관계 정보 포함
• 추후 빠른 로드를 위한 캐싱`,
        input: 'concept_lattice',
        output: 'fc_complete: True',
        code: `def fc_csv_save(state):
    lattice_df = pd.DataFrame(state["concept_lattice"])
    lattice_df.to_csv("db/formal_concept.csv", index=False)
    
    binary_df = pd.DataFrame(state["binary_matrix"])
    binary_df.to_csv("db/lattice_binary_table.csv")
    
    return {"fc_complete": True}`
    },
    
    'search_routing': {
        title: 'search_routing - 검색 라우팅',
        category: 'router',
        description: '질문을 분석하여 최적의 검색 방법을 결정합니다.',
        function: '질문 유형 분류 및 검색 전략 선택',
        details: `• 키워드 기반 분류
• LLM 기반 의도 파악 (선택적)
• 5가지 검색 전략 중 선택
• 재검색 횟수 관리`,
        input: 'question: str',
        output: 'search_method: str',
        code: `def search_routing(state):
    question = state["question"].lower()
    
    if "계층" in question or "상위" in question:
        return "hierarchy_query"
    elif "유사" in question or "비슷" in question:
        return "similarity_concept_query"
    elif "관계" in question or "연결" in question:
        return "relationship_query"
    elif "전체" in question or "종합" in question:
        return "complex_query"
    else:
        return "simple_query"`
    },
    
    'vector_search': {
        title: 'vector_search - 벡터 검색',
        category: 'search',
        description: '임베딩 벡터를 사용한 유사도 검색을 수행합니다.',
        function: '코사인 유사도 기반 검색',
        details: `• 질문 임베딩 생성
• Neo4j 벡터 인덱스 검색
• Top-K 결과 추출
• 유사도 점수 기반 필터링`,
        input: 'question embedding',
        output: 'search_results: List[Chunk]',
        code: `def vector_search(state):
    query_embedding = embedder.embed(state["question"])
    
    cypher = """
    MATCH (c:Chunk)
    WITH c, gds.similarity.cosine(
        c.embedding, $embedding
    ) AS score
    WHERE score > $threshold
    RETURN c.text, score
    ORDER BY score DESC
    LIMIT $top_k
    """
    
    results = graph.query(cypher, {
        "embedding": query_embedding,
        "threshold": 0.7,
        "top_k": 3
    })
    return {"search_results": results}`
    },
    
    'graph_search': {
        title: 'graph_search - 그래프 검색',
        category: 'search',
        description: 'Neo4j에서 관계 기반 검색을 수행합니다.',
        function: '엔티티 간 관계 탐색',
        details: `• 엔티티 추출
• 관계 패턴 매칭
• 경로 탐색 알고리즘
• 관계 가중치 고려`,
        input: 'entities: List[str]',
        output: 'related_chunks: List[Chunk]',
        code: `def graph_search(state):
    entities = extract_entities(state["question"])
    
    cypher = """
    MATCH (n1:Entity)-[r]-(n2:Entity)
    WHERE n1.name IN $entities
    OPTIONAL MATCH (n1)-[*1..2]-(related:Chunk)
    RETURN n1, r, n2, collect(related) as chunks
    ORDER BY r.weight DESC
    """
    
    results = graph.query(cypher, {"entities": entities})
    return {"search_results": results}`
    },
    
    'lattice_oc_search': {
        title: 'lattice_oc_search - 계층 검색',
        category: 'search',
        description: 'FCA 격자에서 계층적 관계를 검색합니다.',
        function: 'Order Coverage 알고리즘',
        details: `• 개념 추출
• 상위 개념 (일반화) 탐색
• 하위 개념 (특수화) 탐색
• 계층 레벨 계산`,
        input: 'concept: str',
        output: 'hierarchy: Dict',
        code: `def lattice_oc_search(state):
    concept = extract_concept(state["question"])
    lattice = load_lattice()
    
    # 상위 개념
    super_concepts = lattice.get_super_concepts(concept)
    # 하위 개념
    sub_concepts = lattice.get_sub_concepts(concept)
    
    hierarchy = {
        "concept": concept,
        "super": super_concepts,
        "sub": sub_concepts,
        "level": lattice.get_level(concept)
    }
    
    return {"search_results": hierarchy}`
    },
    
    'lattice_jaccard_search': {
        title: 'lattice_jaccard_search - 유사도 검색',
        category: 'search',
        description: 'Jaccard 유사도로 유사 개념을 찾습니다.',
        function: '집합 유사도 계산',
        details: `• 속성 집합 비교
• Jaccard 계수 계산: |A∩B| / |A∪B|
• 유사도 임계값 적용
• 상위 N개 유사 개념 반환`,
        input: 'concept: str',
        output: 'similar_concepts: List',
        code: `def lattice_jaccard_search(state):
    concept = extract_concept(state["question"])
    lattice = load_lattice()
    
    similarities = []
    for other in lattice.concepts:
        if other != concept:
            jaccard = calculate_jaccard(
                concept.attributes,
                other.attributes
            )
            similarities.append((other, jaccard))
    
    # 유사도 순 정렬
    similarities.sort(key=lambda x: x[1], reverse=True)
    return {"search_results": similarities[:5]}`
    },
    
    'hybrid_search': {
        title: 'hybrid_search - 하이브리드 검색',
        category: 'search',
        description: '모든 검색 방법을 통합하여 사용합니다.',
        function: '다중 검색 전략 병렬 실행',
        details: `• Vector + Graph + Lattice 동시 실행
• 결과 통합 및 중복 제거
• 가중치 기반 재순위화
• 다양성 보장`,
        input: 'question: str',
        output: 'integrated_results',
        code: `def hybrid_search(state):
    # 병렬 검색 실행
    vector_results = vector_search(state)
    graph_results = graph_search(state)
    lattice_results = lattice_oc_search(state)
    
    # 결과 통합
    all_results = merge_results([
        (vector_results, 0.4),
        (graph_results, 0.3),
        (lattice_results, 0.3)
    ])
    
    # 재순위화
    reranked = rerank_by_diversity(all_results)
    return {"search_results": reranked}`
    },
    
    'search_quality_eval': {
        title: 'search_quality_eval - 검색 품질 평가',
        category: 'quality',
        description: '검색 결과의 품질을 평가합니다.',
        function: '관련성, 커버리지, 다양성 평가',
        details: `• 관련성 점수: 질문과의 매칭도
• 커버리지: 정보의 완전성
• 다양성: 다양한 관점 포함 여부
• 임계값: 0.7 이상 통과`,
        input: 'search_results',
        output: 'quality_score, decision',
        code: `def search_quality_eval(state):
    results = state["search_results"]
    
    # 품질 지표 계산
    relevance = calculate_relevance(results, state["question"])
    coverage = calculate_coverage(results)
    diversity = calculate_diversity(results)
    
    # 종합 점수
    quality_score = (relevance * 0.5 + 
                    coverage * 0.3 + 
                    diversity * 0.2)
    
    return {
        "search_quality": quality_score,
        "decision": "pass" if quality_score >= 0.7 else "fail"
    }`
    },
    
    'context_integration': {
        title: 'context_integration - 컨텍스트 통합',
        category: 'generation',
        description: '검색된 정보를 하나의 컨텍스트로 통합합니다.',
        function: '중복 제거 및 정보 통합',
        details: `• 중복 정보 제거
• 관련성 순 정렬
• 토큰 수 제한 고려
• 메타데이터 보존`,
        input: 'search_results',
        output: 'integrated_context',
        code: `def context_integrate(state):
    results = state["search_results"]
    
    # 중복 제거
    unique_chunks = remove_duplicates(results)
    
    # 관련성 순 정렬
    sorted_chunks = sort_by_relevance(unique_chunks)
    
    # 컨텍스트 생성
    context = "\\n\\n".join([
        f"[{i+1}] {chunk.text}"
        for i, chunk in enumerate(sorted_chunks)
    ])
    
    return {"context": context}`
    },
    
    'prompt_generate': {
        title: 'prompt_generate - 프롬프트 생성',
        category: 'generation',
        description: 'LLM을 위한 프롬프트를 생성합니다.',
        function: '구조화된 프롬프트 템플릿 적용',
        details: `• 시스템 프롬프트 설정
• 컨텍스트 주입
• 질문 포맷팅
• Few-shot 예시 추가 (선택적)`,
        input: 'context, question',
        output: 'prompt: str',
        code: `def prompt_generate(state):
    template = """다음 컨텍스트를 바탕으로 질문에 답변해주세요.
    
컨텍스트:
{context}

질문: {question}

답변 시 다음 사항을 고려하세요:
1. 컨텍스트에 있는 정보만 사용
2. 명확하고 구체적으로 답변
3. 불확실한 경우 명시

답변:"""
    
    prompt = template.format(
        context=state["context"],
        question=state["question"]
    )
    return {"prompt": prompt}`
    },
    
    'answer_generate': {
        title: 'answer_generate - 답변 생성',
        category: 'generation',
        description: 'LLM을 사용하여 최종 답변을 생성합니다.',
        function: 'OpenAI GPT-4로 답변 생성',
        details: `• GPT-4 또는 GPT-3.5 사용
• Temperature 설정 (0.0-1.0)
• Max tokens 제한
• 스트리밍 지원 (선택적)`,
        input: 'prompt: str',
        output: 'answer: str',
        code: `def answer_generate(state):
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=state.get("temperature", 0.0)
    )
    
    response = llm.invoke(state["prompt"])
    
    return {
        "answer": response.content,
        "model_used": "gpt-4",
        "tokens_used": response.usage
    }`
    },
    
    'answer_quality_eval': {
        title: 'answer_quality_eval - 답변 품질 평가',
        category: 'quality',
        description: '생성된 답변의 품질을 평가합니다.',
        function: '완전성, 정확성, 일관성 평가',
        details: `• 완전성: 질문의 모든 부분에 답변했는가
• 정확성: 컨텍스트와 일치하는가
• 일관성: 논리적으로 일관된가
• 임계값: 0.8 이상 통과`,
        input: 'answer, question, context',
        output: 'quality_score',
        code: `def answer_quality_eval(state):
    # LLM을 사용한 평가
    eval_prompt = f"""
답변 품질을 평가해주세요.
질문: {state["question"]}
답변: {state["answer"]}

평가 기준:
- 완전성 (0-10)
- 정확성 (0-10)
- 일관성 (0-10)
"""
    
    eval_result = llm.invoke(eval_prompt)
    scores = parse_scores(eval_result)
    
    quality_score = sum(scores.values()) / 30
    return {"quality_score": quality_score}`
    },
    
    'hallucination_detect': {
        title: 'hallucination_detect - 환각 감지',
        category: 'quality',
        description: '답변에 환각이 있는지 검사합니다.',
        function: '사실 확인 및 출처 검증',
        details: `• 컨텍스트에 없는 정보 감지
• 사실 왜곡 확인
• 논리적 모순 검사
• 신뢰도 점수 계산`,
        input: 'answer, context',
        output: 'hallucination_score',
        code: `def hallucination_detect(state):
    # 답변을 문장 단위로 분할
    sentences = split_sentences(state["answer"])
    
    hallucinations = []
    for sentence in sentences:
        # 컨텍스트에서 근거 찾기
        evidence = find_evidence(sentence, state["context"])
        if not evidence:
            hallucinations.append(sentence)
    
    hallucination_ratio = len(hallucinations) / len(sentences)
    
    return {
        "hallucination_score": hallucination_ratio,
        "flagged_sentences": hallucinations,
        "decision": "pass" if hallucination_ratio < 0.2 else "rewrite"
    }`
    },
    
    'query_rewrite': {
        title: 'query_rewrite - 쿼리 재작성',
        category: 'generation',
        description: '검색 실패 시 질문을 재작성합니다.',
        function: '질문 개선 및 명확화',
        details: `• 모호한 표현 제거
• 키워드 확장
• 동의어 추가
• 검색 친화적 형태로 변환`,
        input: 'original_question, failure_reason',
        output: 'rewritten_question',
        code: `def query_rewrite(state):
    rewrite_prompt = f"""
원래 질문: {state["original_question"]}
실패 이유: {state.get("failure_reason", "낮은 품질")}

이 질문을 더 명확하고 검색하기 쉽게 재작성해주세요.
- 구체적인 키워드 사용
- 모호한 표현 제거
- 핵심 의도 유지

재작성된 질문:"""
    
    response = llm.invoke(rewrite_prompt)
    
    return {
        "question": response.content,
        "rewrite_count": state.get("rewrite_count", 0) + 1
    }`
    },
    
    'answer_post': {
        title: 'answer_post - 답변 후처리',
        category: 'generation',
        description: '최종 답변을 포맷팅하고 마무리합니다.',
        function: '답변 정리 및 메타데이터 추가',
        details: `• 포맷팅 적용
• 참조 추가
• 신뢰도 점수 표시
• 로깅 및 분석용 데이터 저장`,
        input: 'answer, metadata',
        output: 'final_answer',
        code: `def answer_post(state):
    # 포맷팅
    formatted_answer = format_answer(state["answer"])
    
    # 메타데이터 추가
    final_answer = f"""
{formatted_answer}

---
검색 방법: {state["search_method"]}
신뢰도: {state.get("quality_score", 0):.2f}
처리 시간: {state.get("processing_time", 0):.2f}초
"""
    
    # 로깅
    log_interaction(state)
    
    return {"final_answer": final_answer}`
    },
    
    'end': {
        title: 'END - 종료 노드',
        category: 'system',
        description: '워크플로우를 종료하고 결과를 반환합니다.',
        function: '최종 상태 정리 및 반환',
        details: `• 최종 답변 반환
• 리소스 정리
• 성능 메트릭 기록
• 세션 종료`,
        input: 'final_answer',
        output: '사용자에게 답변 전달',
        code: `def end_workflow(state):
    # 성능 메트릭 기록
    metrics = {
        "total_time": time.time() - state["start_time"],
        "search_method": state["search_method"],
        "quality_score": state.get("quality_score", 0),
        "rewrite_count": state.get("rewrite_count", 0)
    }
    
    save_metrics(metrics)
    
    return {
        "final_answer": state["final_answer"],
        "metrics": metrics
    }`
    }
};

function showNodeDetails(event, d) {
    const modal = document.getElementById('node-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const details = nodeDetails[d.id] || {
        title: d.label,
        category: d.type,
        description: `${d.type} 타입의 노드입니다.`,
        function: '기능 설명 없음',
        details: '상세 정보 없음',
        input: 'N/A',
        output: 'N/A',
        code: ''
    };
    
    // 카테고리별 색상
    const categoryColors = {
        'system': '#10b981',
        'indexing': '#3b82f6',
        'router': '#8b5cf6',
        'search': '#f59e0b',
        'quality': '#ec4899',
        'generation': '#06b6d4'
    };
    
    const categoryColor = categoryColors[details.category] || '#6b7280';
    
    modalTitle.textContent = details.title;
    modalBody.innerHTML = `
        <div style="background: ${categoryColor}; color: white; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
            <strong>카테고리:</strong> ${details.category.toUpperCase()}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">📋 설명</h4>
            <p style="color: #4b5563; line-height: 1.6;">${details.description}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">⚙️ 주요 기능</h4>
            <p style="color: #4b5563; font-weight: 600;">${details.function}</p>
            <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <pre style="margin: 0; color: #374151; white-space: pre-wrap;">${details.details}</pre>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #e0f2fe; padding: 15px; border-radius: 5px;">
                <h5 style="color: #0369a1; margin-bottom: 5px;">📥 입력</h5>
                <p style="color: #0c4a6e; font-size: 14px; margin: 0;">${details.input}</p>
            </div>
            <div style="background: #dcfce7; padding: 15px; border-radius: 5px;">
                <h5 style="color: #166534; margin-bottom: 5px;">📤 출력</h5>
                <p style="color: #14532d; font-size: 14px; margin: 0;">${details.output}</p>
            </div>
        </div>
        
        ${details.code ? `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">💻 코드 예시</h4>
            <div style="background: #1f2937; color: #e5e7eb; padding: 15px; border-radius: 5px; overflow-x: auto;">
                <pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 13px;"><code>${details.code}</code></pre>
            </div>
        </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeWorkflow();
    
    // Setup modal close
    const modal = document.getElementById('node-modal');
    const span = document.getElementsByClassName('close')[0];
    
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };
});