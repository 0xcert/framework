**--- CLOSED ---**

# 0xcert Framework Bug Bounty

*This documents 0xcert's bug bounty process and how you can get rewarded for finding issues with the 0xcert Framework.*

## Sponsors

**Sponsor this bug bounty if you support the 0xcert Framework**. This means you will commit to paying researchers that demonstrate a problem. Contact us at [bounty@0xcert.org](mailto:bounty@0xcert.org) if interested. Thank you.

[![0xcert](https://img.shields.io/badge/0xcert-10.000.000%20ZXC-red.svg)](https://0xcert.org)

Become a sponsor and be listed here as a contributor to the bug bounty fund: `0x991b4c8b8BE23F27B83C3F2a272129b172EcbA9e`.

## Scope of this bounty program

Help us find any problems with the [0xcert Framework](https://docs.0xcert.org). Any reports and suggestions for code, operations, and style improvement will be appreciated and taken into consideration.

## Rules and rewards

- Issues that have already been published here or are already disclosed to the 0xcert team are not eligible for rewards (a corollary, the 0xcert team members are ineligible for rewards).
- Social engineering, XKCD#538 attacks, bringing down Mainnet/Infura, and other issues that are beyond the realm of the Framework are not in scope and will NOT be paid a reward.
- Source code of all the packages, readme files, and documentation of the Framework are in scope.
- Only the latest released version of each package in this Framework is in scope.
- [GitHub Issues](https://github.com/0xcert/framework/issues) is the only way to report issues and request rewards.
- The 0xcert team has complete and final judgment on the acceptability of bug reports.
- This program is governed under the laws of the Republic of Slovenia, if there is a party that we are unable to pay due to trade embargoes or other restrictions, then we won't pay. But we are happy to cooperate by making alternate arrangements.

Following is a [risk rating model](https://www.owasp.org/index.php/OWASP_Risk_Rating_Methodology) that judges the severity of an issue based on its likelihood and impact.

|                 | LOW LIKELIHOOD  | :left_right_arrow: | HIGH LIKELIHOOD      |
| --------------- | --------------- | ------------------ | -------------------- |
| **HIGH IMPACT** | Medium severity | High severity      | Highest severity |
| :arrow_up_down: | Low severity    | Medium severity    | High severity        |
| **LOW IMPACT**  | *Notable*       | Low severity       | Medium severity      |

Rewards:

- **Highest severity** — full payout of the bug bounty (500,000 ZXC)
- **High severity** — partial payout of the bug bounty (100,000 ZXC)
- **Medium severity** — partial payout of the bug bounty (10,000 ZXC)
- Eligible reports for medium, high, and highest severity will be mentioned in this thread in a leaderboard.
- The most active contributors will be rewarded at 0xcert's sole discretion, which also applies to contributors reporting low severity bugs.
- Additional rewards are available from [sponsors](#sponsors). In general, these will follow proportionally as the rewards above.
- 0xcert and sponsors reserve the right to deduct from the bounty pledge when the ongoing bug reports are rewarded.

Examples of impact:

- *High impact* — steal an asset/value from someone else, impersonate the ledger owner, atomic order distributes assets incorrectly
- *Medium impact* — cause a function to fail or performs a wrong operation
- *Low impact* — an obvious mistake in the documentation that affects the development process and validity of the applied code
- *Notable* — typos, missing comments

Examples of likelihood:

* *High likelihood* — affects all users of the ledger performing a certain function,
* *Medium likelihood* — affects a number of end users in a scenario that actually happens naturally in production deployments,
* *Low likelihood* — affects two end users only if they are cooperating together to exploit a specially crafted mutation,
* *Notable* — affects developers and grammarians but not end users.

How to win:

- Be descriptive and detailed when reporting your issue,
- Fix it — recommend a way to solve the problem,
- Include a [Specron test](https://specron.github.io/framework/) case that we can reproduce.

Rules for bounty sponsor:

- We will respond quickly to your questions.
- We will adjudicate all prizes quickly.

## More questions

* If you prefer to send us a bug report privately so that a fix can be developed concurrently with the announcement you are welcome to mail us at [bounty@0xcert.org](mailto:bounty@0xcert.org). You are welcome to make a hashed bug report (set issue body to hash of your message). This will still be eligible for payment and recognition.

* Will things change during the bounty program?
  * Yes, we are seeking sponsors and will add additional prizes here if that happens.
  * Yes, we will update the code and redeploy the contract. So, click [:star: STAR and :eye: WATCH](https://github.com/0xcert/framework/) above on this repo for updates.

- Taxes?
  - If you earn so much money that you will need to fill out a tax form, then we will ask you to do so. This program is subject to the laws of the Republic of Slovenia.

Released under the [MIT License](LICENSE).
