import { invSBox, sBox } from "./AES";
import { GF8 } from "./GF8";

// const a = new GF8(0xb4);
// const b = new GF8(0x11);
// const invA = a.inverse();
// console.log(new GF8(9).inv().val.toString(2)) 01001111
// console.log(sBox().map(v => v.toString(16)))
console.log(invSBox().map(v => v.toString(16)))
// console.log(a.createTable().map(v => ('00000000' + v.toString(2)).slice(-8)));
// console.log(('00000000' + a.mul(b).val.toString(2)).slice(-8))
// console.log(a.mul(invA));