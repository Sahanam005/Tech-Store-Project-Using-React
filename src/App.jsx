import { useState } from "react";
import "./App.css";
import ProfileCard from "./Component/ProfileCard";
import products from "./data";

function App() {
  const allBrands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ];

  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [activePanel, setActivePanel] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Add a product to the cart
  function addToCart(product) {
    setCartItems((previous) => [...previous, product]);
  }

  // Add or remove a product from the wishlist
  function toggleWishlist(product) {
    setWishlist((previous) => {
      const alreadyExists = previous.some((item) => item.id === product.id);

      if (alreadyExists) {
        return previous.filter((item) => item.id !== product.id);
      }

      return [...previous, product];
    });
  }

  // Remove an item from the cart
  function removeFromCart(indexToRemove) {
    setCartItems((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  }

  // Search and brand filtering
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand =
      selectedBrand === "All" || product.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  // Sorting
  if (sortBy === "low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating,
    );
  }

  const panelItems = activePanel === "wishlist" ? wishlist : cartItems;

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className={`app ${isDark ? "dark-theme" : "light-theme"}`}>
      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="logo">
          TechStore<span>.</span>
        </a>

        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <div className="nav-actions">
          <button
            className={`nav-link ${
              activePanel === "wishlist" ? "nav-link-active" : ""
            }`}
            onClick={() =>
              setActivePanel(activePanel === "wishlist" ? "" : "wishlist")
            }
          >
            <span className="nav-icon">♡</span>
            Wishlist
            <span className="nav-count">{wishlist.length}</span>
          </button>

          <button
            className={`nav-link ${
              activePanel === "cart" ? "nav-link-active" : ""
            }`}
            onClick={() => setActivePanel(activePanel === "cart" ? "" : "cart")}
          >
            <span className="nav-icon">🛒</span>
            Cart
            <span className="nav-count">{cartItems.length}</span>
          </button>

          <button
            className="theme-toggle"
            onClick={() => setIsDark((previous) => !previous)}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <header className="store-header" id="home">
        <p className="store-label">YOUR EVERYDAY STORE</p>
        <h1>Find your next favorite.</h1>
        <p className="store-description">Discover products you'll love.</p>
      </header>

      {/* Products */}
      <main className="store-content">
        <div className="section-heading">
          <div>
            <h2>Featured Products</h2>
            <p>Explore our latest collection</p>
          </div>

          <span className="product-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Filters */}
        <div className="store-toolbar">
          <div className="filter-group">
            <label htmlFor="brand-filter">Brand</label>

            <select
              id="brand-filter"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
            >
              <option value="All">All Brands</option>

              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sort by</label>

            <select
              id="sort-filter"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="default">Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {(searchTerm || selectedBrand !== "All") && (
            <button
              className="clear-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedBrand("All");
                setSortBy("default");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product cards */}
        {filteredProducts.length > 0 ? (
          <div className="MainParent">
            {filteredProducts.map((product) => (
              <ProfileCard
                key={product.id}
                image={product.image}
                name={product.name}
                brand={product.brand}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating}
                isBestSeller={product.isBestSeller}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onToggleWishlist={() => toggleWishlist(product)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <span>⌕</span>
            <h3>No products found</h3>
            <p>Try a different search or brand.</p>
          </div>
        )}
      </main>

      {/* Wishlist / Cart side panel */}
      {activePanel && (
        <div className="panel-overlay" onClick={() => setActivePanel("")}>
          <aside
            className="items-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={activePanel === "wishlist" ? "My Wishlist" : "My Cart"}
          >
            <div className="panel-heading">
              <div>
                <h2>
                  {activePanel === "wishlist" ? "My Wishlist" : "My Cart"}
                </h2>
                <p>
                  {panelItems.length}{" "}
                  {panelItems.length === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                className="close-panel"
                onClick={() => setActivePanel("")}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            {panelItems.length === 0 ? (
              <div className="empty-panel">
                <div className="empty-panel-icon">
                  {activePanel === "wishlist" ? "♡" : "🛒"}
                </div>

                <h3>
                  {activePanel === "wishlist"
                    ? "Your wishlist is empty"
                    : "Your cart is empty"}
                </h3>

                <p>
                  {activePanel === "wishlist"
                    ? "Save your favorite products using the heart button."
                    : "Find something you love and add it to your cart."}
                </p>

                <button
                  className="continue-button"
                  onClick={() => setActivePanel("")}
                >
                  Explore products
                </button>
              </div>
            ) : (
              <>
                <div className="panel-items-list">
                  {panelItems.map((item, index) => (
                    <div className="panel-item" key={`${item.id}-${index}`}>
                      <img src={item.image} alt={item.name} />

                      <div className="panel-item-info">
                        <p className="panel-item-brand">{item.brand}</p>

                        <h3>{item.name}</h3>

                        <p className="panel-item-price">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {activePanel === "wishlist" ? (
                          <div className="panel-item-actions">
                            <button
                              className="panel-action-primary"
                              onClick={() => {
                                addToCart(item);
                                setActivePanel("cart");
                              }}
                            >
                              Add to Cart
                            </button>

                            <button
                              className="panel-action-remove"
                              onClick={() => toggleWishlist(item)}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            className="panel-action-remove"
                            onClick={() => removeFromCart(index)}
                          >
                            Remove from cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {activePanel === "cart" && (
                  <div className="cart-summary">
                    <div className="cart-total-row">
                      <span>Total</span>
                      <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                    </div>

                    <p>Delivery charges, if any, are not included.</p>
                  </div>
                )}

                <button
                  className="continue-button panel-continue"
                  onClick={() => setActivePanel("")}
                >
                  Continue Shopping
                </button>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
