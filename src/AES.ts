import { AESKey } from "./AESKey";
import { GF8 } from "./GF8";
import { invSBox, sBox } from "./sBox";

class AES {
    key: AESKey;
    blocks: number[][];
    sBox: number[];
    invSBox: number[];
    constructor(data: number[], key: []){
        this.key = new AESKey(key);
        this.sBox = sBox();
        this.invSBox = invSBox();
        this.blocks = [];
        for(let i = 0; i < data.length; i += 16){
            this.blocks.push(data.slice(i, i + 16));
        }
    }

    encrypt(){
        for(let i = 0; i < this.blocks.length; i++){
            this.blocks[i] = this.addRoundKey(this.blocks[i], 0);
            for(let i = 1; i <= 10; i++) this.blocks[i] = this.applyRound(this.blocks[i], i);
        }
    }

    applyRound(block: number[], round: number): number[] {
        return this.addRoundKey(this.mixColumns(this.shiftRows(this.subBytes(block))), round);
    }

    addRoundKey(block: number[], round: number): number[] {
        const key = this.key.getRoundKey(round);
        for(let i = 0; i < 16; i++) block[i] ^= key[i];
        return block;
    }

    subBytes(block: number[]){
        for(let i = 0; i < 16; i++) block[i] = this.sBox[block[i]];
        return block;
    }

    shiftRows(block: number[]) {
        return [
            block[0], block[1], block[2], block[3],
            block[5], block[6], block[7], block[4],
            block[10], block[11], block[8], block[9],
            block[15], block[12], block[13], block[14]
        ];
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
        block.forEach((v, i) => funcs[i % 4](block[i], block[i + 4], block[i + 8], block[i + 12]));
        return block;
    }
}