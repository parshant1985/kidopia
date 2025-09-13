function navigationFn(id) {
    const element = document.getElementById(id)
    element.scrollIntoView({ behavior: "smooth", block: "start" });

}
const navLinks = document.querySelectorAll('.nav-container li a');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior (optional)

        // Remove 'active' class from all links
        navLinks.forEach(link => link.classList.remove('btn-contact'));

        // Add 'active' class to the clicked link
        this.classList.add('btn-contact');
    });
});

// open modal by id
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

// close currently open modal
function closeModal() {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
}  


    class ProductSlider {
        constructor() {
        this.sliderTrack = document.getElementById('sliderTrack');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.dotsContainer = document.getElementById('sliderDots');
    this.products = document.querySelectorAll('.product-card');

    this.currentIndex = 0;
    this.cardWidth = 400; // 300px card + 20px gap
    this.visibleCards = 3; // Show 4 cards at 1400px width
    this.maxIndex = Math.max(0, this.products.length - this.visibleCards);

    this.init();
      }

    init() {
        this.createDots();
    this.updateSlider();

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') this.prevSlide();
    if (e.key === 'ArrowRight') this.nextSlide();
        });

    // Touch/swipe support
    let startX = 0;
    let startY = 0;

        this.sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
        });

        this.sliderTrack.addEventListener('touchend', (e) => {
          const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
        this.nextSlide();
            } else {
        this.prevSlide();
            }
          }
        });

        // Auto-play (optional)
        // this.startAutoPlay();
      }

    createDots() {
        const dotsCount = this.maxIndex + 1;
    for (let i = 0; i < dotsCount; i++) {
          const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => this.goToSlide(i));
    this.dotsContainer.appendChild(dot);
        }
      }

    updateSlider() {
        const translateX = -this.currentIndex * this.cardWidth;
    this.sliderTrack.style.transform = `translateX(${translateX}px)`;

    // Update arrow states
    this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
        });
      }

    prevSlide() {
        if (this.currentIndex > 0) {
        this.currentIndex--;
    this.updateSlider();
        }
      }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
        this.currentIndex++;
    this.updateSlider();
        }
      }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateSlider();
      }

    startAutoPlay() {
        setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSlider();
        }, 4000);
      }
    }

    // Initialize slider when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new ProductSlider();
    });
