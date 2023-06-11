import { GF8 } from "./GF8";
import { sBox as genSBox } from "./sBox";

export class AESKey {
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
    }
}