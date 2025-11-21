// app.ts (드롭다운 기능 추가)
// HTML 문서 로드가 완료되면 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1. 필요한 요소 가져오기
    let currentLang = 'ko'; // 기본값
    // [수정됨] 드롭다운 관련 요소
    const langSelect = document.getElementById('lang-select');
    const langToggle = document.getElementById('lang-toggle');
    // [수정됨] 버튼 선택자를 더 구체적으로 변경
    const langButtons = document.querySelectorAll('#lang-options button');
    const container = document.getElementById('catalog-container');
    const loader = document.getElementById('loader');
    /**
     * 카탈로그 DOM을 생성하는 함수 (기존과 동일)
     */
    function buildCatalogContent(lang) {
        container.innerHTML = ''; // 컨테이너 비우기
        for (let i = 1; i <= 4; i++) {
            const img = document.createElement('img');
            img.src = `catalogs/catalog-${lang}-0${i}.png`;
            img.alt = `Catalog ${lang} page ${i}`;
            container.appendChild(img);
        }
    }
    /**
     * 활성화된 버튼 UI 업데이트 (기존과 동일)
     */
    function updateActiveButton() {
        langButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.lang === currentLang);
        });
    }
    // 5. 언어 버튼 클릭 이벤트 (기존 애니메이션 로직)
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(button.dataset.lang + " 버튼 클릭됨!");
            const lang = button.dataset.lang;
            if (lang && lang !== currentLang) { // 다른 언어를 클릭했을 때
                currentLang = lang;
                updateActiveButton();
                // --- 애니메이션 로직 시작 ---
                loader.classList.add('visible');
                container.style.opacity = '0';
                setTimeout(() => {
                    buildCatalogContent(currentLang);
                    loader.classList.remove('visible');
                    container.style.opacity = '1';
                }, 300);
                // --- 애니메이션 로직 끝 ---
            }
            // [추가됨] 언어를 클릭하면 드롭다운을 닫음 (모바일에서만)
            if (window.innerWidth <= 460) {
                langSelect.classList.remove('dropdown-open');
            }
        });
    });
    // 6. [추가됨] 모바일 토글 버튼 클릭 이벤트
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // 이벤트가 다른 곳으로 전파되는 것을 막음
            langSelect.classList.toggle('dropdown-open'); // 드롭다운 열기/닫기
        });
    }
    console.log("이미지 뷰어 모드 실행 완료. 버튼 이벤트 연결됨.");
    // 7. 페이지 첫 로드 (기존과 동일)
    buildCatalogContent(currentLang);
    loader.classList.remove('visible');
});
