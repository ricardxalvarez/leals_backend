import { createRequire } from "module";
import fs from 'fs'
const require = createRequire(import.meta.url);
export const p2p_config = require('./p2p.config.json');

export async function write_p2p_config(object) {
    const new_object = { ...p2p_config, ...object }
    fs.writeFile('./p2p.config.json', JSON.stringify(new_object, null, 4))
    return 'new config updated'
};

export async function takeaway_split(quantity) {
    const new_split = p2p_config.split - quantity
    const new_object = { ...p2p_config, split: new_split }
    fs.writeFile('./p2p.config.json', JSON.stringify(new_object, null, 4), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    })
    return 'new split updated'
};