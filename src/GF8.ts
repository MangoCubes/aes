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
		const table: {
			r: number;
			q: number;
			y: number;
		}[] = [
			{r: 0b100011011, q: 0, y: 0},
			{r: this.val, q: 0, y: 1}
		];

		const divideWithRemainder = (a: number, b: number) => {
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

function highestBitPos(a: number){
	let counter = 0;
	while(a > 0){
		counter++;
		a = a >> 1;
	}
	return counter - 1;
}