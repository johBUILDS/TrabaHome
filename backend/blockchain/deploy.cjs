// Deployment script for WorkerVerification contract
// Usage: node deploy.cjs

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const ganacheUrl = 'HTTP://192.168.1.177:7545'; // Ganache default
const web3 = new Web3(ganacheUrl);

const contractPath = path.join(__dirname, 'WorkerVerification.sol');
const compiled = require('./build/WorkerVerification.json'); // ABI & bytecode

async function deploy() {
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0]; // Use first Ganache account as admin

    const contract = new web3.eth.Contract(compiled.abi);
    const deployed = await contract.deploy({
        data: compiled.bytecode,
        arguments: [admin]
    }).send({
        from: admin,
        gas: 3000000
    });

    // Save ABI and address
    fs.writeFileSync(path.join(__dirname, 'WorkerVerification.address.json'), JSON.stringify({
        address: deployed.options.address,
        abi: compiled.abi
    }, null, 2));

    console.log('Contract deployed at:', deployed.options.address);
}

deploy().catch(console.error);
