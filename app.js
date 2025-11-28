// app.ts (PC 마우스 드래그 스와이프 추가 버전) 
document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'ko';
    let currentIndex = 0;
    const totalSlides = 4;
    // 드래그 관련 변수
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    // DOM 요소 가져오기
    const langSelect = document.getElementById('lang-select');
    const langToggle = document.getElementById('lang-toggle');
    const langButtons = document.querySelectorAll('#lang-options button');
    const container = document.getElementById('catalog-container');
    const scrollWrapper = document.getElementById('horizontal-scroll-wrapper');
    const loader = document.getElementById('loader');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    /**
     * 카탈로그 이미지 생성 함수
     */
    function buildCatalogContent(lang) {
        scrollWrapper.innerHTML = '';
        scrollWrapper.scrollLeft = 0;
        currentIndex = 0;
        for (let i = 1; i <= 4; i++) {
            const img = document.createElement('img');
            img.src = `catalogs/catalog-${lang}-0${i}.png`;
            img.alt = `Catalog ${lang} page ${i}`;
            // [중요] 이미지 자체의 드래그를 막아야 부모의 드래그 이벤트가 정상 작동함
            img.draggable = false;
            scrollWrapper.appendChild(img);
        }
        updateNavButtons();
    }
    /**
     * 화살표 버튼 상태 업데이트
     */
    function updateNavButtons() {
        if (currentIndex <= 0)
            prevBtn.classList.add('disabled');
        else
            prevBtn.classList.remove('disabled');
        if (currentIndex >= totalSlides - 1)
            nextBtn.classList.add('disabled');
        else
            nextBtn.classList.remove('disabled');
    }
    /**
     * 특정 슬라이드로 이동
     */
    function scrollToSlide(index) {
        const slideWidth = scrollWrapper.clientWidth;
        scrollWrapper.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
        // currentIndex는 scroll 이벤트에서 업데이트되므로 여기선 설정 안 함
    }
    // ============================================================
    // 이벤트 리스너 (드래그 로직 포함)
    // ============================================================
    // --- [신규] PC 마우스 드래그 스와이프 로직 시작 ---
    // 1. 마우스 클릭 시 (드래그 시작)
    scrollWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollWrapper.classList.add('dragging'); // 커서 변경 및 스냅 해제
        startX = e.pageX - scrollWrapper.offsetLeft; // 클릭한 X 좌표 기억
        scrollLeft = scrollWrapper.scrollLeft; // 현재 스크롤 위치 기억
    });
    // 2. 마우스 뗐을 때 (드래그 종료)
    scrollWrapper.addEventListener('mouseup', () => {
        isDown = false;
        scrollWrapper.classList.remove('dragging'); // 스냅 다시 활성화 (자동으로 자리 잡음)
    });
    // 3. 마우스가 영역을 벗어났을 때 (드래그 종료)
    scrollWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        scrollWrapper.classList.remove('dragging');
    });
    // 4. 마우스 이동 시 (실제 스크롤 동작)
    scrollWrapper.addEventListener('mousemove', (e) => {
        if (!isDown)
            return; // 클릭 상태가 아니면 무시
        e.preventDefault(); // 텍스트 선택 등 기본 동작 방지
        const x = e.pageX - scrollWrapper.offsetLeft;
        const walk = (x - startX) * 2; // 이동 거리 계산 (속도 조절: * 숫자로 조절 가능)
        scrollWrapper.scrollLeft = scrollLeft - walk; // 스크롤 위치 업데이트
    });
    // --- [신규] PC 마우스 드래그 스와이프 로직 끝 ---
    // 화살표 버튼 클릭
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0)
            scrollToSlide(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1)
            scrollToSlide(currentIndex + 1);
    });
    // 스크롤 이벤트 (인덱스 동기화 - 드래그 및 터치 모두 대응)
    let isScrolling;
    scrollWrapper.addEventListener('scroll', () => {
        // 스크롤이 멈춘 후에 인덱스를 업데이트하기 위한 디바운싱(Debouncing)
        window.clearTimeout(isScrolling);
        isScrolling = window.setTimeout(() => {
            const slideWidth = scrollWrapper.clientWidth;
            const newIndex = Math.round(scrollWrapper.scrollLeft / slideWidth);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateNavButtons();
            }
        }, 100); // 스크롤 종료 0.1초 후 실행
    });
    // 언어 버튼 클릭
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (lang && lang !== currentLang) {
                currentLang = lang;
                updateActiveButton();
                loader.classList.add('visible');
                container.style.opacity = '0';
                setTimeout(() => {
                    buildCatalogContent(currentLang);
                    loader.classList.remove('visible');
                    container.style.opacity = '1';
                }, 300);
            }
            if (window.innerWidth <= 1200)
                langSelect.classList.remove('dropdown-open');
        });
    });
    // 버튼 활성화 UI 업데이트
    function updateActiveButton() {
        langButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.lang === currentLang);
        });
    }
    // 모바일 토글 및 외부 클릭 닫기
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langSelect.classList.toggle('dropdown-open');
        });
    }
    document.addEventListener('click', () => {
        if (langSelect.classList.contains('dropdown-open')) {
            langSelect.classList.remove('dropdown-open');
        }
    });
    // 초기 실행
    buildCatalogContent(currentLang);
    loader.classList.remove('visible');
});
