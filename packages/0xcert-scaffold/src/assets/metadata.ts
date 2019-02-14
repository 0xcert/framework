/**
 * Definition of asset metadata.
 */
export interface AssetMetadata {

  /**
   * A detailed description of an asset.
   */
  description?: string;

  /**
   * A valid URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
   */
  image?: string;

  /**
   * A name of an asset.
   */
  name?: string;
}
