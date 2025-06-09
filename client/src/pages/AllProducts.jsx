import React, { useState, useEffect, useCallback } from 'react';


function AllProducts() { 
    console.log('AllProducts component rendered');

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [gender, setGender] = useState('');
    const [brand, setBrand] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [minRating, setMinRating] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for filter sidebar toggle

  
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);
    const [brands, setBrands] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [allColors, setAllColors] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;


    const fetchProducts = useCallback(async () => {
        console.log('--- Initiating product fetch ---');
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (category) params.append('category', category);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (gender) params.append('gender', gender);
        if (brand) params.append('brand', brand);
        selectedSizes.forEach(size => params.append('sizes', size)); 
        selectedColors.forEach(color => params.append('colors', color)); 
        if (minRating) params.append('min_rating', minRating);

        const requestUrl = `${API_URL}/products?${params.toString()}`;
        console.log('Request URL:', requestUrl);
        console.log('Current Filters Sent:', {
            searchQuery, category, minPrice, maxPrice, gender, brand,
            selectedSizes, selectedColors, minRating
        });

        try {
            const response = await fetch(requestUrl);
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched products data:', data);
            setProducts(data);

            //  unique filter options 
            const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))].sort();
            const uniqueGenders = [...new Set(data.map(p => p.gender).filter(Boolean))].sort();
            const uniqueBrands = [...new Set(data.map(p => p.brand).filter(Boolean))].sort();
            const uniqueSizes = [...new Set(data.flatMap(p => p.sizes || []).filter(Boolean))].sort((a, b) => {
                const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Define a specific order for sizes
                const aIndex = order.indexOf(a.toUpperCase());
                const bIndex = order.indexOf(b.toUpperCase());
               
                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                // Fallback for unexpected sizes or if order doesn't apply
                return String(a).localeCompare(String(b));
            });
            const uniqueColors = [...new Set(data.flatMap(p => p.colors || []).filter(Boolean))].sort();


            setCategories(uniqueCategories);
            setGenders(uniqueGenders);
            setBrands(uniqueBrands);
            setAllSizes(uniqueSizes);
            setAllColors(uniqueColors);
            console.log('--- Product fetch complete ---');

        } catch (error) {
            console.error('Error during product fetch:', error);
            
            setProducts([]); 
            setCategories([]);
            setGenders([]);
            setBrands([]);
            setAllSizes([]);
            setAllColors([]);
        }
    }, [searchQuery, category, minPrice, maxPrice, gender, brand, selectedSizes, selectedColors, minRating]);

    useEffect(() => {
        console.log('--- useEffect triggered: Fetching products based on dependencies ---');
        fetchProducts();
    }, [fetchProducts]); // Dependency array ensures fetchProducts runs when its dependencies change

    const handleClearFilters = () => {
        console.log('Clearing all filters...');
        setSearchQuery('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setGender('');
        setBrand('');
        setSelectedSizes([]);
        setSelectedColors([]);
        setMinRating('');
    };

    const handleSizeChange = (e) => {
        const value = e.target.value;
        setSelectedSizes(prev => {
            const newSizes = prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value];
            console.log('Size checkbox changed. New selected sizes:', newSizes);
            return newSizes;
        });
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        setSelectedColors(prev => {
            const newColors = prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value];
            console.log('Color checkbox changed. New selected colors:', newColors);
            return newColors;
        });
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col lg:flex-row gap-6 w-full">
            {/* Overlay for filter sidebar when open on small screens */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Filter Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:w-1/4 lg:max-w-xs lg:shadow-none lg:min-w-[250px]`}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

                {/* Close button for mobile sidebar */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full lg:hidden"
                    aria-label="Close filters"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* Search Filter */}
                <div className="mb-4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range:</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Gender Filter */}
                <div className="mb-4">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All</option>
                        {genders.map((gen, index) => (
                            <option key={index} value={gen}>
                                {gen}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Brand Filter */}
                <div className="mb-4">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand:</label>
                    <select
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All</option>
                        {brands.map((br, index) => (
                            <option key={index} value={br}>
                                {br}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sizes Filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes:</label>
                    <div className="flex flex-wrap gap-2">
                        {allSizes.map((size, index) => (
                            <label key={index} className="inline-flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={selectedSizes.includes(size)}
                                    onChange={handleSizeChange}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-1">{size}</span>
                            </label>
                        ))}
                        {allSizes.length === 0 && <span className="text-gray-500 text-xs">No sizes available</span>}
                    </div>
                </div>

                {/* Colors Filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors:</label>
                    <div className="flex flex-wrap gap-2">
                        {allColors.map((color, index) => (
                            <label key={index} className="inline-flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    value={color}
                                    checked={selectedColors.includes(color)}
                                    onChange={handleColorChange}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-1">{color}</span>
                            </label>
                        ))}
                        {allColors.length === 0 && <span className="text-gray-500 text-xs">No colors available</span>}
                    </div>
                </div>

                {/* Minimum Rating Filter */}
                <div className="mb-6">
                    <label htmlFor="min-rating" className="block text-sm font-medium text-gray-700 mb-1">Min Rating:</label>
                    <input
                        type="number"
                        id="min-rating"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        min="1"
                        max="5"
                        step="0.1"
                        placeholder="e.g., 4.0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button
                    onClick={handleClearFilters}
                    className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Clear Filters
                </button>
            </aside>

            {/* Main Content Area (Product Listing) */}
            <main className="flex-1 lg:ml-auto">
                {/* Mobile: Header and Toggle Button */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Toggle filters"
                    >
                        {isSidebarOpen ? 'Close Filters' : 'Open Filters'}
                    </button>
                </div>
                {/* Desktop: Header */}
                <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">All Products</h1>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <p className="col-span-full text-center text-gray-600 text-lg">No products found. Please check your backend connection and data population.</p>
                    ) : (
                        products.map((product) => (
                          
                            <div key={product.id} className="
                                bg-white rounded-lg shadow-md flex flex-col
                                transition-all duration-300 ease-in-out
                                hover:shadow-xl hover:scale-103 cursor-pointer overflow-hidden
                            ">
                                {/* Product Image */}
                                <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-2 rounded-t-lg">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>

                                {/* Product Details (left-aligned) */}
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                                        {/* Optional: Brand or Category */}
                                        <p className="text-xs text-gray-600 mb-1 capitalize">{product.brand} - {product.category}</p>

                                        {/* Rating */}
                                        <div className="flex items-center text-sm text-gray-700 mb-2">
                                          
                                            <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
                                            <span className="font-medium">{product.rating}</span>
                                            {product.reviews && product.reviews.length > 0 && (
                                                <span className="ml-2 text-gray-500">({product.reviews.length} reviews)</span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <p className="text-2xl font-bold text-gray-900 mb-2">${product.price?.toFixed(2)}</p>

                                        {/* Stock/Availability */}
                                        {product.stock > 0 ? (
                                            <p className="text-sm text-green-700 font-semibold mb-1">In Stock</p>
                                        ) : (
                                            <p className="text-sm text-red-700 font-semibold mb-1">Out of Stock</p>
                                        )}

                                        {/* Discount */}
                                        {product.discount && (
                                            <p className="text-sm text-blue-700 font-semibold mb-2">
                                                {product.discount}
                                            </p>
                                        )}
                                        {/* Sizes and Colors (optional, smaller font) */}
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

                                        {/* Short description snippet */}
                                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{product.description}</p>
                                    </div>
  
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default AllProducts;