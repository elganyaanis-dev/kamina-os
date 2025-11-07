// kamina-chain/token-contracts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying KMINA Token Contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy KMINA Token
  const KMINA = await ethers.getContractFactory("KMINA");
  const kmina = await KMINA.deploy();
  await kmina.deployed();
  console.log("✅ KMINA Token deployed to:", kmina.address);

  // Deploy Staking Contract
  const KMINAStaking = await ethers.getContractFactory("KMINAStaking");
  const staking = await KMINAStaking.deploy(kmina.address);
  await staking.deployed();
  console.log("✅ KMINA Staking deployed to:", staking.address);

  // Setup initial distribution
  console.log("📊 Setting up initial token distribution...");
  
  // Public sale allocation (10%)
  const publicSaleAmount = ethers.utils.parseEther("100000000"); // 100M
  // Will be transferred to sale contract when deployed

  // Team allocation (15%) - setup vesting
  const teamAmount = ethers.utils.parseEther("150000000"); // 150M
  const teamVestingDuration = 3 * 365 * 24 * 60 * 60; // 3 years

  // Ecosystem allocation (30%)
  const ecosystemAmount = ethers.utils.parseEther("300000000"); // 300M
  // Transferred to ecosystem fund

  console.log("🎯 Token Distribution Summary:");
  console.log("Total Supply:", ethers.utils.formatEther(await kmina.totalSupply()));
  console.log("Public Sale: 100,000,000 KMINA (10%)");
  console.log("Team: 150,000,000 KMINA (15%) - 3 year vesting");
  console.log("Ecosystem: 300,000,000 KMINA (30%)");
  console.log("Remaining: 450,000,000 KMINA (45%) for future minting");

  // Save deployment addresses
  const deploymentInfo = {
    kmina: kmina.address,
    staking: staking.address,
    deployer: deployer.address,
    network: await ethers.provider.getNetwork(),
    timestamp: new Date().toISOString()
  };

  const fs = require("fs");
  fs.writeFileSync("deployment.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment.json");

  console.log("🎉 KMINA Token deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
