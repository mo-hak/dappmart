import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './Getallproduct.css';

const Getallproduct = ({ state }) => {
  const [products, setProducts] = useState([]);
  const {contract} = state;
  useEffect(() => {
    const fetchProducts = async () => {
        
      try {
        const result = await contract.getAllProduct();
        const productNames = result[0];
        const productPrices = result[1];

        // Combine product names and prices into an array of objects
        const productList = productNames.map((name, index) => ({
          name,
          price: ethers.utils.formatEther(productPrices[index]),
        }));

        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [contract]);

  return (
    <div className="product-list">
      <h2>All Products</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={index} className="product-item">
              <strong>Name:</strong> {product.name}, <strong>Price:</strong> {product.price} ETH
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Getallproduct;
