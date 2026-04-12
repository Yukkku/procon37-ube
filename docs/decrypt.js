// @ts-check
(() => {
  /**
   * @param {ArrayBuffer} data
   * @return {ArrayBuffer}
   */
  const sha256 = data => {
    /**
     * @param {number} a
     * @param {number} b
     * @return {number}
     */
    const rightRotate = (a, b) => (a >>> b) | (a << (32 - b));

    const message = new DataView(new ArrayBuffer(((data.byteLength + 72) >>> 6) * 64));
    const u8arr = new Uint8Array(data);
    for (let i = 0; i < u8arr.length; i += 1) message.setUint8(i, u8arr[i]);

    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    message.setUint8(data.byteLength, 128);
    message.setUint32(message.byteLength - 4, data.byteLength * 8);

    for (let i = 0; i < message.byteLength; i += 64) {
      const w = new Int32Array(64);

      for (let j = 0; j < 16; j += 1) w[j] = message.getInt32(i + j * 4);

      for (let i = 16; i < 64; i += 1) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = w[i - 16] + s0 + w[i - 7] + s1;
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      for (let i = 0; i < 64; i += 1) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;

      }

      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
      h4 = (h4 + e) | 0;
      h5 = (h5 + f) | 0;
      h6 = (h6 + g) | 0;
      h7 = (h7 + h) | 0;
    }

    const retVal = new DataView(new ArrayBuffer(32));
    retVal.setInt32(0, h0);
    retVal.setInt32(4, h1);
    retVal.setInt32(8, h2);
    retVal.setInt32(12, h3);
    retVal.setInt32(16, h4);
    retVal.setInt32(20, h5);
    retVal.setInt32(24, h6);
    retVal.setInt32(28, h7);

    return retVal.buffer;
  };

  /** @type {{ salt: string, cipher: string }} */ // @ts-ignore
  const cip = window.cip;
  if (!cip) return;
  const { salt, cipher } = cip;

  const main = /** @type {HTMLElement} */ (document.querySelector('main'));

  const lockicon = '<svg viewbox="0 0 16 16" width="18"><path d="M3.75,6A1.75,1.75 0 0,0 2,7.75V14.25A1.75,1.75 0 0,0 3.75,16H12.25A1.75,1.75 0 0,0 14,14.25V7.75A1.75,1.75 0 0,0 12.25,6H12V4A4,4 0 0,0 4,4V6M3.5,7.75A0.25,0.25 0 0,1 3.75,7.5H12.25A0.25,0.25 0 0,1 12.5,7.75V14.25A0.25,0.25 0 0,1 12.25,14.5H3.75A0.25,0.25 0 0,1 3.5,14.25M5.5,6V4A2.5,2.5 0 0,1 10.5,4V6M7,12A1,1 0 0,0 9,12V10A1,1 0 0,0 7,10"/></svg>';
  const failureDialog = `
    <blockquote class="blockquote-tag blockquote-tag-warning">
      <p class="blockquote-tag-title">${lockicon}Locked</p>
      <p>この文書は暗号化されています. 閲覧するには正しいトークンが付与されたURLからアクセスしてください.</p>
    </blockquote>
  `;
  const successDialog = `
    <blockquote class="blockquote-tag blockquote-tag-warning">
      <p class="blockquote-tag-title">${lockicon}Confidential</p>
      <p>この文書は機密です. 大会終了まで取り扱いには注意してください.</p>
    </blockquote>
  `;

  /** @param {string} s */
  const text2arr = s => new Int32Array(Uint8Array.from(atob(s.replaceAll('-', '+').replaceAll('_', '/')), x => x.charCodeAt(0)).buffer);

  const token = localStorage.getItem('token');
  if (token === null) {
    main.innerHTML += failureDialog;
    return;
  }

  const tokenarr = text2arr(token);
  const saltarr = text2arr(salt);

  const pl = new Int32Array(text2arr(cipher).buffer);
  const keyi32 = new Int32Array(18);
  const key = keyi32.buffer;
  const keyu64 = new BigUint64Array(key);
  for (let i = 0; i < 8; ++i) {
    keyi32[i + 2] = tokenarr[i];
    keyi32[i + 10] = saltarr[i];
  }
  for (let i = 0; i < pl.length; i += 8) {
    const g = new Int32Array(sha256(key));
    for (let j = 0; j < 8; ++j) {
      pl[i + j] ^= g[j];
    }
    keyu64[0] += 1n;
  }
  const plain = new TextDecoder().decode(pl.buffer);
  main.innerHTML += successDialog;
  main.innerHTML += plain;
})();
