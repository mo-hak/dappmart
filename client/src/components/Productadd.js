
// const Productadd=({state})=>{

//     const addProduct=async(event)=>{
//         event.preventDefault();// use this when u dont want the page to reload
//         const {contract}= state;//for creating instance
//         const name= document.querySelector("#name").value;// to fetch the whatever data is beign printed
//         const price= document.querySelector("#price").value;
//         const quantity= document.querySelector("#quantity").value;
//         console.log(name,price,quantity);
//         const transaction  =await contract.addProduct(name,price,quantity) 
//         await transaction.wait();
//         console.log("product is added");
//      };
//     return(
//     <>
//     <form onSubmit={addProduct}>
//     <label>Name</label>
//     <input type="text" id="name" placeholder="Enter Your Name"></input>
//     <label>Price</label>
//     <input type="number" id="price" placeholder="Enter The Price"></input>
//     <label>Qyantity</label>
//     <input type="number" id="quantity" placeholder="Enter the Quantity"></input>
//     <button type="submit">ADD</button>
//     </form>
//     </>
//     );
// };

// export default Productadd;

import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Productadd.css';

const Productadd = ({ state }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!state || !state.contract) {
        console.error('Contract instance not found in state.');
        return;
      }// since i was facing an error i had a doubt that maybe at this place i m having error so i ran this

      const { contract } = state;

      // Convert price from ether to wei
      const priceInWei = ethers.utils.parseEther(productPrice);

      // Call the addProduct function on the contract
      await contract.addProduct(productName, priceInWei, productQuantity);

      // Clear form inputs after successful transaction
      setProductName('');
      setProductPrice('');
      setProductQuantity('');

      // Show success message or perform additional actions
      console.log('Product added successfully!');
    } catch (error) {
      // Handle error
      console.error('Error adding product:', error);
    }
  };

  
  return (
    <form className="form-container" onSubmit={handleProductSubmit}>
      <label className="label">
        Product Name:
        <input
          className="input"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </label>
      <br />
      <label className="label">
        Product Price (ETH):
        <input
          className="input"
          type="text"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </label>
      <br />
      <label className="label">
        Product Quantity:
        <input
          className="input"
          type="text"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
      </label>
      <br />
      <button className="button" type="submit" disabled={!state.contract}>
        Add Product
      </button>
    </form>
  );
};

export default Productadd;
