# Queries & Mutations

Comunication with the blockchain is quite different than communication with any kind of other storage system. For this reason, we will explain two different kinds of communication that are supported with the 0xcert framework.

A reading state from the blockchain is called a `query`. A query is quick, free, does not need any kind of account information, and you only need a provider to connect to the blockchain node.

The process of changing state on the blockchain called mutation is quite a different concept. Since changing anything on the blockchain needs to be confirmed by miners, that means the process is slow because a block with the data needs to be confirmed and every mutation has a fee that must be paid. That fee goes to the miners confirming the mutation. The fee depends on the storage/computing power needed to process the mutation and the current state of the blockchain (higher network traffic means higher fees or longer waiting time). Mutations have to be performed from a user’s wallet, meaning that the user has to confirm any mutation concerning his assets or values. This is primarily done with Metamask on the front end and by direct wallet connection on the backend.

Handling mutations (waiting for transaction to be minted, handling rejections, changing fees to a stuck transation, node errors, etc.) is the hardest part of blockchain communication. Therefore, we worked hard on having our framework handle most of the hard stuff. The methods of handling different situations are configurable with a default (recommended) setting.
