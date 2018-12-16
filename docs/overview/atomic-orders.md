# Atomic Orders

If you want to exchange assets with someone in a trustless way without a third party involvement and no risk of asset loss, then atomic orders are the way to go. Atomic order is a way of creating an atomic swap in the 0xcert framework. It is a set of instructions for what you want to execute in a single mutation and with only two possible results. Either a mutation happens and all participants get their assets, or a mutation fails and the operation returns to its starting point. There are multiple actions that can be performed in such a manner. For now, you can transfer assets, values, and even create a new asset. Using atomic offers provides multiple advantages apart from trustlesness and safety. With them, you can delegate paying blockchain fees to another user as well as delegate the time when a mutation should be made.

## How it works (with graphics)

Smart contract technology provides automatization to ensure that a certain agreement between both parties is reached. There are only two possible endpoints for an atomic swap: either

* a successful completion of a trade for both parties or
* an abolition of the process and returning to the starting point if the smart contract encounters issues in its settlement.

There is no middle ground for an atomic swap outcome which reduces the possibility of one party taking unfair advantage over the other.

A fixed sequence of required steps and conditions is secured by cryptography embedded in the atomic swap smart contract. Once all steps are completed, the swap is confirmed and successfully settled. If not, the atomic swap process is abolished and canceled, with no damage to the assets that were subject to swap.

While the trade agreement is created in an off-chain environment between trading parties, the settlement of the trade done by atomic swap is performed entirely on blockchain. This makes every single step of the operation trackable and verifiable.
