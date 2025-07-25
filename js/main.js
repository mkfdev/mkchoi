// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// Header 패딩 조정 함수
function adjustPadding() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const headerHeight = header.offsetHeight;
    main.style.paddingTop = `${headerHeight}px`;
}

// 패딩 조정 이벤트 리스너
window.addEventListener('DOMContentLoaded', adjustPadding);
window.addEventListener('resize', adjustPadding);

// 스크롤 시 헤더에 클래스 추가
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 페이지 로드 완료 후 실행
window.addEventListener('load', () => {
    // DOM 요소 선택
    const mainSection = document.querySelector('#main');
    const mainText = document.querySelector('#main .main-text');
    const subTextSpans = document.querySelectorAll('#main .sub-text span');
    const mainGuide = document.querySelector('.main-guide');
    const aboutSection = document.querySelector('#about');
    const aboutTitle = document.querySelector('#about h2');
    const aboutParagraphs = document.querySelectorAll('#about p');

    // Main 섹션 스크롤 효과
    gsap.to(mainText, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
            trigger: mainSection,
            start: 'center center',
            end: 'bottom top',
            scrub: 1,
        }
    });

    // Sub text spans 순차적 페이드 아웃
    subTextSpans.forEach((span, index) => {
        gsap.to(span, {
            scrollTrigger: {
                trigger: mainSection,
                start: 'center center',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const delay = index * 0.1;
                    const adjustedProgress = Math.max(0, (progress - delay) / (1 - delay));
                    
                    gsap.set(span, {
                        opacity: 1 - adjustedProgress,
                        x: -20 * adjustedProgress
                    });
                }
            }
        });
    });

    // 스크롤 가이드 페이드 아웃
    gsap.to(mainGuide, {
        opacity: 0,
        y: -20,
        scrollTrigger: {
            trigger: mainSection,
            start: 'top top',
            end: '30% top',
            scrub: 1,
        }
    });

    // About 섹션 진입 애니메이션
    gsap.fromTo(aboutTitle, 
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
            }
        }
    );

    // About 단락들 순차적 진입
    aboutParagraphs.forEach((p, index) => {
        gsap.fromTo(p,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: aboutSection,
                    start: `top ${75 - index * 5}%`,
                    scrub: 1,
                }
            }
        );
    });

    // Parallax Background
    gsap.to('.main-bg', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: mainSection,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 접근성 고려
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
});

// Blog Module 애니메이션 - 최종 최적화 버전
document.querySelectorAll('.blog-module').forEach((module) => {
    const bgFill = module.querySelector('.blog-bg-fill');
    const textContent = module.querySelector('.blog-text');
    const cards = module.querySelectorAll('.blog-card');
    
    // 초기 설정 - GPU 가속
    gsap.set(bgFill, { 
        xPercent: -100,
        force3D: true
    });
    
    // 텍스트 애니메이션
    gsap.fromTo(textContent, 
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: module,
                start: "top 80%",
            }
        }
    );
    
    // ⭐ 핵심: 단일 애니메이션으로 모든 것 처리
    gsap.to(bgFill, {
        xPercent: 0,
        ease: "none",
        scrollTrigger: {
            trigger: module,
            start: "top center",
            end: "80% bottom", // 80% 지점에서 완료
            scrub: 0.3, // 부드러운 스크럽
            onUpdate: (self) => {
                // 30% 지점에서 클래스 추가
                if (self.progress > 0.3) {
                    module.classList.add('filled');
                }
            },
            onComplete: () => {
                module.classList.add('filled');
            }
        }
    });
    
    // 카드 애니메이션
    cards.forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                }
            }
        );
    });
});

// 윈도우 리사이즈 처리
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// 성능 최적화
ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40
});


// 이메일 복사 기능
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(function() {
        showNotification('이메일 주소가 복사되었습니다!');
    }).catch(function() {
        // ie 및 구형브라우저 대응
        // clipboard API가 지원되지 않는 경우 fallback
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('이메일 주소가 복사되었습니다!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: fadeInOut 2.5s ease;
    `;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2500);
}

// 이메일 링크들에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    // 소셜 링크의 이메일 아이콘
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const email = this.getAttribute('data-email');
            copyEmail(email);
        });
    }

    // 연락처 정보의 이메일
    const emailContact = document.querySelector('.email-contact');
    if (emailContact) {
        emailContact.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const email = this.getAttribute('data-email');
            copyEmail(email);
        });
    }
});