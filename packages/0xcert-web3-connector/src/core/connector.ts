import { ConnectorBase, ConnectorError, ConnectorIssue } from "@0xcert/scaffold";
import { parseError } from '@0xcert/web3-errors';
import * as Web3 from 'web3';
import { SignMethod } from "./types";

/**
 * 
 */
export class Connector implements ConnectorBase
{
  public makerId: string;
  public minterId?: string;
  public signMethod: SignMethod;
  public web3: any;

  /**
   * 
   */
  public async attach(
    options?:
    {
      makerId?: string;
      minterId?: string;
      signMethod?: SignMethod;
      web3?: any;
    }
  ) {
    options = options || {};

    this.web3 = this.getWeb3(options.web3);
    this.makerId = await this.getMakerId(options.makerId);
    this.minterId = options.minterId || '0x';
    this.signMethod = await this.getSignMethod(options.signMethod);

    return this;
  }

  /**
   * 
   */
  public async detach()
  {
    this.web3 = null;
    this.makerId = null;
    this.signMethod = null;
    this.minterId = null;

    return this;
  }

  /**
   * 
   */
  public async sign(data: string)
  {
    return `${this.signMethod}:${await this.signData(data)}`;
  }

  /**
   * 
   */
  public getWeb3(web3?: any)
  {
    return web3 ? web3 : new Web3('ws://localhost:8545');
  }

  /**
   * 
   */
  public async getAccounts()
  {
    try
    {
      return await this.web3.eth.getAccounts();
    }
    catch (error)
    {
      throw parseError(error);
    }
  }

  /**
   * 
   */
  public async getMakerId(makerId?: string)
  {
    const accounts = await this.getAccounts();

    if (makerId === undefined)
    {
      makerId = accounts[0];
    }

    if (accounts.indexOf(makerId) === -1)
    {
      throw new ConnectorError(ConnectorIssue.INVALID_MAKER_ID)
    }

    return makerId;
  }

  /**
   * 
   */
  public getSignMethod(signMethod?: SignMethod)
  {
    if (signMethod === undefined)
    {
      signMethod = SignMethod.ETH_SIGN;
    }

    if ([0, 1, 2].indexOf(signMethod) === -1)
    {
      throw new ConnectorError(ConnectorIssue.SIGNATURE_UNKNOWN, `Unknown signature method ${signMethod}`);
    }

    return signMethod;
  }

  /**
   * 
   */
  public async signData(data: string)
  {
    try 
    {
      switch (this.signMethod)
      {
        case SignMethod.ETH_SIGN:
          return await this.web3.eth.sign(data, this.makerId);
        case SignMethod.TREZOR:
          return '';
        case SignMethod.EIP712:
          return '';
        default:
          return null;
      }
    }
    catch (error)
    {
      throw new ConnectorError(ConnectorIssue.SIGNATURE_FAILED, error);
    }
  }

}
