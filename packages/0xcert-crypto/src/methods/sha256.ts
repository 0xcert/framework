/**
 * Converts a message into SHA256 hash string.
 * @param message Text message.
 */
export async function sha256(message) {
  if (typeof window !== 'undefined') {
    const msgBuffer = new window['TextEncoder']('utf-8').encode(message);
    const hashBuffer = await window['crypto'].subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  }
  else {
    return require('crypto').createHmac('sha256', message).digest('hex');
  }
}
