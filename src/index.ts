import { GF8 } from "./GF8";

const a = new GF8(0b01010111);
const b = new GF8(0b10000011);

// console.log(a.createTable().map(v => ('00000000' + v.toString(2)).slice(-8)));
console.log(('00000000' + a.mul(b).val.toString(2)).slice(-8))