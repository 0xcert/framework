# Atomic transactions

If you want to exchange assets with someone in a trustless way, not depending on a third party nor accepting counterparty risk, atomic transactions are the way to go.

Atomic order is a way of creating an atomic swap within the 0xcert Framework. It is a set of instructions for what you will execute in a single transaction and with only two possible results. Either the transaction will succeed and all participants will receive their assets, or the transaction will fail and the operation will return to its starting point.

## General concept

Multiple actions can be performed in a single atomic order. Currently supported actions include transferring assets, transferring value, creating assets and more. Using atomic orders provides multiple advantages in addition to trustlessness and safety. You can delegate paying storage fees to another user as well as delegate the time when a mutation should be made.

The 0xcert Framework provides automatization to ensure that a specific agreement among multiple parties is reached. There are only two possible outcomes for an atomic swap:

* Successful completion of the trade for all parties involved; or
* Abolition of the process and returning to the starting point if the swap operation encounters issues in its settlement.

There is no middle ground for an atomic swap's outcome which reduces the possibility of one party taking advantage over the other.

## How it works?

Atomic orders are performed through gateway structures which are permanently deployed on the public infrastructure (e.g. Ethereum) and are publicly available to everyone. A fixed sequence of required steps and conditions is secured by cryptography embedded in these gateways. Once all steps are completed, the transaction is confirmed and successfully settled. If not, the atomic order process is abolished and canceled, with no effect on the assets that were subject to swap.

While the trade agreement is created in an off-chain environment between trading parties, the settlement of the trade done by atomic order is performed entirely on-chain. This makes every single step of the operation trackable and verifiable.
