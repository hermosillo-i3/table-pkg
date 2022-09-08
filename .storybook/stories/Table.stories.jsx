import React, {useCallback, useState} from 'react';

import Table from '../../src';
import 'semantic-ui-css/semantic.min.css';

export default {
  title: 'FiveBim/Table',
  component: Table,
  argTypes: {
  },
};

Table.displayName = 'Table';

const Template = (args) => {
    return <Table {...args}/>
};

const SelectTemplate = (args) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const onRowSelect = useCallback((rows) => {
        setSelectedRows(rows)
    }, [setSelectedRows]);
    return <Table {...args} selected_rows={selectedRows} onRowSelect={onRowSelect}/>
};

export const Default = Template.bind({});
Default.args = {
    rows: {
        1: {
            name: 'Jane Doe',
            age: '30',
        }, 
        2: {
            name: 'John Doe',
            age: '25',
        }
    },
    columns: [
        {
            Header: 'Nombre',
            assesor: 'name'
        }, {
            Header: 'Edad',
            assesor: 'age'
        },
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
};

export const NoRowsMessage = Template.bind({});
NoRowsMessage.args = {
    rows: {},
    columns: [
        {
            Header: 'Nombre',
            assesor: 'name'
        }, {
            Header: 'Edad',
            assesor: 'age'
        },
    ],
    noRowsMessage: {
        title: "No hay solicitudes pendientes",
        icon: "folder-open"
     },
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
};

export const OnlyItemsView = Template.bind({});
OnlyItemsView.args = {
    rows: {
        1: {
            name: 'Jane Doe',
            age: '30',
            is_item: true,
        },
        2: {
            name: 'John Doe',
            age: '25',
            is_item: true,
        }
    },
    columns: [
        {
            Header: 'Nombre',
            assesor: 'name'
        }, {
            Header: 'Edad',
            assesor: 'age'
        },
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
};

export const ParentChildrenView = Template.bind({});
ParentChildrenView.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Partida 1',
            amount: 50,
            is_item: false,
            _children: [3],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Partida 2',
            amount: 20,
            is_item: false,
            _children: [5],
        },
        3: {
            id: 3,
            parent_id: 1,
            description: 'Sub Partida 1',
            amount: 50,
            is_item: false,
            _children: [4],
        },
        4: {
            id: 4,
            parent_id: 3,
            description: 'Concepto 1',
            amount: 50,
            is_item: true,
            _children: [],
        },
        5: {
            id: 5,
            parent_id: 2,
            description: 'Concepto 2',
            amount: 20,
            is_item: true,
            _children: [],
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description'
        }, {
            Header: 'Monto',
            assesor: 'amount',
        },
    ]
};

export const FilterAndSelect = SelectTemplate.bind({});
FilterAndSelect.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description',
            filter: true,
            help_info: 'Es posible realizar la busqueda en celdas',
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
    enableSelectAll: true,
};

export const FormattedColumns = Template.bind({});
FormattedColumns.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
            date: new Date('2020-01-02'),
            percentage: 8.20,
            boolean: true,
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
            date: new Date(),
            percentage: 40.5,
            boolean: true,
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 35.25,
            boolean: false,
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 20,
            boolean: true,
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
            date: null,
            percentage: 10,
            boolean: false,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description'
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }, {
            Header: 'Fecha',
            assesor: 'date',
            format: 'date',
            editable: true,
        }, {
            Header: 'Porcentaje',
            assesor: 'percentage',
            format: 'percentage',
        }, {
            Header: 'Progreso',
            assesor: 'percentage',
            format: 'progress-bar',
            editable: true,
        }, {
            Header: 'Boleano',
            assesor: 'boolean',
            format: 'boolean',
        }
    ],
};

export const CustomColumnCell = Template.bind({});
// Cell Custom
CustomColumnCell.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
            numbers: ['301516351', '301516352', '301516353'],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
            numbers: ['946541651', '946541652', '946541653'],
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
            numbers: ['616321030', '616321031', '616321032'],
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
            numbers: ['516516532', '516516533', '516516534'],
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
            numbers: ['648798465', '648798466', '648798467'],
        },
    },
    columns: [
        {
            Header: 'Icono',
            assesor: 'icon',
            Cell: row => row.id % 2 === 0 ? (
                <span
                   className="value"
                   style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    <span style={{color: 'blue'}}>Par</span>
                </span>
             ) : (
                <span
                   className="value"
                   style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                   <span style={{color: 'red'}}>Impar</span>
                </span>
             ) 
        }, {
            Header: 'Descripcion',
            assesor: 'description',
            help_info: 'Es posible realizar la busqueda en celdas',
            filter: true,
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }, {
            Header: 'Telefono',
            assesor: 'numbers',
            format: 'list',
            filter: true,
            help_info: 'Es posible realizar la busqueda en celdas personalizadas como lista',
            Cell: row =>
                <span>
                    <ul>
                        {row.numbers.map((s, index) => <li key={index}>{s}</li>)}
                    </ul>
                </span>
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
}

export const FreezeColumns = Template.bind({});
FreezeColumns.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 8.20,
            payment_amount: 2000,
            payment_date: new Date().setDate(new Date().getDate() - 1),
            advance_amount: 80000,
            advance_date: new Date().setDate(new Date().getDate() - 2),
            final_amount: 82000,
            payment_date_agreed: new Date(),
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
            date: new Date(),
            percentage: 40.5,
            payment_amount: 58000,
            payment_date: new Date().setDate(new Date().getDate() - 1),
            advance_amount: 4200,
            advance_date: new Date().setDate(new Date().getDate() - 2),
            final_amount: 10000,
            payment_date_agreed: new Date(),
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 35.25,
            payment_amount: 700,
            payment_date: new Date().setDate(new Date().getDate() - 1),
            advance_amount: 2300,
            advance_date: new Date().setDate(new Date().getDate() - 2),
            final_amount: 3000,
            payment_date_agreed: new Date(),
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 20,
            payment_amount: 600,
            payment_date: new Date().setDate(new Date().getDate() - 1),
            advance_amount: 1400,
            advance_date: new Date().setDate(new Date().getDate() - 2),
            final_amount: 2000,
            payment_date_agreed: new Date(),
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
            date: new Date(),
            percentage: 10,
            payment_amount: 500,
            payment_date: new Date().setDate(new Date().getDate() - 1),
            advance_amount: 600,
            advance_date: new Date().setDate(new Date().getDate() - 2),
            final_amount: 1100,
            payment_date_agreed: new Date(),
        },
    },
    columns: [
        {
            Header: 'Codigo',
            assesor: 'id',
            freeze: true,
        }, {
            Header: 'Descripcion',
            assesor: 'description',
            freeze: true,
            width: 300,
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
            width: 300,
        }, {
            Header: 'Fecha',
            assesor: 'date',
            format: 'date',
        }, {
            Header: 'Porcentaje',
            assesor: 'percentage',
            format: 'percentage',
        }, {
            Header: 'Progreso',
            assesor: 'percentage',
            format: 'progress-bar',
            editable: true,
            width: 300,
        }, {
            Header: 'Monto Liquidacion',
            assesor: 'payment_amount',
            format: 'currency',
        }, {
            Header: 'Fecha Liquidacion',
            assesor: 'payment_date',
            format: 'date',
        }, {
            Header: 'Monto Anticipo',
            assesor: 'advance_amount',
            format: 'currency',
        }, {
            Header: 'Fecha Anticipo',
            assesor: 'advance_date',
            format: 'date',
        }, {
            Header: 'Monto Final',
            assesor: 'final_amount',
            format: 'currency',
        }, {
            Header: 'Fecha de Pago Acordada',
            assesor: 'payment_date_agreed',
            format: 'date',
        }
    ],
};

export const IgnoreItemStyle = Template.bind({});
IgnoreItemStyle.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Partida 1',
            amount: 50,
            is_item: false,
            _children: [3],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Partida 2',
            amount: 20,
            is_item: false,
            _children: [5],
        },
        3: {
            id: 3,
            parent_id: 1,
            description: 'Sub Partida 1',
            amount: 50,
            is_item: false,
            _children: [4],
        },
        4: {
            id: 4,
            parent_id: 3,
            description: 'Concepto 1',
            amount: 50,
            is_item: true,
            _children: [],
        },
        5: {
            id: 5,
            parent_id: 2,
            description: 'Concepto 2',
            amount: 20,
            is_item: true,
            _children: [],
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description'
        }, {
            Header: 'Monto',
            assesor: 'amount',
        },
    ],
    ignoreItemStyle: true,
};

export const CompressText = Template.bind({});
CompressText.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus elit, ut euismod metus tempus ut. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut id massa velit. Aliquam pulvinar lorem ac tellus accumsan vehicula. Aenean cursus vulputate velit, eu luctus nunc mollis ac. Duis varius leo nec lectus consectetur, non vulputate dolor eleifend. Vivamus semper tortor quam. Praesent eleifend ipsum est, nec vulputate ex laoreet eget.',
            amount: 50,
            is_item: true,
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Pellentesque posuere risus eu aliquet vehicula. Ut urna erat, consequat eget porta id, rhoncus et sapien. Etiam eget placerat mauris. Vestibulum pulvinar dui sed lorem hendrerit bibendum. Praesent sed mattis elit. Integer vulputate egestas ante ac feugiat. Morbi cursus velit lorem, quis suscipit est laoreet vitae. In eu erat a neque rutrum posuere tincidunt mattis magna. Etiam nec ipsum faucibus, accumsan urna at, hendrerit lacus. Curabitur nunc arcu, mattis nec sapien nec, dapibus elementum orci.',
            amount: 20,
            is_item: true,
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Duis sollicitudin magna ac justo pretium fringilla ut vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie malesuada leo, quis tempus nulla consequat eu. Aliquam bibendum lacus sit amet sem gravida, a placerat massa dictum. Aliquam malesuada blandit vestibulum. Fusce sit amet orci augue. Donec vehicula massa ipsum, porttitor lacinia ex ultricies sit amet. Fusce molestie vitae elit at blandit. Etiam porta nunc tellus, quis lobortis nulla venenatis eu. Aliquam viverra ipsum eget ligula viverra egestas. Proin elementum malesuada lacinia.',
            amount: 50,
            is_item: true,
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Duis a sem ut eros fermentum tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis enim ac lacus consectetur, vel tincidunt justo viverra. Morbi luctus auctor orci, ut finibus lacus gravida id. Sed vel nisi lectus. Vestibulum malesuada fringilla vulputate. Nunc molestie ligula eget lacus venenatis gravida. Morbi viverra suscipit erat et interdum.',
            amount: 50,
            is_item: true,
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Pellentesque nec rutrum ipsum. Curabitur tempus convallis consectetur. Sed tincidunt non magna a ornare. Cras dui urna, rutrum a iaculis nec, varius id diam. Etiam posuere fringilla nibh eu fermentum. Sed id elit tristique, luctus mauris quis, ullamcorper ligula. Nullam rutrum purus nunc, non porttitor enim hendrerit posuere.',
            amount: 20,
            is_item: true,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description',
            compressLongText: true,
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
};

// Total case
export const TotalRow = Template.bind({});
TotalRow.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description'
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    totalRow: {
        description: 'Total',
        amount: 190,
    },
};

export const ExpandRows = Template.bind({});
ExpandRows.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Partida 1',
            amount: 50,
            is_item: false,
            _children: [3],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Partida 2',
            amount: 20,
            is_item: false,
            _children: [5],
        },
        3: {
            id: 3,
            parent_id: 1,
            description: 'Sub Partida 1',
            amount: 50,
            is_item: false,
            _children: [4],
        },
        4: {
            id: 4,
            parent_id: 3,
            description: 'Concepto 1',
            amount: 50,
            is_item: true,
            _children: [],
        },
        5: {
            id: 5,
            parent_id: 2,
            description: 'Concepto 2',
            amount: 20,
            is_item: true,
            _children: [],
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description'
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        },
    ],
    expandRows: [1, 2],
};

export const CustomColumnClass = Template.bind({});
CustomColumnClass.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Ventana',
            amount: 50,
            is_item: true,
            date: new Date('2020-01-02'),
            percentage: 8.20,
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
            date: new Date(),
            percentage: 40.5,
        },
        3: {
            id: 3,
            parent_id: null,
            description: 'Cemento',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 35.25,
        },
        4: {
            id: 4,
            parent_id: null,
            description: 'Saco',
            amount: 50,
            is_item: true,
            date: new Date(),
            percentage: 20,
        },
        5: {
            id: 5,
            parent_id: null,
            description: 'Comida',
            amount: 20,
            is_item: true,
            date: null,
            percentage: 10,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description',
            columnClass: 'custom-column-1'
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
            columnClass: (col, row) => {
                if (row.amount > 30) {
                    return 'custom-column-3';
                }

                return 'custom-column-4';
            }
        }, {
            Header: 'Fecha',
            assesor: 'date',
            format: 'date',
            editable: true,
        }, {
            Header: 'Porcentaje',
            assesor: 'percentage',
            format: 'percentage',
            columnClass: 'custom-column-2'
        }
    ],
};