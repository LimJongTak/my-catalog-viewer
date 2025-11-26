// app.ts (스크롤 애니메이션 포함 최종 버전)

document.addEventListener('DOMContentLoaded', () => {
    
    let currentLang = 'ko'; // 기본 언어 설정
    
    // DOM 요소 가져오기
    const langSelect = document.getElementById('lang-select') as HTMLDivElement;
    const langToggle = document.getElementById('lang-toggle') as HTMLButtonElement;
    const langButtons = document.querySelectorAll<HTMLButtonElement>('#lang-options button');
    const container = document.getElementById('catalog-container') as HTMLDivElement;
    const loader = document.getElementById('loader') as HTMLDivElement;

    // ============================================================
    // ▼▼▼ 스크롤 감지 관찰자(Intersection Observer) 설정 ▼▼▼
    // ============================================================
    const observerOptions = {
        root: null, // 뷰포트 기준
        rootMargin: '0px',
        threshold: 0.15 // 이미지의 15%가 보이면 작동
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면에 들어오면 'show' 클래스 추가 (CSS 애니메이션 시작)
                entry.target.classList.add('show');
                // 성능을 위해 관찰 중단
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    /**
     * 카탈로그 이미지를 생성하고 관찰자를 부착하는 함수
     */
    function buildCatalogContent(lang: string) {
        container.innerHTML = ''; // 기존 내용 비우기
        
        // 1~4페이지 이미지 생성
        for (let i = 1; i <= 4; i++) {
            const img = document.createElement('img');
            // 이미지 경로 설정 (파일명 규칙에 맞게 수정 필요)
            img.src = `catalogs/catalog-${lang}-0${i}.png`;
            img.alt = `Catalog ${lang} page ${i}`;
            
            // ▼▼▼ 생성된 이미지를 관찰자에게 등록 ▼▼▼
            imageObserver.observe(img);

            container.appendChild(img);
        }
    }

    /**
     * 버튼 활성화 상태 UI 업데이트
     */
    function updateActiveButton() {
        langButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.lang === currentLang);
        });
    }

    // ============================================================
    // 이벤트 리스너 등록
    // ============================================================

    // 언어 선택 버튼 클릭 이벤트
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            // 다른 언어를 클릭했을 때만 실행
            if (lang && lang !== currentLang) {
                currentLang = lang;
                updateActiveButton();

                // 언어 변경 시 컨테이너 전체 페이드 아웃/인 효과
                loader.classList.add('visible');
                container.style.opacity = '0'; 

                setTimeout(() => {
                    buildCatalogContent(currentLang); // 새 이미지 생성 및 관찰 시작
                    loader.classList.remove('visible');
                    container.style.opacity = '1';
                }, 300); // CSS transition 시간과 맞춤 (0.3s)
            }
            
            // 모바일 환경이면 드롭다운 닫기
            if (window.innerWidth <= 1200) {
                langSelect.classList.remove('dropdown-open');
            }
        });
    });

    // 모바일 토글 버튼 클릭 이벤트
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // 이벤트 전파 방지
            langSelect.classList.toggle('dropdown-open');
        });
    }

    // 화면 아무 곳이나 클릭하면 드롭다운 닫기 (UX 개선)
    document.addEventListener('click', () => {
        if (langSelect.classList.contains('dropdown-open')) {
            langSelect.classList.remove('dropdown-open');
        }
    });


    // ============================================================
    // 초기 실행
    // ============================================================
    buildCatalogContent(currentLang);
    loader.classList.remove('visible');
    console.log("카탈로그 뷰어 앱이 실행되었습니다.");
});