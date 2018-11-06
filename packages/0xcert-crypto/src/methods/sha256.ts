import { sha } from "../tests/utils/sha";

/**
 * Converts a message into SHA256 hash string.
 * @param message Text message.
 */
export async function sha256(message) {
  return sha(256, message);
}
