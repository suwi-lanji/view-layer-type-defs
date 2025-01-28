const {generateInterface, generateColumnDef} = require('../generator')
const schema = {
    name: "Item",
    properties: {
      name: {
        type: 'string',
        show_on_table: true,
        table_header: 'Name',
        table_type: 'string',
        show_on_mobile: true,
        is_filter_field: true,
        filter_field_type: 'text'
      },
      role: {
        type: 'string',
        show_on_table: true,
        table_header: 'Role',
        table_type: 'badge',
        show_on_mobile: true,
        format_fn: 'color_map',
        format_options: [Object],
        is_filter_field: true,
        filter_field_type: 'select',
        filter_options: [Array]
      }
    },
    actions: {
      view: { label: 'View', function: 'modal_view_entry' },
      edit: { label: 'Edit', function: 'modal_edit_entry' }
    }
  }
test('generates interface', () => {
    const output = generateInterface(schema);
    expect(output).toMatch(`export interface Item {
    name: string;
    role: string;
}`)
})