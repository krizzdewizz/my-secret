import { create_sjcl } from './sjcl/sjcl';
import { error, ok, Result } from './core/core';

type Encryptor = {
  encrypt: (password: string, data: string) => string;
  decrypt: (password: string, data: string) => string;
};

// sjcl structure
type Encrypted = {
  iv: string;
  salt: string;
  ct: string;
};

const IMPL = (() => {
  const impl = create_sjcl() as unknown as Encryptor;
  if (!impl) {
    throw new Error('no sjcl implementation found');
  }
  return impl;
})();

/**
 * @param password empty in which a failure is returned
 * @param data empty in which case a failure is returned
 */
export const encrypt = (password: string, data: string): Result<string> => {
  if (!password) {
    return error(`password must not be empty`);
  }
  if (!data) {
    return error(`no data to encrypt`);
  }

  const json: Encrypted = JSON.parse(_encrypt(IMPL, password, data));
  const joined = [json.iv, json.salt, json.ct].join(':');

  return ok(joined);
};

/**
 * @return undefined if failed
 */
export const decrypt = (
  password: string,
  data: string | undefined
): Result<string> => {
  if (!data) {
    return error('decrypt data must not be empty');
  }

  try {
    const [iv, salt, ct] = data.split(':');
    const enc: Encrypted = { iv, salt, ct };
    const decrypted = _decrypt(IMPL, password, JSON.stringify(enc));
    if (!decrypted) {
      return error('error while decrypting');
    }
    return ok(decrypted);
  } catch (e: any) {
    return error(`error while decrypting: ${e.message}`);
  }
};

const _encrypt = (
  encryptor: Encryptor,
  password: string,
  data: string
): string => encryptor.encrypt(password, data);

const _decrypt = (
  encryptor: Encryptor,
  password: string,
  data: string
): string | undefined => {
  try {
    return encryptor.decrypt(password, data);
  } catch (e) {
    return undefined;
  }
};
