function base64Encode(text) {
  return window.btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text) {
  return decodeURIComponent(escape(window.atob(text)));
}

export {base64Decode, base64Encode}
