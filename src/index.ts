import { GF8 } from "./GF8";

// const a = new GF8(0xb4);
// const b = new GF8(0x11);
// const invA = a.inverse();

for(let i = 1; i <= 0xFF; i++){
	const a = new GF8(i);
	const invA = a.inv();
	console.log(`Inverse of ${a.val.toString(16)} is ${invA.val.toString(16)} (Verification: ${a.mul(invA).val.toString(16)})`)
}

// console.log(a.createTable().map(v => ('00000000' + v.toString(2)).slice(-8)));
// console.log(('00000000' + a.mul(b).val.toString(2)).slice(-8))
// console.log(a.mul(invA));