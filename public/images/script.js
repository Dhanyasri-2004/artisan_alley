let slides = document.querySelector('.slides');
let dots = document.querySelectorAll('.dot');
let index = 0;
const totalSlides = 18;
let autoSlide;

function updateSlide() {
    slides.style.transition = 'transform 1s ease-in-out';
    slides.style.transform = `translateX(-${index * 100}vw)`;
    updateDots();
}

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    index++;
    updateSlide();

    if (index === totalSlides) {
        setTimeout(() => {
            slides.style.transition = 'none';
            index = 0;
            slides.style.transform = `translateX(0)`;
            updateDots();
        }, 1000);
    }
}

function goToSlide(slideIndex) {
    clearInterval(autoSlide);
    index = slideIndex;
    updateSlide();
    autoSlide = setInterval(nextSlide, 3000);
}

autoSlide = setInterval(nextSlide, 3000);
const testimonials = [
    { img: "18trades.jpg", text: "Viswakarma is known as the divine architect, representing 18 trades that form the backbone of traditional craftsmanship. These skilled artisans have preserved their heritage through intricate craftsmanship, building temples, tools, and fine artwork.", name: "Viswakarma" },
    { img: "armourer.webp", text: "A master of forging protective gear, the armourer meticulously crafts shields, helmets, and body armor, ensuring strength and resilience in every piece for warriors and soldiers.", name: "Armourer" },
    { img: "barber.webp", text: "The barber is more than just a hairdresser; they are traditional groomers who shape hairstyles, beards, and perform therapeutic massages, maintaining the cultural essence of personal care.", name: "Barber" },
    { img: "basketweaver.webp", text: "With skillful hands, the basket weaver intricately interlaces natural fibers to create beautiful, durable baskets used for storage, farming, and decorative purposes.", name: "Basket Weaver" },
    { img: "blacksmith.webp", text: "A master of fire and metal, the blacksmith hammers iron into tools, weapons, and essential household items, showcasing immense strength and artistry in forging.", name: "Blacksmith" },
    { img: "boatmaker.webp", text: "Bridging tradition with function, the boat maker carefully carves and assembles sturdy wooden boats, ensuring they navigate waters with ease for fishing and transport.", name: "Boat Maker" },
    { img: "carpenter.webp", text: "The carpenter shapes wood into functional and artistic pieces, from furniture to houses, bringing warmth and utility to living spaces through intricate joinery and craftsmanship.", name: "Carpenter" },
    { img: "cobbler.webp", text: "More than just a shoe repairer, the cobbler breathes new life into worn-out footwear, skillfully stitching, mending, and crafting comfortable, long-lasting shoes.", name: " Cobbler" },
    { img: "toymaker.webp", text: "Bringing joy to children, the toy maker carves and assembles playful, vibrant toys from wood and clay, preserving traditional storytelling and cultural heritage.", name: "Toy Maker" },
    { img: "fishnet.webp", text: "Expertly weaving strong and fine nets, the fishing net maker ensures that fishermen can harvest bountiful catches, sustaining livelihoods and coastal traditions.", name: "Fishing Net Maker" },
    { img: "garlandmaker.webp", text: "With fragrant flowers and meticulous hands, the garland maker strings together vibrant floral arrangements, adorning temples, celebrations, and rituals with beauty and devotion.", name: "Garland Maker" },
    { img: "goldsmith.webp", text: "With patience and precision, the goldsmith shapes precious metals into exquisite jewelry, creating heirlooms that symbolize culture, tradition, and elegance.", name: "Goldsmith" },
    { img: "toolkitmaker.webp", text: "A vital craftsman, the toolkit maker forges and assembles essential tools used in agriculture, construction, and handicrafts, empowering other trades with reliable instruments.", name: "Toolkit Maker" },
    { img: "locksmith.webp", text: "Ensuring security and trust, the locksmith designs and constructs sturdy locks and keys, blending tradition with innovation in safeguarding homes and valuables.", name: "Locksmith" },
    { img: "masons.webp", text: "With stones and mortar, the mason constructs resilient buildings, temples, and monuments, leaving behind structures that stand the test of time.", name: " Mason" },
    { img: "potter.webp", text: "Transforming clay into art, the potter shapes elegant pots, vases, and utensils, blending functionality with cultural heritage through their hands and the spinning wheel.", name: "Potter" },
    { img: "sculptor.webp", text: "With chisels and vision, the sculptor breathes life into stone and wood, crafting divine idols, intricate carvings, and breathtaking statues that tell timeless stories.", name: "Sculptor" },
    { img: "tailor.webp", text: "The tailor meticulously stitches fabrics into perfectly fitted garments, weaving comfort and style into every piece, preserving the essence of traditional and modern fashion.", name: "Tailor" },
    { img: "washerman.webp", text: "A guardian of cleanliness, the washerman tirelessly washes and presses clothes, ensuring fresh, crisp garments for families and communities, keeping traditions alive.", name: "Washerman" }
];

let currentIndex = 0;
const imgElement = document.querySelector(".testimonial-content img");
const textElement = document.querySelector(".testimonial-text p");
const nameElement = document.querySelector(".testimonial-text h3");

function updateTestimonial(index) {
    imgElement.src = testimonials[index].img;
    textElement.textContent = `"${testimonials[index].text}"`;
    nameElement.textContent = testimonials[index].name;
}

// Manual Navigation
document.querySelector(".next-btn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial(currentIndex);
    resetSlideshow();
});

document.querySelector(".prev-btn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(currentIndex);
    resetSlideshow();
});

// Automatic Slideshow every 3 seconds
let slideshowInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial(currentIndex);
}, 3000);

// Reset slideshow when user interacts
function resetSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial(currentIndex);
    }, 3000);
}

// Initialize first slide
updateTestimonial(currentIndex);