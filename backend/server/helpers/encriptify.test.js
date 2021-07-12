const assert = require('assert');
const encriptify = require('./encriptify');

describe('encriptify', () => {
  describe('decrypt()', () => {
    it('should return the same text after decryption of encrypted text', () => {
      const plaintext = 'my message text';
      const encrypted = encriptify.encrypt(plaintext);

      const decryptOutput = encriptify.decrypt(encrypted);

      assert.strictEqual(decryptOutput, plaintext);
    });
  });
});
