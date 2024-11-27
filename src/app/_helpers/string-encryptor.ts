
import * as aesjs from "aes-js";
import base64url from "base64url";

export function encrypt(msg: string): string {

    var key = "0gwal0gwal?>#9xd";
    var iv = "3RMmp-4L6TXSwwB5";

    var keyBytes = aesjs.utils.utf8.toBytes(key);
    var ivBytes = aesjs.utils.utf8.toBytes(iv);

    var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    var textBytes = aesjs.utils.utf8.toBytes(msg);
    var padded = aesjs.padding.pkcs7.pad(textBytes);
    var encryptedBytes = aesCbc.encrypt(padded);

    const encryptedBuffer = Buffer.from(encryptedBytes);

    return base64url.encode(encryptedBuffer);
}


export function encryptPayload(msg: any): string {

  var key = "0gwal0gwal?>#9xd";
  var iv = "3RMmp-4L6TXSwwB5";

  var keyBytes = aesjs.utils.utf8.toBytes(key);
  var ivBytes = aesjs.utils.utf8.toBytes(iv);

  var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  var textBytes = aesjs.utils.utf8.toBytes(msg);
  var padded = aesjs.padding.pkcs7.pad(textBytes);
  var encryptedBytes = aesCbc.encrypt(padded);

  const encryptedBuffer = Buffer.from(encryptedBytes);

  return base64url.encode(encryptedBuffer);
}


export function getLastFourChars(str: any) {
  return str.slice(-4);
}

export function getFirstFourChars(str: any) {
  return str.slice(0, 4);
}
