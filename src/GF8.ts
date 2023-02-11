/**
 * Wrapper for hex numbers used in AES
 */
export class GF8{
	constructor(public val: number){
	}

	add(to: GF8){
		return new GF8(this.val ^ to.val);
	}

	createTable(upTo: number){
		const table: number[] = [];
		table.push(this.val);
		for(let i = 0; i < upTo; i++) {
			if((table[i] & 0x80) === 0) table.push(table[i] << 1);
			else {
				const shifted = table[i] << 1;
				table.push(shifted ^ 0x1B);
			}
		}
		return table;
	}

	mul(by: GF8){
		const highestBit = highestBitPos(by.val);
		if(highestBit === -1) return new GF8(0);
		const table = this.createTable(highestBit);
		let val = 0;
		for(let i = 0; i <= highestBit; i++) {
			if(by.val & (0x1 << i)) val ^= table[i];
		}
		return new GF8(val);
	}

	inverse(){
		const table = [
			[0b100011011, 0, 0],
			[this.val, 0, 1]
		]

		const divideWithRemainder = (a: number, b: number) => {
			while(a > b){

			}
		}
	}
}

function highestBitPos(a: number){
	let counter = 0;
	while(a > 0){
		counter++;
		a = a >> 1;
	}
	return counter - 1;
}