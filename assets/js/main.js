const data = [
    // Tin tức, sự kiện
    { category: "Tin tức", title: "Trồng khoai mì ruột vàng mang lại thu nhập cao", link: './news-detail.html' },
    { category: "Sự kiện", title: "KHÁT VỌNG SÔNG VÀM 2024 - LONG AN ĐÃ SẴN SÀNG", link: './event-detail.html' },
    // Tour
    { category: "Tour", title: "Tour du lịch Làng nổi Tân Lập", link: './tour-chitiet.html' },
    // Điểm đến
    { category: "Điểm đến nổi bật", title: "Nhà Trăm Cột", link: './diemden-chitiet.html' },
    { category: "Điểm du lịch", title: "Trung tâm Nghiên cứu Bảo tồn và Phát triển Dược liệu Đồng Tháp Mười", link: './diemdulich-chitiet.html' },
];

$(document).ready(function () {

    $('.btn-feedback').click(function() {
        $('.feedback-form').addClass('active')
        $('.blur').addClass('active')
    })

    $('.feedback-form .close').click(function() {
        $('.feedback-form').removeClass('active')
        $('.blur').removeClass('active')
    })

    $('.blur').click(function() {
        $('.feedback-form').removeClass('active')
        $('.blur').removeClass('active')
    })

    $('.album-item').click(function() {
        $('.album-popup').addClass('active')
    })

    $('.album-popup .close').click(function() {
        $('.album-popup').removeClass('active')
    })

    /**
    * SEARCHING 
    **/

    $('.btn-search').click(function () {
        $('header .search-container').toggleClass('active');
        $(this).toggleClass('active');
    })

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.search-container, .btn-search').length) {
            $('header .search-container').removeClass('active');
            $('.btn-search').removeClass('active');
        }
    });

    const searchBar = document.getElementById('search-bar');
    const resultsList = document.getElementById('results');

    function displayResults(query) {
        resultsList.innerHTML = '';

        if (query.trim() === '') {
            return;
        }

        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        filtered.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.link}"><span class="category">[${item.category}]</span> ${item.title}</a>`;
            // li.onclick = () => {
            //     alert(`Bạn chọn: ${item.title} (${item.category})`);
            // };
            resultsList.appendChild(li);
        });

        if (filtered.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Không tìm thấy kết quả phù hợp";
            resultsList.appendChild(li);
        }
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            displayResults(e.target.value);
        });

        document.addEventListener('click', () => {
            $('#results').removeClass('active')
        });

        searchBar.addEventListener('click', (event) => {
            results.classList.add('active');
            event.stopPropagation();
        });
    }

    /**
    * SLIDERS
    **/

    new Swiper(".album-slide", {
        loop: true,
        navigation: {
            nextEl: ".swiper-btn-next",
            prevEl: ".swiper-btn-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 8000,
        },
    });

    new Swiper(".banner-slider", {
        loop: true,
        navigation: {
            nextEl: ".swiper-btn-next",
            prevEl: ".swiper-btn-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 8000,
        },
    });

    if ($('.food-list .swiper-wrapper').length > 0) {
        new Swiper(".food-list", {
            slidesPerView: 1.3,
            centeredSlides: true,
            spaceBetween: 12,
            loop: true,
            navigation: {
                nextEl: ".swiper-btn-next",
                prevEl: ".swiper-btn-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 8000,
            },
            breakpoints: {
                1500: {
                    slidesPerView: 1.8,
                },
                991: {
                    slidesPerView: 1.5,
                    centeredSlides: true,
                },
                768: {
                    slidesPerView: 1.2,
                    centeredSlides: false,
                }
            },
        });
    }

    if ($('.guide-list .swiper-wrapper').length > 0) {
        new Swiper(".guide-list", {
            spaceBetween: 24,
            slidesPerView: 1.5,
            centeredSlides: true,
            loop: true,
            navigation: {
                nextEl: ".swiper-btn-next",
                prevEl: ".swiper-btn-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 8000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                    centeredSlides: false,
                },
                991: {
                    slidesPerView: 3,
                    centeredSlides: false,
                },
                768: {
                    slidesPerView: 2.4,
                    centeredSlides: false,
                }
            },
        });
    }

    
    if ($('.news-list .swiper-wrapper').length > 0) {
        new Swiper(".news-list", {
            spaceBetween: 24,
            slidesPerView: 1.15,
            loop: true,
            navigation: {
                nextEl: ".swiper-btn-next",
                prevEl: ".swiper-btn-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 8000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3.2,
                },
                768: {
                    slidesPerView: 2.2,
                }
            },
        });
    }


    if ($('.component-list .swiper-wrapper').length > 0) {
        new Swiper(".component-list", {
            spaceBetween: 24,
            slidesPerView: 1.15,
            loop: true,
            navigation: {
                nextEl: ".swiper-btn-next",
                prevEl: ".swiper-btn-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 8000,
            },
            breakpoints: {
                1200: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 2.2,
                }
            },
        });
    }


    const mainSwiper = new Swiper('.main-slider', {
        loop: true,
        loopedSlides: 4,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Khởi tạo Thumbnail Swiper (Ảnh thu nhỏ)
    const thumbnailSwiper = new Swiper('.thumbnail-slider', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        loop: true,
        slideToClickedSlide: true,
        loopedSlides: 4
    });

    mainSwiper.controller.control = thumbnailSwiper;
    thumbnailSwiper.controller.control = mainSwiper;

    /**
    ** mobile header
    **/

    $('.menu-mb').click(function () {
        $('.navbar').toggleClass('active');
    })


});
