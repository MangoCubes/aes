import { AESKey } from "./AESKey";
import { GF8 } from "./GF8";
import { invSBox, sBox } from "./sBox";

export class AES {
    key: AESKey;
    blocks: number[][];
    sBox: number[];
    invSBox: number[];
    constructor(data: number[] | string, key: number[] | string){

        const convert = (s: string) => {
            const ret = [];
            for(let i = 0; i < s.length; i += 2){
                ret.push(parseInt(s.slice(i, i + 2), 16))
            }
            return ret;
        }

        if (typeof(data) === "string") data = convert(data);
        if (typeof(key) === "string") key = convert(key);
        this.key = new AESKey(key);
        this.sBox = sBox();
        this.invSBox = invSBox();
        this.blocks = [];
        for(let i = 0; i < data.length; i += 16){
            this.blocks.push(data.slice(i, i + 16));
        }
    }

    /**
     * Encrypts each block of data using ECB.
     */
    encrypt(){
        for(let i = 0; i < this.blocks.length; i++){
            this.blocks[i] = this.addRoundKey(this.blocks[i], 0);
            for(let j = 1; j <= 10; j++) 
                this.blocks[i] = this.applyRound(this.blocks[i], j, j === 10);
        }
    }

    /**
     * Applies a round to a given block.
     * @param block The block to apply a round
     * @param round Round number, necessary for adding round key
     * @param isLast Boolean that gets set to true if this is the last round, where mixColumns does not happen
     * @returns A fully encrypted block
     */
    applyRound(block: number[], round: number, isLast: boolean): number[] {
        block = this.subBytes(block);
        block = this.shiftRows(block);
        if (!isLast) block = this.mixColumns(block);
        return this.addRoundKey(block, round);
    }

    /**
     * Adds a round key to a block
     * @param block Block to apply a round key
     * @param round Round number, necessary for getting the part of the expanded key
     * @returns Block XORed with the part of expanded key
     */
    addRoundKey(block: number[], round: number): number[] {
        const key = this.key.getRoundKey(round);
        for(let i = 0; i < 16; i++) block[i] ^= key[i];
        return block;
    }

    /**
     * Substitutes each byte using the S-box
     * @param block Block to substitute
     * @returns Whole block substituted using S-box
     */
    subBytes(block: number[]){
        for(let i = 0; i < 16; i++)
            block[i] = this.sBox[block[i]];
        return block;
    }

    /**
     * Shift each rows
     * @param block A block to apply shiftRow operation
     * @returns Block with row shifting applies
     */
    shiftRows(block: number[]) {
        return [
            block[0], block[5], block[10], block[15],
            block[4], block[9], block[14], block[3],
            block[8], block[13], block[2], block[7],
            block[12], block[1], block[6], block[11]
        ];
    }

    /**
     * Applies mixColumns operation on a given block
     * @param block Block to apply mixColumns
     * @returns A block with mixColumns applied
     */
    mixColumns(block: number[]){
        const funcs = [
            (a: number, b: number, c: number, d: number) => {
                return [
                    new GF8(a).mul(new GF8(2)),
                    new GF8(b).mul(new GF8(3)),
                    new GF8(c),
                    new GF8(d)
                ].reduce((p, c) => p.add(c)).val;
            },
            (a: number, b: number, c: number, d: number) => {
                return [
                    new GF8(a),
                    new GF8(b).mul(new GF8(2)),
                    new GF8(c).mul(new GF8(3)),
                    new GF8(d)
                ].reduce((p, c) => p.add(c)).val;
            },
            (a: number, b: number, c: number, d: number) => {
                return [
                    new GF8(a),
                    new GF8(b),
                    new GF8(c).mul(new GF8(2)),
                    new GF8(d).mul(new GF8(3))
                ].reduce((p, c) => p.add(c)).val;
            },
            (a: number, b: number, c: number, d: number) => {
                return [
                    new GF8(a).mul(new GF8(3)),
                    new GF8(b),
                    new GF8(c),
                    new GF8(d).mul(new GF8(2))
                ].reduce((p, c) => p.add(c)).val;
            }
        ];
        const newBlock = [];
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                newBlock.push(funcs[j % 4](block[(i * 4)], block[(i * 4) + 1], block[(i * 4) + 2], block[(i * 4) + 3]));
            }
        }
        return newBlock;
    }
}