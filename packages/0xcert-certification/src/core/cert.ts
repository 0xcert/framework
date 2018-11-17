import { sha256 } from '@0xcert/crypto';
import { Merkle, MerkleHasher } from '@0xcert/merkle';
import { toString, stepPaths } from '../utils/data';
import { CertProp } from './types';

/**
 * 
 */
export interface CertConfig {
  schema: any;
  hasher?: MerkleHasher;
}

/**
 * 
 */
export class Cert {
  protected schema: any;
  protected merkle: Merkle;

  /**
   * Class constructor.
   * @param merkle Instance of merkle proof.
   */
  public constructor(config: CertConfig) {
    this.schema = config.schema;

    this.merkle = new Merkle({
      hasher: sha256,
      ...config,
    });
  }

  /**
   * 
   */
  public async notarize(data: any): Promise<CertProp[]> {
    const leafs = this.buildLeaf(this.schema, data, []);
    const props = await this.buildProps(leafs);
    return this.buildEvidences(props);
  }

  /**
   * 
   */
  public async disclose(data: any, paths: ((string|number)[])[]): Promise<CertProp[]> {
    const leafs = this.buildLeaf(this.schema, data, []);
    const props = await this.buildProps(leafs);
    return this.buildEvidences(props, paths);
  }

  /**
   * 
   */
  public async imprint(data: any, evidence: CertProp[]): Promise<string> {

    return this.rebuildProps(data, evidence);
  }

  /**
   * 
   */
  protected buildLeaf(schema, data, prepend) {
    if (schema.type === 'array') {
      return (data || []).map((v, i) => {
        return this.buildLeaf(schema.items, v, [...prepend, i]);
      }).reduce((a, b) => a.concat(b), [])
    }
    else if (schema.type === 'object') {
      return Object.keys(schema.properties).sort().map((key) => {
        const prop = this.buildLeaf(schema.properties[key], (data || {})[key], [...prepend, key]);
        return ['object', 'array'].indexOf(schema.properties[key].type) === -1 ? [prop] : prop;
      }).reduce((a, b) => a.concat(b), [])
    }
    else {
      return {
        path: prepend,
        value: toString(data),
        key: prepend.join('.'),
        group: prepend.slice(0, -1).join('.'),
      };
    }
  }

  /**
   * 
   */
  protected async buildProps(props) {
    props = [...props.sort((a, b) => a.key > b.key ? 1 : -1)];
    const groups = props.map((i) => i.group);

    for (const group of groups) {

      const exists = !!props.find((i) => i.key === group);
      if (exists) {
        continue;
      }

      const path = props.find((i) => i.group === group).path.slice(0, -1);
      const values = props.filter((i) => i.group === group).map((i) => i.value);
      const evidence = await this.merkle.notarize(values);
      props.push({
        path,
        value: evidence.nodes[0].hash,
        key: path.join('.'),
        group: path.slice(0, -1).join('.'),
      });
      return this.buildProps(props);
    }

    return props;
  }

  /**
   * 
   */
  protected async buildEvidences(props, paths = null) {
    const keys = paths ? stepPaths(paths).map((p) => p.join('.')) : null;

    const groups = {};
    props.forEach((p) => groups[p.group] = p.path.slice(0, -1));
    
    const evidences = await Promise.all(
      Object.keys(groups).map(async (group) => {
        const path = groups[group];
        const key = path.join('.');
        const values = props.filter((p) => p.group === group).map((p) => p.value);
        
        let evidence = await this.merkle.notarize(values);
        if (keys) {
          const expose = props.filter((p) => p.group === group)
            .map((p, i) => keys.indexOf(p.key) === -1 ? -1 : i)
            .filter((i) => i !== -1);

          evidence = await this.merkle.disclose(evidence, expose);
        }

        return { path, evidence, group: path.slice(0, -1).join('.'), key } as any;
      })
    );
    
    return evidences;
  }













    /**
   * 
   */
  protected rebuildProps(data, evidence) {

    // if (schema.type === 'array') {
    //   return (data || []).map((v, i) => {
    //     return this.buildLeaf(schema.items, v, [...prepend, i]);
    //   }).reduce((a, b) => a.concat(b), [])
    // }
    // else if (schema.type === 'object') {
    //   return Object.keys(schema.properties).sort().map((key) => {
    //     const prop = this.buildLeaf(schema.properties[key], (data || {})[key], [...prepend, key]);
    //     return ['object', 'array'].indexOf(schema.properties[key].type) === -1 ? [prop] : prop;
    //   }).reduce((a, b) => a.concat(b), [])
    // }
    // else {
    //   return {
    //     path: prepend,
    //     value: toString(data),
    //     key: prepend.join('.'),
    //     group: prepend.slice(0, -1).join('.'),
    //   };
    // }

    console.log('XXXXXX', evidence);

    return null;
  }

}
