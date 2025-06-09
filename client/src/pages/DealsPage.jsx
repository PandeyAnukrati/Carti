import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;



    const parseDiscountAndCalculateEffective = useCallback((product) => {
        const { price, discount, discountPercentage } = product;
        let effectivePercentage = 0;
        let effectiveAbsolute = 0;


        console.log(`Product: ${product.name}, Price: ${price}, Discount: ${discount}, DiscountPercentage: ${discountPercentage}`);

        if (discountPercentage !== undefined && discountPercentage !== null) {
        
            effectivePercentage = parseFloat(discountPercentage);
            if (!isNaN(effectivePercentage)) {
                effectiveAbsolute = price * (effectivePercentage / 100);
            } else {
                effectivePercentage = 0; 
            }
        } else if (typeof discount === 'string') {
        
            if (discount.includes('%')) {
                const percentage = parseFloat(discount);
                if (!isNaN(percentage)) {
                    effectivePercentage = percentage;
                    effectiveAbsolute = price * (percentage / 100);
                }
            } else if (discount.includes('$') && discount.includes('off')) {
                const absolute = parseFloat(discount.replace('$', '').replace('off', '').trim());
                if (!isNaN(absolute)) {
                    effectiveAbsolute = absolute;
                    effectivePercentage = price > 0 ? (absolute / price) * 100 : 0;
                }
            }
        } else if (typeof discount === 'number') {
       
            effectiveAbsolute = discount;
            effectivePercentage = price > 0 ? (discount / price) * 100 : 0;
        }

        console.log(`  Calculated: Effective Percentage = ${effectivePercentage}%, Effective Absolute = $${effectiveAbsolute.toFixed(2)}`);

        return { effectivePercentage, effectiveAbsolute };
    }, []);

    // Function to fetch deals from the backend API
    const fetchDeals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
              
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allProducts = await response.json();
            console.log('Fetched all products:', allProducts); 

            const filteredDeals = allProducts.filter(product => {
               
                if (!product.price || (product.discount === undefined && product.discountPercentage === undefined)) {
                    console.log(`  Skipping product ${product.name}: Missing price or discount info.`);
                    return false;
                }

                const { effectivePercentage, effectiveAbsolute } = parseDiscountAndCalculateEffective(product);

                // Check if the product meets the 50% discount criteria
                const meetsCriteria = effectivePercentage >= 50 || effectiveAbsolute >= 50;

              
                console.log(`  Product ${product.name} (ID: ${product.id}): Meets criteria (>=50% or >=$50 absolute)? ${meetsCriteria}`);
                if (meetsCriteria) {
                    console.log(`    --> Product ${product.name} INCLUDED in deals.`);
                } else {
                    console.log(`    --> Product ${product.name} EXCLUDED from deals.`);
                }

                return meetsCriteria;
            });

            setDeals(filteredDeals);
            console.log('Final filtered deals:', filteredDeals); 
        } catch (err) {
            console.error('Error fetching deals:', err);
            setError('Failed to load deals. Please try again later.');
            setDeals([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL, parseDiscountAndCalculateEffective]); // Dependencies for useCallback

    // Effect hook to call fetchDeals when the component mounts or fetchDeals changes
    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);

    // Animation variants for container and cards
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        hover: { scale: 1.03, boxShadow: "0 8px 15px rgba(0,0,0,0.15)" }
    };

    return (
        <>
            {/* Loading state animation */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gray-100 p-6 flex justify-center items-center"
                    >
                        <p className="text-xl text-gray-700">Loading deals...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error state animation */}
            <AnimatePresence>
                {error && !loading && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gray-100 p-6 flex justify-center items-center"
                    >
                        <p className="text-xl text-red-600">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content display when not loading and no error */}
            {!loading && !error && (
                <motion.div
                    className="min-h-screen bg-gray-100 p-20 w-full"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Today's Hot Deals!</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {deals.length === 0 ? (
                            <p className="col-span-full text-center text-gray-600 text-lg">
                                No deals found matching the criteria. Keep an eye out for new offers!
                            </p>
                        ) : (
                            deals.map((product) => {
                                // Calculate discounted price for display
                                const { effectiveAbsolute } = parseDiscountAndCalculateEffective(product);
                                const discountedPrice = (product.price - effectiveAbsolute).toFixed(2);

                                return (
                                    <motion.div
                                        key={product.id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="bg-white rounded-lg shadow-md flex flex-col cursor-pointer overflow-hidden"
                                    >
                                        <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-2 rounded-t-lg">
                                          
                                            <img
                                                src={product.image_url || 'https://via.placeholder.com/200x150?text=No+Image'}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        <div className="p-4 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                                <p className="text-xs text-gray-600 mb-1 capitalize">{product.brand} - {product.category}</p>

                                                {/* Rating display */}
                                                <div className="flex items-center text-sm text-gray-700 mb-2">
                                                    <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
                                                    <span className="font-medium">{product.rating}</span>
                                                </div>

                                         
                                                {product.discount || product.discountPercentage ? (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ${product.price?.toFixed(2)}
                                                    </p>
                                                ) : null}

                                                {/* Discounted price */}
                                                <p className="text-2xl font-bold text-red-600 mb-2">${discountedPrice}</p>

                                                {/* Percentage saved display */}
                                                {product.discountPercentage !== undefined && product.discountPercentage !== null && (
                                                    <p className="text-sm text-green-700 font-semibold mb-1">
                                                        You save {parseFloat(product.discountPercentage)}%!
                                                    </p>
                                                )}

                                                {/* Stock status */}
                                                {product.stock > 0 ? (
                                                    <p className="text-sm text-green-700 font-semibold mb-1">In Stock</p>
                                                ) : (
                                                    <p className="text-sm text-red-700 font-semibold mb-1">Out of Stock</p>
                                                )}

                                                {/* Sizes and Colors display */}
                                                {(product.sizes && product.sizes.length > 0) && (
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Sizes: {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}
                                                    </p>
                                                )}
                                                {(product.colors && product.colors.length > 0) && (
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Colors: {product.colors.slice(0, 3).join(', ')}{product.colors.length > 3 ? '...' : ''}
                                                    </p>
                                                )}

                                                <p className="text-sm text-gray-700 mt-2 line-clamp-3">{product.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => navigate("/products")}
                            className="py-3 px-8 bg-[#996633] text-white font-semibold rounded-lg shadow-lg hover:bg-[#663300] focus:outline-none text-lg"
                        >
                            More Products
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default DealsPage;
