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

module.exports = {
    generateInterface,
    generateColumnDef
}