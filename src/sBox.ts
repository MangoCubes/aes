import { GF8 } from "./GF8";

/**
 * Bit representation of 63, but with LSB first
 */
const n63Reversed = [1, 1, 0, 0, 0, 1, 1, 0];

/**
 * Same as above except for 5
 */
const n5Reversed = [1, 0, 1, 0, 0, 0, 0, 0];

/**
 * Calculates the value of a single cell in the S-box
 * @param byte The position of the cell
 * @returns The value of that cell in the S-box
 */
function sBoxBit(byte: number){
	// Converts byte into bit representation
	const bits = [...Array(8)].map((v, i) => (byte >> i) & 1);
	// Each bit goes through the following transformation
	const transformed = bits.map((v, i) => {
		// This finds all bits that will be XORed together
		const toXOR: number[] = [v, bits[(i + 4) % 8], bits[(i + 5) % 8], bits[(i + 6) % 8], bits[(i + 7) % 8], n63Reversed[i]];
		const setBits = toXOR.reduce((prev, v) => v + prev, 0);
		return setBits % 2;
	});
	return transformed.reduce((prev, v, i) => v ? prev + 2 ** i : prev, 0);
}

/**
 * Calculates the value of a single cell in the inverse S-box
 * @param byte The position of the cell
 * @returns The value of that cell in the inverse S-box
 */
function invSBoxBit(byte: number){
	const bits = [...Array(8)].map((v, i) => (byte >> i) & 1);
	const transformed = bits.map((v, i) => {
		const toXOR: number[] = [bits[(i + 2) % 8], bits[(i + 5) % 8], bits[(i + 7) % 8], n5Reversed[i]];
		const setBits = toXOR.reduce((prev, v) => v + prev, 0);
		return setBits % 2;
	});
	return transformed.reduce((prev, v, i) => v ? prev + 2 ** i : prev, 0);
}

/**
 * Calculates S-box and returns it
 * @returns S-box
 */
export function sBox(){
	const box = [];
	box.push(sBoxBit(0));
	for(let i = 1; i <= 0xFF; i++) {
		const inv = new GF8(i).inv();
		box.push(sBoxBit(inv.val));
	}
	return box;
}

/**
 * Calculates inverse S-box and returns it
 * @returns inverse S-box
 */
export function invSBox(){
	const box = [];
	for(let i = 0; i <= 0xFF; i++) {
		const transformed = new GF8(invSBoxBit(i));
		if (transformed.val) box.push(transformed.inv().val);
		else box.push(0);
	}
	return box;
}