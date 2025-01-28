Here’s a comprehensive documentation for your project, **`view-layer-type-defs`**, which generates type definitions for **MerriamTables** from JSON configuration files. MerriamTables uses **shadcn tables** and **TanStack Table** under the hood.

---

# View Layer Type Definitions (`view-layer-type-defs`)

## Overview
`view-layer-type-defs` is a utility tool that generates TypeScript type definitions, column definitions, filter fields, and actions for **MerriamTables** based on a JSON configuration schema. MerriamTables is a table component library built on top of **shadcn tables** and **TanStack Table**.

This tool automates the process of creating type-safe definitions for tables, ensuring consistency and reducing manual errors.

---

## Features
- **Type Definitions**: Generates TypeScript interfaces from JSON schemas.
- **Column Definitions**: Creates column definitions for MerriamTables.
- **Filter Fields**: Generates filter field configurations for table filtering.
- **Actions**: Produces action configurations for table row actions.
- **Automation**: Processes multiple JSON schema files and outputs `.ts` files.
- **Index File**: Generates an `index.ts` file to export all generated modules.

---

## Installation
To use `view-layer-type-defs`, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/view-layer-type-defs.git
cd view-layer-type-defs
npm install
```

---

## Usage

### 1. Prepare JSON Schema Files
Create JSON schema files in the `schemas` directory (or any directory specified in `SCHEMA_DIR`). Each file should define the structure of a table, including properties, filter fields, and actions.

#### Example Schema (`user.json`)
```json
{
    "name": "User",
    "properties": {
        "name": {
            "type": "string",
            "show_on_table": true,
            "table_header": "Name",
            "table_type": "string",
            "show_on_mobile": true,
            "is_filter_field": true,
            "filter_field_type": "text"
        },
        "role": {
            "type": "string",
            "show_on_table": true,
            "table_header": "Role",
            "table_type": "badge",
            "show_on_mobile": true,
            "format_fn": "colorMap",
            "format_options": {
                "Admin": "bg-green-500",
                "Moderator": "bg-orange-500"
            },
            "is_filter_field": true,
            "filter_field_type": "select",
            "filter_options": ["Admin", "Moderator"]
        }
    },
    "actions": {
        "view": {
            "label": "View",
            "function": "modal_view_entry"
        },
        "edit": {
            "label": "Edit",
            "function": "modal_edit_entry"
        }
    }
}
```

### 2. Run the Script
Run the script to generate TypeScript files:

```bash
npm start
```

This will:
1. Read all JSON schema files from the `schemas` directory.
2. Generate corresponding `.ts` files in the `output` directory.
3. Create an `index.ts` file to export all generated modules.

---

### 3. Generated Output
For the `user.json` schema, the following files will be generated:

#### `output/user.ts`
```typescript
export interface User {
    name: string;
    role: string;
}

export const UserColumnDef = [
    {header: "Name", accessorKey: "name", type: "string", showOnMobile: true},
    {header: "Role", accessorKey: "role", type: "badge", showOnMobile: true, formatFn: colorMap, formatOptions: {"Admin":"bg-green-500","Moderator":"bg-orange-500"}},
];

export const UserFilterFields: FilterField<User>[] = [
    {key: "name", label: "name", type: "text"},
    {key: "role", label: "role", type: "select", options: ["Admin","Moderator"]},
];

export const UserActions = [
    {label: "View", function: "modal_view_entry"},
    {label: "Edit", function: "modal_edit_entry"},
];
```

#### `output/index.ts`
```typescript
export * from './user';
```

---

## Configuration
You can configure the script using environment variables which can be placed in a .env file:

| Variable               | Description                          | Default Value       |
|------------------------|--------------------------------------|---------------------|
| `SCHEMA_DIR`           | Directory containing JSON schemas    | `./schemas`         |
| `OUTPUT_DIR`           | Directory to save generated `.ts` files | `./output`       |
| `OUTPUT_INDEX_FILEPATH`| Path to the `index.ts` file          | `./output/index.ts` |

Example:
```bash
SCHEMA_DIR=./my-schemas OUTPUT_DIR=./my-output npm run generate
```

---

## Integration with MerriamTables
The generated files can be directly used in **MerriamTables** to define table structures, filters, and actions. For example:

```typescript
"use client";

import React from "react";
import { DynamicDatatable } from "../../components/dynamic-datatable";
import { ColumnDef, FilterField, Action } from "../../types/datatable";
import { Star, ShoppingCart } from "lucide-react";
import "../../index.css";
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 50,
    rating: 4.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    stock: 100,
    rating: 4.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Headphones",
    category: "Audio",
    price: 149.99,
    stock: 200,
    rating: 4.7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Appliances",
    price: 79.99,
    stock: 30,
    rating: 4.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Fitness Tracker",
    category: "Wearables",
    price: 129.99,
    stock: 75,
    rating: 4.3,
    image: "/placeholder.svg?height=40&width=40",
  },
];

const columns: ColumnDef<Product>[] = [
  { header: "Image", accessorKey: "image", type: "image", showOnMobile: true },
  { header: "Name", accessorKey: "name", type: "text", showOnMobile: true },
  {
    header: "Category",
    accessorKey: "category",
    type: "badge",
    showOnMobile: true,
  },
  { header: "Price", accessorKey: "price", type: "money", showOnMobile: true },
  {
    header: "Stock",
    accessorKey: "stock",
    type: "number",
    showOnMobile: false,
  },
  {
    header: "Rating",
    accessorKey: "rating",
    type: "icon",
    formatFn: (value: number) => (
      <div className="flex items-center">
        <Star className="w-5 h-5 text-yellow-400 mr-1" />
        {value.toFixed(1)}
      </div>
    ),
    showOnMobile: true,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    type: "actions",
    showOnMobile: true,
  },
];

const filterFields: FilterField<Product>[] = [
  { key: "name", label: "Name", type: "text" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["Electronics", "Audio", "Appliances", "Wearables"],
  },
  { key: "price", label: "Max Price", type: "number" },
];

const actions: Action<Product>[] = [
  {
    label: "View",
    onClick: (product) => {
      console.log("Viewing product:", product);
      alert(`Viewing ${product.name}`);
    },
  },
  {
    label: "Edit",
    onClick: (product) => {
      console.log("Editing product:", product);
      alert(`Editing ${product.name}`);
    },
  },
];

export default function Example() {
  return (
    <div className="container mx-auto py-10">
      <DynamicDatatable<Product>
        data={products}
        columns={columns}
        filterFields={filterFields}
        actions={actions}
        title="Product Catalog"
      />
    </div>
  );
}
```

---

## Development

### Scripts
- `npm start`: Runs the script to generate type definitions.
- `npm test`: Runs tests (if any).

### Dependencies
- `fs`: Node.js file system module.
- `path`: Node.js path module.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- **MerriamTables**: [GitHub Repository](https://github.com/suwi-lanji/merriamtables)
- **shadcn tables**: [Documentation](https://ui.shadcn.com/docs/components/table)
- **TanStack Table**: [Documentation](https://tanstack.com/table/v8)

---

## Contact
For questions or feedback, please open an issue on the [GitHub repository](https://github.com/suwi-lanji/view-layer-type-defs).

---

This documentation provides a clear overview of the project, its features, and how to use it. Let me know if you need further assistance! 😊