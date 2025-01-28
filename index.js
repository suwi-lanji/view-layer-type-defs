const fs = require("fs");
const path = require("path");
const { generateColumnDef, generateInterface, generateFilterFields, generateActions } = require("./generator");

const SCHEMA_DIR = path.join(__dirname, process.env.SCHEMA_DIR || "schemas"); // Default to 'schemas' if not provided
const OUTPUT_DIR = path.join(__dirname, process.env.OUTPUT_DIR || "output"); // Default to 'output' if not provided
const OUTPUT_INDEX_FILEPATH = path.join(__dirname, process.env.OUTPUT_INDEX_FILEPATH || "output/index.ts"); // Default to 'output/index.ts' if not provided

try {
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read all files in the schema directory
    const files = fs.readdirSync(SCHEMA_DIR);

    // Array to store export statements for the index file
    const exportStatements = [];

    for (const file of files) {
        // Skip non-JSON files
        if (!file.endsWith(".json")) continue;

        // Read and parse the schema file
        const fileContent = fs.readFileSync(path.join(SCHEMA_DIR, file), "utf-8");
        const schema = JSON.parse(fileContent);

        // Generate the outputs
        const interfaceOutput = generateInterface(schema);
        const columnDefOutput = generateColumnDef(schema);
        const filterFieldsOutput = generateFilterFields(schema);
        const actionsOutput = generateActions(schema);

        // Combine all outputs into a single string
        const combinedOutput = `import { ColumnDef, FilterField, Action } from '../datatable'

${interfaceOutput}

${columnDefOutput}

${filterFieldsOutput}

${actionsOutput}
`;

        // Save the combined output to a .ts file
        const outputFilename = path.basename(file, ".json") + ".ts"; // Replace .json with .ts
        const outputFilePath = path.join(OUTPUT_DIR, outputFilename);
        fs.writeFileSync(outputFilePath, combinedOutput, "utf-8");

        console.log(`Generated ${outputFilePath}`);

        // Add export statement for the index file
        exportStatements.push(`export * from './${path.basename(outputFilename, ".ts")}';`);
    }

    // Generate and save the index file
    if (exportStatements.length > 0) {
        const indexFileContent = exportStatements.join("\n");
        fs.writeFileSync(OUTPUT_INDEX_FILEPATH, indexFileContent, "utf-8");
        console.log(`Generated ${OUTPUT_INDEX_FILEPATH}`);
    }
} catch (err) {
    console.error("Error: ", err);
    process.exit(1);
}