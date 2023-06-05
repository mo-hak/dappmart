// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");//used for deplying contract
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("ECommerce", function () {
   // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  let ECommerce;
  let hardhatecommerce;
  let owner;
  let seller;
  let buyer;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    ECommerce = await ethers.getContractFactory("ECommerce");// instance created
    hardhatecommerce = await ECommerce.deploy();// use this as instance of contract
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatecommerce.owner()).to.equal(owner.address);
    });
  });
  
  describe("Transactions", function () {
  it("should add a product and emit ProductAdded event", async function () {
    const productName = "Test Product";
    const productPrice = ethers.utils.parseEther("1");
    const productQuantity = 10;

    await expect(
      hardhatecommerce.connect(seller).addProduct(productName, productPrice, productQuantity)
    )
      .to.emit(hardhatecommerce, "ProductAdded")
      .withArgs(productPrice,1, productQuantity,seller.address, productName);

    const product = await hardhatecommerce.products(1);
    expect(product.seller).to.equal(seller.address);
    expect(product.name).to.equal(productName);
    expect(product.price).to.equal(productPrice);
    expect(product.quantity).to.equal(productQuantity);
  });

  it("should purchase a product and emit ProductPurchased event", async function () {
    const productName = "Test Product";
    const productPrice = ethers.utils.parseEther("1");
    const productQuantity = 10;

    await hardhatecommerce.connect(seller).addProduct(productName, productPrice, productQuantity);

    const purchaseQuantity = 5;
    const totalPrice = productPrice.mul(purchaseQuantity);

    await expect(
      hardhatecommerce.connect(buyer).purchaseProduct(1, purchaseQuantity, { value: totalPrice })
    )
      .to.emit(hardhatecommerce, "ProductPurchased")
      .withArgs(1, buyer.address, productName, productPrice, purchaseQuantity);

    const product = await hardhatecommerce.products(1);
    expect(product.quantity).to.equal(productQuantity - purchaseQuantity);
  });

  it("should withdraw commission and emit CommissionWithdrawn event", async function () {
    const productPrice = ethers.utils.parseEther("1");
    const productQuantity = 10;
    const purchaseQuantity = 5;
    const totalPrice = productPrice.mul(purchaseQuantity);

    await hardhatecommerce.connect(seller).addProduct("Test Product", productPrice, productQuantity);
    await hardhatecommerce.connect(buyer).purchaseProduct(1, purchaseQuantity, { value: totalPrice });

    const commissionAmount = (totalPrice.mul(5)).div(100);
    const initialBalance = await ethers.provider.getBalance(owner.address);

    await expect(hardhatecommerce.connect(owner).withdrawCommission())
      .to.emit(hardhatecommerce, "CommissionWithdrawn")
      .withArgs(owner.address, commissionAmount);

    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance.sub(initialBalance)).to.equal(commissionAmount);
  });
});
});


