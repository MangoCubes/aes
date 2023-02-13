/**
 * A class that wraps a number in 0x00 and 0xFF inclusive with functions to do operations over GF(2^8)
 */
export class GF8{
	constructor(public val: number){
	}

	/**
	 * Add two numbers together in GF(2^8), and return a new instance
	 * Note that in this field, addition is equivalent to XOR operation
	 * @param to The number to add
	 * @returns A new instance with a value of two GF8 instances added together
	 */
	add(to: GF8){
		return new GF8(this.val ^ to.val);
	}

	/**
	 * Multiply two numbers in GF(2^8), and return a new instance
	 * Note that in this field, multiplication is defined as polynomial multiplication with modulo x^8 + x^4 + x^3 + x + 1
	 * @param by The number to multiply
	 * @returns  A new instance with a value of two GF8 instances multiplied together
	 */
	mul(by: GF8){
		if(by.val === 0) return new GF8(0);
		let temp = this.val;
		let val = 0;
		for(let i = 0; i < 8; i++){
			if(by.val & (0x1 << i)) val ^= temp;
			if((temp & 0x80) === 0) temp = (temp << 1) & 0xFF;
			else temp = ((temp << 1) & 0xFF) ^ 0x1B;
		}
		return new GF8(val);
	}

	/**
	 * Calculates a multiplicative inverse of this instance and return a new instance with that value
	 * This uses extended Euclid's algorithm to calculate the inverse
	 * @returns A new instance that has the value of the current instance's multiplicative inverse
	 */
	inv(){
		const table: {
			r: number;
			q: number;
			y: number;
		}[] = [
			{r: 0b100011011, q: 0, y: 0},
			{r: this.val, q: 0, y: 1}
		];

		let current = 0;
		while(table[table.length - 1].r !== 1){
			const div = divideWithRemainder(table[current].r, table[current + 1].r);
			const prevY = new GF8(table[current].y);
			const nextY = new GF8(table[current + 1].y);
			const prod = new GF8(div.q).mul(nextY);
			table.push({
				...div,
				y: prevY.add(prod).val
			});
			current++;
		}
		return new GF8(table[table.length - 1].y);
	}
}

/**
 * Calculates the highest set bit position
 * Returns 0 if the LSB is the only one set, and -1 if the input is 0
 * @param a The input
 * @returns The index of the highest set bit
 */
function highestBitPos(a: number){
	let counter = 0;
	while(a > 0){
		counter++;
		a = a >> 1;
	}
	return counter - 1;
}

/**
 * Divide a polynomial by another, and calculates the quotient and remainder
 * @param a The dividend
 * @param b The divisor
 * @returns The quotient and remainder
 */
function divideWithRemainder(a: number, b: number) {
	const quotientBits = [];
	const bBit = highestBitPos(b);
	while(true){
		const aBit = highestBitPos(a);
		const q = aBit - bBit;
		if(q < 0) break;
		a = a ^ (b << q);
		quotientBits.push(q);
	}
	return {
		r: a,
		q: quotientBits.reduce((prev, current) => prev += (1 << current), 0)
	}
}