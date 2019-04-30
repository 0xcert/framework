/**
 *
 */
export class Client {
  public provider;
  public modules;

  /**
   *
   */
  public constructor(options: {
    provider: any;
    modules: any;
  }) {
    this.provider = options.provider;
    this.modules = options.modules || [];
  }

  /**
   *
   */
  public deployAssetLedger(config: any) {
    const module = this.getModule('AssetLedger');

    if (!module) {
      throw this.getMissingModuleError('AssetLedger');
    } else {
      return module.deploy(this.provider, config);
    }
  }

  /**
   *
   */
  public deployValueLedger(config: any) {
    const module = this.getModule('ValueLedger');

    if (!module) {
      throw this.getMissingModuleError('ValueLedger');
    } else {
      return module.deploy(this.provider, config);
    }
  }

  /**
   *
   */
  public getAssetLedger(id: string) {
    const module = this.getModule('AssetLedger');

    if (!module) {
      throw this.getMissingModuleError('AssetLedger');
    } else {
      return new module.object(this.provider, id);
    }
  }

  /**
   *
   */
  public getOrderGateway(id?: string) {
    const module = this.getModule('OrderGateway');

    if (!module) {
      throw this.getMissingModuleError('OrderGateway');
    } else {
      return new module.object(this.provider, id);
    }
  }

  /**
   *
   */
  public getValueLedger(id: string) {
    const module = this.getModule('ValueLedger');

    if (!module) {
      throw this.getMissingModuleError('ValueLedger');
    } else {
      return new module.object(this.provider, id);
    }
  }

  /**
   *
   */
  public createCert(schema: any) {
    const module = this.getModule('Cert');

    if (!module) {
      throw this.getMissingModuleError('Cert');
    } else {
      return new module.object(schema);
    }
  }

  /**
   *
   */
  public getModule(name: string) {
    return this.modules.find((m) => m.name === name);
  }

  /**
   *
   */
  protected getMissingModuleError(name: string) {
    throw new Error(`The ${name} module is not available.`);
  }

}
