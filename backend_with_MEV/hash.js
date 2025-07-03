const { keccak256, toUtf8Bytes } = require('ethers');
const hash = keccak256(toUtf8Bytes('HPX:USDT:100:my-secret'));
console.log(hash);
