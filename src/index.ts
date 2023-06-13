import { AES } from "./AES";

const enc = new AES("0123456789abcdeffedcba9876543210", "0f1571c947d9e8590cb7add6af7f6798");
enc.encrypt()
console.log(enc.blocks[0].map(v => v.toString(16)).join(""));