require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');
const contractConfig = require('./contract-config');

const app = express();
app.use(cors());
app.use(express.json());

let api;
let contract;

// Initialiser la connexion Polkadot et le contrat
async function initializeAPI() {
  try {
    const provider = new WsProvider(process.env.WS_URL);
    api = await ApiPromise.create({ provider });
    
    // Créer l'instance du contrat (adresse à remplacer après déploiement)
    contract = new ContractPromise(api, contractConfig.abi, process.env.CONTRACT_ADDRESS);
    
    console.log('✅ Connecté à Substrate');
    console.log('📝 Contrat Kamina ERC20 initialisé');
  } catch (error) {
    console.error('❌ Erreur connexion:', error.message);
  }
}

// Middleware pour s'assurer que l'API est initialisée
app.use(async (req, res, next) => {
  if (!api) {
    await initializeAPI();
  }
  next();
});

// Route pour vérifier le solde RÉEL
app.get('/api/v1/kamina/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!contract || !process.env.CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS === 'your_contract_address_here') {
      return res.json({ 
        balance: "0", 
        address, 
        status: "CONTRACT_NOT_DEPLOYED",
        message: "Le contrat n'est pas encore déployé. Utilisez la version simulée."
      });
    }

    // Appel RÉEL au contrat
    const { gasRequired, result, output } = await contract.query.balanceOf(
      address, // caller
      { gasLimit: api.registry.createType('WeightV2', { refTime: 1000000000, proofSize: 1000000 }) },
      address  // owner
    );

    if (result.isOk && output) {
      const balance = output.toHuman();
      res.json({ 
        balance, 
        address,
        contract: process.env.CONTRACT_ADDRESS,
        status: "SUCCESS"
      });
    } else {
      res.status(500).json({ 
        error: "Erreur lors de la lecture du solde",
        details: result.toString()
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: "ERROR",
      fallback_balance: "0"
    });
  }
});

// Route de santé
app.get('/api/v1/health', async (req, res) => {
  const isConnected = api && api.isConnected;
  res.json({
    status: isConnected ? 'HEALTHY' : 'DISCONNECTED',
    timestamp: new Date().toISOString(),
    contract_initialized: !!contract,
    network: process.env.WS_URL
  });
});

// Route pour les infos du contrat
app.get('/api/v1/kamina/info', (req, res) => {
  res.json({
    name: "KAMINA Token",
    symbol: "KAMINA", 
    standard: "ERC20 (Ink!)",
    status: contract ? "INITIALIZED" : "NOT_INITIALIZED",
    contract_address: process.env.CONTRACT_ADDRESS,
    next_steps: "Déployer le contrat sur Rococo testnet"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Kamina lancée sur le port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`💰 Balance check: http://localhost:${PORT}/api/v1/kamina/balance/5GrwvaEF5z
npm run dev
npm run dev
npm run dev
# Test 1: Health check
curl http://localhost:3000/api/v1/health

# Test 2: Info du contrat
curl http://localhost:3000/api/v1/kamina/info

# Test 3: Balance (version simulée)
curl http://localhost:3000/api/v1/kamina/balance/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
cd ~/kamina-os
git add kamina-api/
git commit -m "feat: add Kamina API with contract integration"
git push origin blockchain/develop
# Dans le dossier kamina-chain/contracts/ink
cd kamina-chain/contracts/ink

# Installer cargo-contract (outil pour déployer les contrats Ink!)
curl -sSf https://raw.githubusercontent.com/paritytech/cargo-contract/master/install.sh | sh
# S'assurer d'être dans le bon dossier
cd ~/kamina-os/kamina-chain/contracts/ink

# Construire le contrat
cargo contract build
cargo +nightly contract build
cd ~/kamina-os/kamina-api
cat > .env << 'EOF'
PORT=3000
WS_URL=wss://rococo-contracts-rpc.polkadot.io
CONTRACT_ADDRESS=your_contract_address_here
