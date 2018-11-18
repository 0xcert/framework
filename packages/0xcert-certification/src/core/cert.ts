import { sha256 } from '@0xcert/crypto';
import { Merkle, MerkleHasher } from '@0xcert/merkle';
import { toString, stepPaths } from '../utils/data';
import { PropProof, PropPath } from './prop';

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
   * Returns a complete list of proofs for the entiry data object.
   * @param data Complete data object.
   */
  public async notarize(data: any): Promise<PropProof[]> {
    const dataProps = this.buildDataProps(data);
    const schemaProps = await this.buildSchemaProps(dataProps);
    const schemaProofs = await this.buildProofs(schemaProps);

    return schemaProofs.map((proof) => ({
      path: proof.path,
      nodes: proof.nodes,
      values: proof.values,
    }));
  }

  /**
   * Returns the minimal list of proofs needed to verify the provided data
   * object.
   * @param data Complete data object.
   * @param paths Property paths to be disclosed to a user.
   */
  public async disclose(data: any, paths: PropPath[]): Promise<PropProof[]> {
    const dataProps = this.buildDataProps(data);
    const schemaProps = await this.buildSchemaProps(dataProps);
    const schemaProofs = await this.buildProofs(schemaProps, paths);

    return schemaProofs.map((proof) => ({
      path: proof.path,
      nodes: proof.nodes,
      values: proof.values,
    }));
  }

  /**
   * Returns `true` when all the property values of the provided `data` are 
   * described with the `proofs`. Note that custom data properties will always
   * be ignored and will thus always pass.
   * @param data Complete data object.
   * @param proofs Data evidence proofs.
   */
  public async match(data: any, proofs: PropProof[]): Promise<boolean> {
    try {
      const dataProps = this.buildDataProps(data);
      const dataSchemaProps = await this.buildSchemaProps(dataProps);
      const dataSchemaProofs = await this.buildProofs(dataSchemaProps);
  
      return this.checkProofInclusion(proofs, dataSchemaProofs);
    }
    catch (e) {
      return false;
    }
  }

  /**
   * Calculates merkle tree root node from the provided `proofs`.
   * @param proofs Data evidence proofs.
   */
  public async calculate(proofs: PropProof[]): Promise<string> {
    try {
      return this.imprintProofs(proofs);
    }
    catch (e) {
      return null;
    }
  }

  /**
   * Calculates merkle tree root node for the provided `data`.
   * @param proofs Data evidence proofs.
   */
  public async imprint(data: any): Promise<string> {
    return this.notarize(data).then((n) => n[0].nodes[0].hash);
  }

  /**
   * Converts data object to a list of property values. The list will include
   * only properties defined by the schema.
   * @param data Arbitrary data object.
   * @param schema Used for recursive processing.
   * @param prepend Used for recursive processing.
   */
  protected buildDataProps(data, schema = this.schema, prepend = []) {
    if (schema.type === 'array') {
      return (data || []).map((v, i) => {
        return this.buildDataProps(v, schema.items, [...prepend, i]);
      }).reduce((a, b) => a.concat(b), [])
    }
    else if (schema.type === 'object') {
      return Object.keys(schema.properties).sort().map((key) => {
        const prop = this.buildDataProps((data || {})[key], schema.properties[key], [...prepend, key]);
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
   * Converts data properties (returned by the buildDataProps method) into a
   * complete list of properties defined by the schema. Values of objects and
   * arrays are populated with a hash string where each hash represents the root
   * merkle tree of a subordinated properties.
   * @param props Data properties.
   */
  protected async buildSchemaProps(props) {
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
      return this.buildSchemaProps(props);
    }

    return props;
  }

  /**
   * Calculates evidence object for each property and returns a list of proofs.
   * When providing the `paths` only the proofs needed for the required
   * propertoes are included in the result.
   * @param props List Of schema properties.
   * @param paths Required propertiy paths.
   */
  protected async buildProofs(props, paths = null) {
    const keys = paths ? stepPaths(paths).map((p) => p.join('.')) : null;

    const groups = {};
    props.forEach((p) => groups[p.group] = p.path.slice(0, -1));
    
    return Promise.all(
      Object.keys(groups).map(async (group) => {
        const values = props.filter((p) => p.group === group).map((p) => p.value);
        
        let evidence = await this.merkle.notarize(values);
        if (keys) {
          const expose = props.filter((p) => p.group === group)
            .map((p, i) => keys.indexOf(p.key) === -1 ? -1 : i)
            .filter((i) => i !== -1);

          evidence = await this.merkle.disclose(evidence, expose);
        }

        return {
          path: groups[group],
          values: evidence.values,
          nodes: evidence.nodes,
          key: groups[group].join('.'),
          group: groups[group].slice(0, -1).join('.'),
        };
      })
    );
  }

  /**
   * Returns `true` when all the proof candidates are included in the primary 
   * list of proofs. 
   * @param proofs Schema proofs for which we claim are true.
   * @param candidates Schema proofs for which we would like to verify the inclusion.
   */
  protected checkProofInclusion(proofs: PropProof[], candidates: PropProof[]): boolean {

    proofs = JSON.parse(JSON.stringify(proofs))
      .map((prop) => ({ key: prop.path.join('.'), ...prop }));

    for (const candidate of candidates) {
      const group = candidate.path.slice(0, -1).join('.');
      const prop = proofs.find((e) => e['key'] === group);
      if (!prop) {
        return false;
      }

      for (const val of candidate.values) {
        const dup = prop.values.find((e) => (
          e.index === val.index && e.value === val.value
        ));
        
        if (!dup) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns an index of a property based on the schema object definition.
   * @param path Property path.
   */
  protected getPathIndexes(keys: PropPath): number[] {
    const indexes = [];
    let schema = this.schema;

    for (const key of keys) {
      if (schema.type === 'array') {
        indexes.push(key);
        schema = schema.items;
      }
      else if (schema.type === 'object') {
        indexes.push(
          Object.keys(schema.properties).sort().indexOf(key as string)
        );
        schema = schema.properties[key];
      }
      else {
        indexes.push(undefined);
      }
    }

    return indexes;
  }

  /**
   * 
   */
  protected async getEmptyImprint() {
    return this.merkle.notarize([]).then((e) => e.nodes[0].hash);
  }

  /**
   * Calculates merkle tree root node from the provided proofs.
   * @param proofs Data evidence proofs.
   */
  protected async imprintProofs(proofs: PropProof[]): Promise<string> {
    if (proofs.length === 0) {
      return this.getEmptyImprint();
    }

    proofs = JSON.parse(JSON.stringify(proofs))
      .map((prop) => ({
        key: prop.path.join('.'),
        group: prop.path.slice(0, -1).join('.'),
        ...prop,
      }))
      .sort((a, b) => a.path.length > b.path.length ? -1 : 1);

    for (const proof of proofs) {
      const imprint = await this.merkle.imprint(proof).catch(() => '');
      proof.nodes.unshift({
        index: 0,
        hash: imprint,
      });

      const groupKey = proof.path.slice(0, -1).join('.');
      const groupIndex = this.getPathIndexes(proof.path).slice(-1)[0];
      const groupProof = proofs.find((p) => p['key'] === groupKey);
      if (groupProof) {
        // const value = groupProof.values.find(() => );
        groupProof.values.unshift({
          index: groupIndex,
          value: imprint,
        });
      }
    }

    const root = proofs.find((f) => f['key'] === '');
    if (root) {
      return root.nodes.find((n) => n.index === 0).hash;
    }
    else {
      return this.getEmptyImprint();
    }
  }

}
