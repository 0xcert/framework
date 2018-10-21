// import { IConnector, IActionRequest, ActionId, IIntent, IActionResponse, IIntentResponse } from '@0xcert/connector';
// import { EventEmitter } from '../utils/emitter';

// /**
//  * Protocol client configuration object.
//  */
// export interface IProtocolConfig {
//   connector?: IConnector;
// }

// /**
//  * Protocol client.
//  */
// export class Protocol extends EventEmitter {
//   readonly connector: IConnector;
//   readonly intents: IIntent[] = [];

//   /**
//    * Class constructor.
//    * @param config 
//    */
//   public constructor(config: IProtocolConfig) {
//     super();
//     this.connector = config.connector;
//   }

//   /**
//    * Performs protocol read operation.
//    * @param recipe Query configuration object.
//    */
//   public async createQuery(recipe: QueryRecipe): Promise<QueryResult> {
//   }

//   /**
//    * Performs protocol mutate operation.
//    * @param recipe Mutation configuration object.
//    */
//   public async createMutation(recipe: MutationRecipe): Promise<MutationResult> {
//   }

//   // /**
//   //  * Performs protocol action based on the received request object.
//   //  * @param res Protocol request object.
//   //  */
//   // public async createMutation(request: IActionRequest): Promise<IIntent> {
//   //   switch (request.actionId) {
//   //     case ActionId.FOLDER_READ_METADATA:
//   //     case ActionId.FOLDER_READ_SUPPLY:
//   //     case ActionId.FOLDER_READ_CAPABILITIES:
//   //     case ActionId.FOLDER_CHECK_TRANSFER_STATE:
//   //       const intent = await this.connector.prepare(request);
//   //       this.intents.push(intent);
//   //       return intent;
//   //     default:
//   //       throw 'Unknown action';
//   //   }
//   // }

//   /**
//    * 
//    */
//   public async resolve(intents: IIntent[]): Promise<IIntentResponse[]> {
//     return Promise.all(
//       intents.map((intent) => this.connector.hydrate(intent))
//     );
//   }

// }
