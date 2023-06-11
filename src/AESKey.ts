import { GF8 } from "./GF8";
import { sBox as genSBox } from "./sBox";

export class AESKey {
    key: number[];
    /**
     * Derives key from key material
     * @param keyData Key material, each number represent a byte
     */
    constructor(keyData: number[]){
        const sBox = genSBox();
        const key: number[] = [...keyData];
        let rcon = new GF8(1);
        // 16 byte key data implies the use of AES-128
        if(keyData.length === 16){
            // This loop runs for every words
            for(let i = 4; i < 44; i++) {
                const temp = key.slice((i - 1) * 4, i * 4);
                if (i % 4 === 0) {
                    // Circular left shift
                    const firstByte = temp.shift();
                    temp.push(firstByte!);

                    // S-box substitution
                    for(let k = 0; k < 4; k++) temp[k] = sBox[temp[k]];

                    // XOR with round constant
                    temp[0] = temp[0] ^ rcon.val;

                    // Updating round constant
                    rcon = rcon.mul(new GF8(2));
                }
                for(let j = 0; j < 4; j++) key.push(temp[j] ^ key[(i - 4) * 4 + j]);
            } 
        } else throw new Error("Not implemented");
        this.key = key;
    }

    getRoundKey(roundCount: number) {
        return this.key.slice(roundCount * 16, (roundCount + 1) * 16);
    }

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
                newBlock.push(funcs[i](block[j], block[j + 4], block[j + 8], block[j + 12]));
            }
    
        }
        return newBlock;
    }
}