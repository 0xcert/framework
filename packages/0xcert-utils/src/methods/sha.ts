/**
 * Converts a message into SHA256 hash string.
 * @param bits Number of bits (e.g. 256).
 * @param message Text message.
 */
export async function sha(bits: number, message: string) {
  if (typeof window !== 'undefined') {
    const msgBuffer = new (window as any)['TextEncoder']('utf-8').encode(message);
    const hashBuffer = await window['crypto'].subtle.digest(`SHA-${bits}`, msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => (`00${b.toString(16)}`).slice(-2)).join('');
  } else {
    return require('crypto').createHash(`sha${bits}`).update(message).digest('hex');
  }
}
