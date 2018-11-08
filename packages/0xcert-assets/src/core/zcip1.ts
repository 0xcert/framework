import { Model, prop } from '@rawmodel/core';
import { presenceValidator } from '@rawmodel/validators';

/**
 * 
 */
export class Zcip1 extends Model {

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
    validate: [
      { handler: presenceValidator(), code: 4220001 },
    ],
  })
  public description: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public id: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
    validate: [
      { handler: presenceValidator(), code: 4220003 },
    ],
  })
  public image: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
    validate: [
      { handler: presenceValidator(), code: 4220004 },
    ],
  })
  public name: string;

}
