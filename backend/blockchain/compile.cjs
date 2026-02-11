// Compile WorkerVerification.sol using solcjs
// Usage: node compile.cjs

const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'WorkerVerification.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'WorkerVerification.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['WorkerVerification.sol']['WorkerVerification'];

const buildDir = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

fs.writeFileSync(
    path.join(buildDir, 'WorkerVerification.json'),
    JSON.stringify({ abi: contract.abi, bytecode: contract.evm.bytecode.object }, null, 2)
);

console.log('Contract compiled and ABI/bytecode saved to build/WorkerVerification.json');
