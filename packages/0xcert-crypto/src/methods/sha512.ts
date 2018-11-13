import { sha } from "../utils/sha";

/**
 * Converts a message into SHA512 hash string.
 * @param message Text message.
 */
export async function sha512(message) {
  return sha(512, message);
}
