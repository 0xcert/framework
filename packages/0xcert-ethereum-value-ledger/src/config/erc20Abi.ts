/**
 * ERC20 smart contract ABI.
 */
export default [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs":[
      {
        "name":"_name",
        "type":"string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "_totalSupply",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "_decimals",
        "type": "uint8",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "_symbol",
        "type": "string",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
];
