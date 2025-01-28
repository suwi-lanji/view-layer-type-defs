import { ColumnDef, FilterField, Action } from '../datatable'

export interface Item {
    name: string;
    role: string;
}

export const ItemColumnDef: ColumnDef<Item>[] = [
    {header: "Name", accessorKey: "name", type: "string", showOnMobile: true},
    {header: "Role", accessorKey: "role", type: "badge", showOnMobile: true, formatFn: color_map, formatOptions: {"Admin":"bg-green-500","Moderator":"bg-orange-500"}},
]

export const ItemFilterFields: FilterField<Item>[] = [
    {key: "name", label: "name", type: "text"},
    {key: "role", label: "role", type: "select", options: ["Admin","Moderator"]},
];

export const ItemActions = [
    {label: "View", function: "modal_view_entry"},
    {label: "Edit", function: "modal_edit_entry"},
];
