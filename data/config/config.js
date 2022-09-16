import { createRequire } from "module";
import fs from 'fs'
const require = createRequire(import.meta.url);
export const p2p_config = require('./p2p.config.json')

export async function write_p2p_config(object) {
    const new_object = { ...p2p_config, ...object }
    fs.writeFile('./p2p.config.json', JSON.stringify(new_object, null, 4))
}