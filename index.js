const fs = require("fs")
const path = require('path')
const {generateColumnDef, generateInterface} = require('./generator')
const SCHEMA_DIR = path.join(__dirname, process.env.SCHEMA_DIR)
const OUTPUT_DIR =  path.join(__dirname, process.env.OUTPUT_DIR)
const OUTPUT_INDEX_FILEPATH = path.join(__dirname, process.env.OUTPUT_INDEX_FILEPATH)
try {
    if(!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, {recursive: true})
    }

    const files = fs.readdirSync(SCHEMA_DIR)
    for(const file of files) {
        const fileContent = fs.readFileSync(path.join(SCHEMA_DIR, file))
        const schema = JSON.parse(fileContent)
        console.log(generateInterface(schema))
        console.log(generateColumnDef(schema))
    }
} catch(err) {
    console.error('Error: ', err)
    process.exit(1)
}