/**
 * Wrapper for hex numbers used in AES
 */
export class GF8{
	constructor(public val: number){
	}

	add(to: GF8){
		return new GF8(this.val ^ to.val);
	}

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

function highestBitPos(a: number){
	let counter = 0;
	while(a > 0){
		counter++;
		a = a >> 1;
	}
	return counter - 1;
}

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