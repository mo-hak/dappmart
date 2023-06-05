const { ethers} = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ECommerce = await ethers.getContractFactory("ECommerce");
  const eCommerce = await ECommerce.deploy();

  await eCommerce.deployed();

  console.log("ECommerce deployed to:", eCommerce.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
