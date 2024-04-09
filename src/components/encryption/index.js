import React from 'react';

var CryptoJS = require("crypto-js");

function  DataEncrypt() {
    
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'my-secret-key@123').toString();
    //log encrypted data
    // console.log('Encrypt Data -')
    // console.log(ciphertext);
  
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'my-secret-key@123');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
    //log decrypted Data
    // console.log('decrypted Data -')
    // console.log(decryptedData);
  
    return (
      <div className="App">
        <header className="App-header">
          <div>Encrypt Data -{ciphertext}</div>
          <div>
            {decryptedData.map(function (object) {
              //console.log(object)
            })}
          </div>
        </header>
      </div>
    );
  }
  export default DataEncrypt;