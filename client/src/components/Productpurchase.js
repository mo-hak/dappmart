
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Productpurchase.css';

const Productpurchase = ({ state }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!state || !state.contract) {
        console.error('Contract instance not found in state.');
        return;
      }

      const { contract } = state;

      // Input validation
      if (!productId || !quantity) {
        console.error('Invalid input values.');
        return;
      }

      // Convert product ID to BigNumber if needed
      const productBigNumber = ethers.BigNumber.from(productId);

// Call the getAllProduct function on the contract
const result = await contract.getAllProduct();
const productPrices = result[1];

// Convert the price to a JavaScript number
const productPrice = ethers.utils.formatEther(productPrices[productBigNumber-1]);
const totalPrice = parseFloat(productPrice) * quantity;

// Manually set the gas limit
const gasLimit = 300000; // Adjust the value according to your contract's requirements

// Call the purchaseProduct function on the contract with the specified gas limit
const transaction = await contract.purchaseProduct(productBigNumber, quantity, {
  value: ethers.utils.parseEther(totalPrice.toString()),
  gasLimit: gasLimit,
});
      // Show success message or perform additional actions
      await transaction.wait();
      console.log('Product purchased successfully!');

      // Clear form inputs after successful transaction
      setProductId('');
      setQuantity('');
      setError('');

      
    } catch (error) {
      // Handle error
      setError(`Error purchasing product: ${error.message}`);
    }
  };

  
  return (
    <form className="form-container" onSubmit={handlePurchaseSubmit}>
      <label className="label">
        Product No. from list:
        <input
          className="input"
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </label>
      <br />
      <label className="label">
        Quantity:
        <input
          className="input"
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <br />
      {error && <p className="error">{error}</p>}
      <button className="button" type="submit" disabled={!state.contract}>
        Purchase Product
      </button>
    </form>
  );
};

export default Productpurchase;
