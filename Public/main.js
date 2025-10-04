// Wait for the document to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Code for the sticky/translucent header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Code for the hamburger menu ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.nav-links-mobile');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // --- 3. Code for the search overlay ---
    const searchToggleBtn = document.querySelector('#search-toggle-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search-btn');
    if (searchToggleBtn && searchOverlay && closeSearchBtn) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            searchOverlay.querySelector('input').focus();
        });
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    // --- 4. Code to load ALL products (for homepage/shop page) ---
   // --- 4. Code to load products ---
const productGrid = document.querySelector('.product-grid');

if (productGrid) {
    // Check if we are on the homepage by looking for the .homepage class on the <main> tag
    const isHomePage = document.querySelector('main.homepage');

    fetch('http://localhost:3000/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            // If it's the homepage, take only the first 4 products. Otherwise, take all of them.
            const productsToDisplay = isHomePage ? products.slice(0, 4) : products;

            productGrid.innerHTML = ''; // Clear existing content
            productsToDisplay.forEach(product => {
                const originalPrice = product.original_price ? `<span class="original-price">Rs. ${product.original_price.toFixed(2)}</span>` : '';
                
                const productCard = `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image_url}" alt="${product.name}">
                            <span class="sale-badge">Sale</span>
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">
                                ${originalPrice} 
                                Rs. ${product.price.toFixed(2)}
                            </p>
                            <a href="product-detail.html?id=${product._id}" class="btn-outline">Choose Options</a>
                        </div>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            productGrid.innerHTML = `<p>Error loading products. Please make sure your server is running.</p>`;
        });
}

    // --- 5. Code to load ONE product (for product detail page) ---
    const productDetailLayout = document.querySelector('.product-detail-layout');
    if (productDetailLayout) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch(`http://localhost:3000/api/products/${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Product not found');
                    }
                    return response.json();
                })
                .then(product => {
                    document.getElementById('product-title').textContent = product.name;
                    document.getElementById('product-price').textContent = `Rs. ${product.price.toFixed(2)}`;
                    document.getElementById('product-description').textContent = product.description;
                    document.getElementById('product-image').src = product.image_url;
                    document.getElementById('product-image').alt = product.name;
                })
                .catch(error => {
                    console.error("Error fetching product details:", error);
                    document.getElementById('product-title').textContent = "Product not found.";
                });
        }
    }

    // --- 6. Code for scroll animations ---
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .testimonial-section, .footer-column, .product-detail-layout');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 7. Code for the Hero Carousel ---
const carousel = document.querySelector('.carousel-container');

if (carousel) {
    const slide = carousel.querySelector('.carousel-slide');
    const slides = Array.from(slide.children);
    const nextBtn = carousel.querySelector('.next-btn');
    const prevBtn = carousel.querySelector('.prev-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    // Arrange slides next to one another
    const setSlidePosition = (slide, index) => {
        // This part is handled by CSS flexbox, no JS needed for positioning
    };
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);

    const goToSlide = (index) => {
        slide.style.transform = 'translateX(-' + (index * 25) + '%)';
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    };

    // Next slide
    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    };

    // Prev slide
    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    };

    // Button event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-slide functionality
    setInterval(nextSlide, 5000); // Change slide every 3 seconds
}

}); // <-- This is the single, correct closing bracket for the whole file.