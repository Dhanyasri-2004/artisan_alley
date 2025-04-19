import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css"; // Ensure correct path for styles
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Truck, Shield, RefreshCw, Clock, Palette, PenTool as Tool, BookOpen, Users as UsersIcon } from 'lucide-react';

const images = [
  "https://img.freepik.com/premium-photo/beautiful-green-flower-purple-ceramic-pot-light-background_301716-588.jpg",
  "https://img.freepik.com/premium-photo/soft-purple-sofa-purple-background_921860-21118.jpg",  
  "https://wallup.net/wp-content/uploads/2019/09/52231-shelves-sofa-cushions-vases-interior-reflection-purple-design-1.jpg",
  "https://img.freepik.com/premium-photo/lavender-serenity-soft-inviting-solid-color-background_1021867-15161.jpg",
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(autoSlide);
  }, []);

  // Fetch products directly (similar to ProductsPage1)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8080/api/products");
        
        // Process products to include image URLs
        const productsWithImages = await Promise.all(
          data.map(async (product, index) => {
            try {
              // Check if imageData is already available in the API response
              if (product.imageData) {
                const imageUrl = `data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`;
                // Add animation delay for staggered effect
                const animationDelay = `${index * 0.1}s`;
                return { 
                  ...product, 
                  imageUrl, 
                  animationDelay, 
                  isNew: Math.random() > 0.7,
                  productAvailable: (product.stockQuantity > 0) && product.productAvailable
                };
              } else {
                // Fallback to fetching image if imageData is not in API response
                const { data: imageBlob } = await axios.get(
                  `http://localhost:8080/api/product/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(imageBlob);
                const animationDelay = `${index * 0.1}s`;
                return { 
                  ...product, 
                  imageUrl, 
                  animationDelay, 
                  isNew: Math.random() > 0.7,
                  productAvailable: (product.stockQuantity > 0) && product.productAvailable
                };
              }
            } catch (error) {
              console.error(`Error fetching image for product ID: ${product.id}`, error);
              return { 
                ...product, 
                imageUrl: "/images/placeholder.png", 
                animationDelay: `${index * 0.1}s`, 
                isNew: Math.random() > 0.7,
                productAvailable: (product.stockQuantity > 0) && product.productAvailable
              };
            }
          })
        );
        
        setProducts(productsWithImages);
        
        // Get trending/featured products (limit to 4 for the trending section)
        const featuredProducts = productsWithImages
          .filter(product => product.productAvailable)
          .slice(0, 4);
        setFilteredProducts(featuredProducts);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId, quantity, e) => {
    e.preventDefault(); // Prevent navigation
    
    // Check if user is logged in
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please login to add items to your cart");
      navigate("/login");
      return;
    }
    
    const cartId = 1;

    try {
      const product = products.find((p) => p.id === productId);

      if (!product || !product.productAvailable || product.stockQuantity <= 0) {
        alert("This product is out of stock.");
        return;
      }

      const totalPrice = product.price * quantity;

      await axios.post(
        `http://localhost:8080/api/cart/users/${userId}/cart/products/${productId}/quantity/${quantity}`,
        {
          cart_id: cartId,
          user_id: userId,
          total_price: totalPrice,
        }
      );

      alert("Product added to cart successfully!");

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex((item) => item.id === productId);

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].total_price += totalPrice;
      } else {
        cartItems.push({
          id: productId,
          name: product.name,
          price: product.price,
          quantity,
          total_price: totalPrice,
          imageUrl: product.imageUrl,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error adding product to cart:", error.response ? error.response.data : error.message);
      alert("Failed to add product to cart.");
    }
  };

  // New function to handle product click
  const handleProductClick = (productId, e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Check if user is logged in
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      // Save the intended product page in localStorage to redirect after login
      localStorage.setItem("redirectAfterLogin", `/product2/${productId}`);
      navigate("/login");
    } else {
      // User is logged in, proceed to product page
      navigate(`/product2/${productId}`);
    }
  };

  return (
    <div>
      <header>
        <nav className="navbarrr">
          <div className="logoooo">
            <img src="/images/logo.png" alt="Artisan Alley Logo" className="logo-imgggg" />
            Indiart
          </div>
          <div className="nav-container">
          <ul className="nav-links">
  <li><button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>Home</button></li>
  <li><button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button></li>
  <li><button onClick={() => document.getElementById('trending').scrollIntoView({ behavior: 'smooth' })}>Products</button></li>
  <li><button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Services</button></li>
  <li><button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</button></li>
</ul>

          </div>
        </nav>
      </header>

      {/* Background Slideshow */}
      <section className="slideshow">
        <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}vw)`, transition: "transform 1s ease-in-out" }}>
          {images.map((src, index) => (
            <div className="slide" key={index}>
              <img src={src} alt={`Handicrafts ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Dots for Image Indicators */}
      <div className="dots-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>

      {/* Overlay Section */}
      <div className="overlay">
        <h1>Unique Creations for Every Home</h1>

        <div className="auth-buttons">
          <button className="login2" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup2" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </div>

      <div className="home-container">
        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-container">
            <h2 className="about-title">About ArtisanCraft</h2>
            <p className="about-description">
              We bridge the gap between skilled artisans and appreciative customers, preserving traditional craftsmanship while embracing modern convenience.
            </p>

            <div className="about-cards">
              <div className="about-card">
                <div className="about-icon">
                  <span role="img" aria-label="Heart" className="emoji">❤️</span>
                </div>
                <h3 className="about-card-title">Handcrafted with Love</h3>
                <p className="about-card-description">Each piece is carefully crafted by skilled artisans who pour their heart into every detail.</p>
              </div>

              <div className="about-card">
                <div className="about-icon">
                  <span role="img" aria-label="Award" className="emoji">🏆</span>
                </div>
                <h3 className="about-card-title">Quality Assured</h3>
                <p className="about-card-description">We ensure every product meets our high standards of craftsmanship and durability.</p>
              </div>

              <div className="about-card">
                <div className="about-icon">
                  <span role="img" aria-label="Community" className="emoji">🤝</span>
                </div>
                <h3 className="about-card-title">Community Driven</h3>
                <p className="about-card-description">Supporting local artisans and preserving traditional craftsmanship for future generations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="features-container">
            <h2 className="features-title">Why Choose Us</h2>
            <p className="features-description">Experience the difference of authentic artisanal products</p>

            <div className="features-grid">
              <div className="feature-card">
                <Truck className="feature-icon" />
                <h3 className="feature-title">Free Shipping</h3>
                <p className="feature-description">Free worldwide shipping on all orders over ₹1000</p>
              </div>

              <div className="feature-card">
                <Shield className="feature-icon" />
                <h3 className="feature-title">Secure Payments</h3>
                <p className="feature-description">100% secure payment processing</p>
              </div>

              <div className="feature-card">
                <RefreshCw className="feature-icon" />
                <h3 className="feature-title">Easy Returns</h3>
                <p className="feature-description">30-day return policy for peace of mind</p>
              </div>

              <div className="feature-card">
                <Clock className="feature-icon" />
                <h3 className="feature-title">24/7 Support</h3>
                <p className="feature-description">Round-the-clock customer service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="trending" className="artisan-product-gallery22">
          <h2 className="textc">Trending Products</h2>
          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <div className="artisan-product-grid">
              {filteredProducts.length === 0 ? (
                <h2 className="artisan-no-products">No Products Available</h2>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    className="artisan-product-card" 
                    key={product.id}
                    onClick={(e) => handleProductClick(product.id, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="artisan-product-img" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="artisan-product-info">
                        <h5 className="artisan-product-titleeee">{product.name.toUpperCase()}</h5>
                        <p className="artisan-product-brandddd">~ {product.brand}</p>
                        <h5 className="artisan-product-priceeee">₹{product.price}</h5>
                        {product.stockQuantity <= 0 ? (
                          <div className="out-of-stock-badge">Out of Stock</div>
                        ) : (
                          <button
                            className="artisan-add-to-cart-btnn"
                            onClick={(e) => {
                              e.stopPropagation(); // Stop event from bubbling up to parent
                              addToCart(product.id, 1, e);
                            }}
                            disabled={!product.productAvailable || product.stockQuantity <= 0}
                          >
                            {product.productAvailable && product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="view-all-container">
            <button className="view-all-btn" onClick={() => navigate("/login")}>
              View All Products
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="services-container">
            <h2 className="services-title">Our Services</h2>
            <p className="services-description">Empowering artisans and enriching homes</p>

            <div className="services-grid">
              <div className="service-card">
                <Palette className="service-icon" />
                <h3 className="service-title">Custom Design Services</h3>
                <p className="service-description">
                  Work directly with our skilled artisans to create bespoke pieces tailored to your vision. 
                  From furniture to home decor, bring your ideas to life with expert craftsmanship.
                </p>
                <ul className="service-list">
                  <li>Personal design consultation</li>
                  <li>Material selection guidance</li>
                  <li>Custom measurements and fitting</li>
                  <li>Progress updates and revisions</li>
                </ul>
              </div>

              <div className="service-card">
                <Tool className="service-icon" />
                <h3 className="service-title">Restoration Services</h3>
                <p className="service-description">
                  Give your cherished pieces new life with our expert restoration services. 
                  Our artisans specialize in bringing old crafts back to their former glory.
                </p>
                <ul className="service-list">
                  <li>Detailed assessment</li>
                  <li>Historical research</li>
                  <li>Authentic restoration techniques</li>
                  <li>Preservation guidance</li>
                </ul>
              </div>

              <div className="service-card">
                <BookOpen className="service-icon" />
                <h3 className="service-title">Workshops & Classes</h3>
                <p className="service-description">
                  Learn traditional crafting techniques from master artisans. 
                  Join our workshops to discover the joy of creating handmade pieces.
                </p>
                <ul className="service-list">
                  <li>Beginner to advanced levels</li>
                  <li>Small group sessions</li>
                  <li>Hands-on experience</li>
                  <li>Take-home projects</li>
                </ul>
              </div>

              <div className="service-card">
                <UsersIcon className="service-icon" />
                <h3 className="service-title">Artisan Collaboration</h3>
                <p className="service-description">
                  Join our community of skilled craftspeople. We provide a platform for artisans 
                  to showcase and sell their work to a global audience.
                </p>
                <ul className="service-list">
                  <li>Marketing support</li>
                  <li>Professional photography</li>
                  <li>Global marketplace access</li>
                  <li>Secure payment handling</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section-unique">
          <div className="contact-container-unique">
            <div className="text-center-unique">
              <h2 className="contact-title-unique">Contact Us</h2>
              <p className="contact-description-unique">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <div className="contact-grid-unique">
              <div className="contact-info-unique">
                <h3 className="contact-info-title-unique">Contact Information</h3>
                <div className="contact-info-list-unique">
                  <div className="contact-item-unique">
                    <Mail className="contact-icon-unique" />
                    <span className="contact-text-unique">support@artisanAlley.com</span>
                  </div>
                  <div className="contact-item-unique">
                    <Phone className="contact-icon-unique" />
                    <span className="contact-text-unique">+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item-unique">
                    <MapPin className="contact-icon-unique" />
                    <span className="contact-text-unique">123 Artisan Street, Craft City, AC 12345</span>
                  </div>
                </div>
              </div>

              <form className="contact-form-unique">
                <div className="form-group-unique">
                  <label htmlFor="name" className="form-label-unique">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-input-unique"
                    required
                  />
                </div>
                <div className="form-group-unique">
                  <label htmlFor="email" className="form-label-unique">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input-unique"
                    required
                  />
                </div>
                <div className="form-group-unique">
                  <label htmlFor="message" className="form-label-unique">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="form-textarea-unique"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="form-button-unique"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;