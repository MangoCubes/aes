/**
 * Wrapper for hex numbers used in AES
 */
export class GF8{
	constructor(public val: number){
	}

	add(to: GF8){
		return new GF8(this.val ^ to.val);
	}

	createTable(){
		const table: number[] = [];
		table.push(this.val);
		for(let i = 0; i < 7; i++) {
			if((table[i] & 0x80) === 0) table.push(table[i] << 1);
			else {
				const shifted = table[i] << 1;
				table.push(shifted ^ 0x1B);
			}
		}
		return table;
	}

	mul(by: GF8){
		const table = this.createTable();
		let val = 0;
		for(let i = 0; i < 8; i++) {
			console.log(('00000000' + val.toString(2)).slice(-8))
			if(by.val & (0x1 << i)) val ^= table[i];
		}
		return new GF8(val);
	}

	/**
	 * Returns the position of the highest 1 bit
	 * 00110011 -> 6
	 * 00000010 -> 2
	 * 00000000 -> 0
	 * @returns The position of the highest 1 bit, 0 ~ 8 (0 is returned if there are no 1 bits)
	 */
	getHighestBitPos(){
		for(let i = 0; i < 8; i++) {
			if(this.val & (0x80 >> i)) return 8 - i;
		}
		return 0;
	}

	inverse(by: GF8){
		const table = [
			
		]
	}
}