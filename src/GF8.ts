/**
 * Wrapper for hex numbers used in AES
 */
export class GF8{
	constructor(public val: number){
	}

	add(to: GF8){
		this.val ^= to.val;
	}
}