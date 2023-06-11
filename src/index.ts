import { invSBox, sBox } from "./sBox";
import { GF8 } from "./GF8";
import { AESKey } from "./AES";

// const a = new GF8(0xb4);
// const b = new GF8(0x11);
// const invA = a.inverse();
// console.log(new GF8(9).inv().val.toString(2)) 01001111
// console.log(sBox())
// console.log(invSBox().map(v => v.toString(16)))
// console.log(a.createTable().map(v => ('00000000' + v.toString(2)).slice(-8)));
// console.log(('00000000' + a.mul(b).val.toString(2)).slice(-8))
// console.log(a.mul(invA));
new AESKey([0x0f, 0x15, 0x71, 0xc9, 0x47, 0xd9, 0xe8, 0x59, 0x0c, 0xb7, 0xad, 0xd6, 0xaf, 0x7f, 0x67, 0x98]);