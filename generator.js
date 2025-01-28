function generateInterface(schema) {
    const properties = schema.properties;
    let interfaceString = `export interface ${schema.name} {\n`;

    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            const type = properties[key].type; // Get the type from the schema
            interfaceString += `    ${key}: ${type};\n`; // Add the key and type to the interface
        }
    }

    interfaceString += "}";
    return interfaceString;
}

function generateColumnDef(schema) {
    const properties = schema.properties;
    let columnDefString = `export const ${schema.name}ColumnDef: ColumnDef<${schema.name}>[] = [\n`;

    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            const property = properties[key];
            let columnDef = `    {header: "${property.table_header}", accessorKey: "${key}", type: "${property.table_type}", showOnMobile: ${property.show_on_mobile}`;

            // Add formatFn if it exists
            if (property.format_fn) {
                columnDef += `, formatFn: ${property.format_fn}`;
            }

            // Add formatOptions if it exists
            if (property.format_options) {
                columnDef += `, formatOptions: ${JSON.stringify(property.format_options)}`;
            }

            columnDef += `},\n`;
            columnDefString += columnDef;
        }
    }

    columnDefString += "]";
    return columnDefString;
}

function generateFilterFields(schema) {
    const properties = schema.properties;
    let filterFieldsDef = `export const ${schema.name}FilterFields: FilterField<${schema.name}>[] = [\n`;

    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            const property = properties[key];
            if (property.is_filter_field) {
                if (property.filter_field_type === "select") {
                    filterFieldsDef += `    {key: "${key}", label: "${key}", type: "${property.filter_field_type}", options: ${JSON.stringify(property.filter_options)}},\n`;
                } else {
                    filterFieldsDef += `    {key: "${key}", label: "${key}", type: "${property.filter_field_type}"},\n`;
                }
            }
        }
    }

    filterFieldsDef += "];";
    return filterFieldsDef;
}

function generateActions(schema) {
    const actions = schema.actions;
    let actionsDef = `export const ${schema.name}Actions = [\n`;

    for (const key in actions) {
        if (actions.hasOwnProperty(key)) {
            const action = actions[key];
            actionsDef += `    {label: "${action.label}", function: "${action.function}"},\n`;
        }
    }

    actionsDef += "];";
    return actionsDef;
}

function generateIndexFile() {
    try {
      const files = fs.readdirSync(OUTPUT_DIR);
  
      // Filter out non-TypeScript files and the index.ts file itself
      const tsFiles = files.filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
      // Generate export statements
      const exportStatements = tsFiles.map(file => {
        const moduleName = path.basename(file, '.ts');
        return `export * from './${moduleName}';`;
      });
  
      // Write the export statements to index.ts
      fs.writeFileSync(OUTPUT_INDEX_PATH, exportStatements.join('\n'), 'utf8');
      console.log(`Generated ${OUTPUT_INDEX_PATH}`);
    } catch (err) {
      console.error('Error generating index file:', err);
      process.exit(1);
    }
  }

module.exports = {
    generateInterface,
    generateColumnDef,
    generateFilterFields,
    generateActions,
    generateIndexFile
}