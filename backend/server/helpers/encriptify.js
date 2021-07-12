const NodeRSA = require('node-rsa');

const ALGORITHM = {

  KEY: '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n' +
  'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n' +
  'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n' +
  'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n' +
  'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n' +
  'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n' +
  'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n' +
  '-----END RSA PRIVATE KEY-----',

};


const encrypt = (text) => {
  const key = new NodeRSA(ALGORITHM.KEY);
  const encrypted = key.encrypt(text, 'base64');
  return encrypted;
};

const decrypt = (hash) => {
  const key = new NodeRSA(ALGORITHM.KEY);
  const decrypted = key.decrypt(hash, 'utf8');
  return decrypted;
};


const toHex = base64 => Buffer.from(base64, 'base64').toString('hex');
const toBase64 = hex => Buffer.from(hex, 'hex').toString('base64');

module.exports = {
  encrypt,
  decrypt,
  toHex,
  toBase64
};
