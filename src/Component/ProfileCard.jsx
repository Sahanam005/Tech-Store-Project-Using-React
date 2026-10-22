
import "./ProfileCard.css";

export default function ProfileCard({
    image,
    name,
    brand,
    price,
    originalPrice,
    discount,
    rating,
    isBestSeller,
    isWishlisted,
    onToggleWishlist,
    onAddToCart
}) {
    return (
        <article className="product-card">
            <div className="image-container">
                {isBestSeller && (
                    <span className="bestseller-badge">
                        Bestseller
                    </span>
                )}

                <span className="discount-badge">
                    {discount}% OFF
                </span>

                <button
                    className={`wishlist-button ${
                        isWishlisted ? "active" : ""
                    }`}
                    onClick={onToggleWishlist}
                    aria-label={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    title={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    {isWishlisted ? "♥" : "♡"}
                </button>

                <img
                    src={image}
                    alt={name}
                    className="product-image"
                    loading="lazy"
                />
            </div>

            <div className="product-info">
                <p className="product-brand">{brand}</p>

                <h3 className="product-name">{name}</h3>

                <div className="rating">
                    <div
                        className="stars"
                        aria-label={`Rated ${rating} out of 5`}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={
                                    rating >= star
                                        ? "star filled"
                                        : rating >= star - 0.5
                                        ? "star half"
                                        : "star empty"
                                }
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <span className="rating-number">
                        {rating.toFixed(1)}
                    </span>
                </div>

                <div className="price-container">
                    <span className="price">
                        ₹{price.toLocaleString("en-IN")}
                    </span>

                    <span className="original-price">
                        ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                </div>

                <p className="delivery-text">
                    <span>✓</span> Free delivery available
                </p>

                <button
                    className="buy-button"
                    onClick={onAddToCart}
                >
                    <span>＋</span> Add to Cart
                </button>
            </div>
        </article>
    );
}
