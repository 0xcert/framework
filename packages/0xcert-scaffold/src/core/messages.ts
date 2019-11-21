import { ProviderIssue } from './issues';

export default {
  [ProviderIssue.ACTIONS_ORDER_KIND_NOT_SUPPORTED]: 'Actions order kind not supported.',
  [ProviderIssue.DYNAMIC_ACTIONS_ORDER_SIGNATURES]: 'Amount of signature not consistent with signers for DYNAMIC_ACTIONS_ORDER kind.',
  [ProviderIssue.FIXED_ACTIONS_ORDER_SIGNATURES]: 'Amount of signature not consistent with signers for FIXED_ACTIONS_ORDER kind.',
  [ProviderIssue.SIGNED_DYNAMIC_ACTIONS_ORDER_SIGNATURES]: 'Amount of signature not consistent with signers for SIGNED_DYNAMIC_ACTIONS_ORDER kind.',
  [ProviderIssue.SIGNED_FIXED_ACTIONS_ORDER_SIGNATURES]: 'Amount of signature not consistent with signers for SIGNED_FIXED_ACTIONS_ORDER kind.',
  [ProviderIssue.NO_RECEIVER_ID]: '`receiverId` is not set.',
  [ProviderIssue.SENDER_ID_NOT_A_SIGNER]: 'SenderId not a signer.',
  [ProviderIssue.SENDER_ID_AND_RECEIVER_ID_MISSING]: 'Both senderId and receiverId missing.',
  [ProviderIssue.ACTION_KIND_NOT_SUPPORTED]: 'Not implemented.',
  [ProviderIssue.ERC20_APPROVAL_RACE_CONDITION]: 'First set approval to 0. ERC-20 token potential attack.',
};
