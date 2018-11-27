/**
 * OrderGateway smart contract ABI.
 */
export default [
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "name": "maker",
            "type": "address"
          },
          {
            "name": "taker",
            "type": "address",
          },
          {
            "components": [
              {
                "name": "kind",
                "type": "uint8"
              },
              {
                "name": "proxy",
                "type": "uint32"
              },
              {
                "name": "token",
                "type": "address"
              },
              {
                "name": "param1",
                "type": "bytes32"
              },
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "actions",
            "type": "tuple[]"
          },
          {
            "name": "seed",
            "type": "uint256"
          },
          {
            "name": "expiration",
            "type": "uint256"
          }
        ],
        "name": "_data",
        "type": "tuple",
      },
    ],
    "name": "cancel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "components": [
          {
            "name": "maker",
            "type": "address"
          },
          {
            "name": "taker",
            "type": "address"
          },
          {
            "components": [
              {
                "name": "kind",
                "type": "uint8"
              },
              {
                "name": "proxy",
                "type": "uint32"
              },
              {
                "name": "token",
                "type": "address"
              },
              {
                "name": "param1",
                "type": "bytes32"
              },
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "actions",
            "type": "tuple[]"
          },
          {
            "name": "seed",
            "type": "uint256"
          },
          {
            "name": "expiration",
            "type": "uint256",
          },
        ],
        "name": "_data",
        "type": "tuple",
      },
      {
        "components": [
          {
            "name": "r",
            "type": "bytes32"
          },
          {
            "name": "s",
            "type": "bytes32"
          },
          {
            "name": "v",
            "type": "uint8"
          },
          {
            "name": "kind",
            "type": "uint8"
          }
        ],
        "name": "_signature",
        "type": "tuple",
      },
    ],
    "name": "perform",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
];