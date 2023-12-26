const abi = [
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "all",
        "type": "bool"
      }
    ],
    "name": "del",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "read",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "note",
        "type": "string"
      }
    ],
    "name": "write",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

export default {
  address: '0x3193F31Fda5E25ca567e2E9d2C8DfebCB0cb0395' as `0x${string}`, // sepolia
  // address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  abi,
}
