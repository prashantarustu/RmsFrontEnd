// Import Component
import moment from 'moment'
import { AddDeleteUpadate, fetchPostData } from '../hooks/Api';
import axios from 'axios';
var CryptoJS = require("crypto-js");



export const getShowingDateText = (dateStr) => {
  return moment(dateStr).format("MM/DD/yyyy HH:mm")
}

export const getShowingYearMonthDate = (dateStr) => {
  return moment(dateStr).format("yyyy-MM-DD HH:mm:ss")
}

export const currentDate = () => {
  return moment(new Date()).format('YYYY-MM-DD');
}

export const getShowingMonthDateYear = (dateStr) => {
  return moment(dateStr).format("MM/DD/YYYY HH:mm:ss")
}

export const getShowingWithOutTime = (dateStr) => {
  return moment(dateStr).format("MM/DD/YYYY")
}

export const getMonthWithOutDateTime = (dateStr) => {
  return moment(dateStr).month()
}

export const getYearWithOutDateTime = (dateStr) => {
  return moment(dateStr).year()
}



// Encrypted And Decrypted -> Key 
var Key = '9z$C&F)J@NcRfTjW'
var Code = 'QUJDREVGR0g='

export const DecryptedList = (response) => {
  var key = CryptoJS.enc.Utf8.parse(Key);
  var iv = CryptoJS.enc.Base64.parse(Code);
  var bytes = CryptoJS.TripleDES.decrypt(response, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const DecryptedID = (response) => {
  var key = CryptoJS.enc.Utf8.parse(Key);
  var iv = CryptoJS.enc.Base64.parse(Code);
  var bytes = CryptoJS.TripleDES.decrypt(response, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Encrypt Data 
export const EncryptedList = (text) => {
  var key = CryptoJS.enc.Utf8.parse(Key);
  var iv = CryptoJS.enc.Base64.parse(Code);
  var encoded = CryptoJS.enc.Utf8.parse(text);
  var bytes = CryptoJS.TripleDES.encrypt(encoded, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
  });
  return bytes.toString();
}

// Otp Component
export const get_OTP = () => {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP
}

// Decrypt ID And name 
export const Decrypt_Id_Name = (data, key) => {
  const result = JSON.parse(CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8))
  return result
}

export const Decrypt_Id = (data, key) => {
  var bytes = CryptoJS.AES.decrypt(data, key);
  var result = bytes.toString(CryptoJS.enc.Utf8);
  return result
}

export const Encrypted_Id_Name = (data, key) => {
  const result = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
  return result
}

//  Change Array
export const changeArrayFormat = (data, type) => {
  // if (type === 'group') {
  const result = data?.map((sponsor) =>
    ({ value: sponsor.GroupID, label: sponsor.GroupName, })
  )
  return result
  // }
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
  if (type === 'group') {
    const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
      ({ value: sponsor.GroupID, label: sponsor.GroupName })
    )
    return result[0]
  }
}

export const colourStyles = {
  control: (styles) => ({
    ...styles,
    height: 20,
    minHeight: 30,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
}

export const customStylesWithOutColor = {
  control: base => ({
    ...base,
    height: 20,
    minHeight: 30,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const tableCustomStyles = {
  headCells: {
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      paddingLeft: '0 8px',
    },
  },
  cells: {
    style: {
      fontSize: '18px',
      paddingLeft: '0 8px',

    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      // borderRadius: '25px',
      outline: '1px solid #FFFFFF',
    },
    style: {
      padding: '10px 0',
    },
  },
}

//WebSocket data encrypt and decrypt
export function encrypt(plain) {
  var aesKey = '0ca175b9c0f726a831d895e269332461';
  var key = CryptoJS.enc.Utf8.parse(aesKey);
  var encryptedData = CryptoJS.AES.encrypt(plain, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedData.ciphertext.toString()));
}

export function decrypt(secret) {
  var aesKey = '0ca175b9c0f726a831d895e269332461';
  var key = CryptoJS.enc.Utf8.parse(aesKey);
  var decryptedData = CryptoJS.AES.decrypt(secret, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}
