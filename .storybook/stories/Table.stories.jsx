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

const ColorsTemplate = (args) => {
    return <div>
        <div className="footer" style={{ backgroundColor: '#dde8f8', color: '#5298fe', padding: '10px', width: '100%', display: 'flex', alignItems: 'center' }}>
    <span style={{ marginRight: '10px' }}>ℹ️</span>
    Para utilizar alguno de los colores de la tabla, es necesario utilizar la función customRowClass. Esto permite, dependiendo del valor del row, asignarle uno de los colores que se muestran en la descripción.
</div>
        <Table {...args}/>
    </div>
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

export const OrderCode = Template.bind({});
OrderCode.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            code: '03',
            description: 'Ventana',
            amount: 50,
            is_item: true,
        },
        2: {
            id: 2,
            code: '05',
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
        },
        3: {
            id: 3,
            parent_id: null,
            code: '02',
            description: 'Cemento',
            amount: 50,
            is_item: true,
        },
        4: {
            id: 4,
            parent_id: null,
            code: '04',
            description: 'Saco',
            amount: 50,
            is_item: true,
        },
        5: {
            id: 5,
            parent_id: null,
            code: '01',
            description: 'Comida',
            amount: 20,
            is_item: true,
        },
    },
    columns: [{
            Header: 'Código',
            assesor: 'code',
            help_info: 'Las filas se ordenan por este campo',
        }, {
            Header: 'Descripcion',
            assesor: 'description',
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
    orderByCode: true,
};

export const OrderAlphanumericCode = Template.bind({});
OrderAlphanumericCode.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            code: 'CO-03',
            description: 'Ventana',
            amount: 50,
            is_item: true,
        },
        2: {
            id: 2,
            code: 'CO-05',
            parent_id: null,
            description: 'Ladrillo',
            amount: 20,
            is_item: true,
        },
        3: {
            id: 3,
            parent_id: null,
            code: 'CO-02',
            description: 'Cemento',
            amount: 50,
            is_item: true,
        },
        4: {
            id: 4,
            parent_id: null,
            code: 'CO-04',
            description: 'Saco',
            amount: 50,
            is_item: true,
        },
        5: {
            id: 5,
            parent_id: null,
            code: 'CO-01',
            description: 'Comida',
            amount: 20,
            is_item: true,
        },
    },
    columns: [{
            Header: 'Código',
            assesor: 'code',
            help_info: 'Las filas se ordenan por este campo',
        }, {
            Header: 'Descripcion',
            assesor: 'description',
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
    orderByAlphanumericCode: true,
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

export const SelectIcon = SelectTemplate.bind({});
SelectIcon.args = {
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
            help_info: 'Es posible realizar la busqueda en celdas',
        }, {
            Header: 'Monto',
            assesor: 'amount',
            format: 'currency',
        }
    ],
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
    shouldShowSelectIcon: true,
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

export const RowColors = ColorsTemplate.bind({});
RowColors.args = {
    rows: {
        1: {
            id: 1,
            description: 'Table-Row-Close-Alt',
            is_item: true,
            is_close_alt: true,
        },
        2: {
            id: 2,
            description: 'Table-Row-Close',
            is_item: true,
            is_close: true,
        },
        3: {
            id: 3,
            description: 'Table-Row-Approved',
            is_item: true,
            is_current_modified_child: true,
        },
        4: {
            id: 4,
            description: 'Table-Row-Approved-Dark',
            is_item: true,
            is_current_modified_parent: true,
        },
        5: {
            id: 5,
            description: 'Table-Row-Info',
            is_item: true,
            is_lib: true,
        },
        6: {
            id: 6,
            description: 'Table-Row-Warning',
            is_item: true,
            is_warning: true,
        },
        7: {
            id: 7,
            description: 'Table-Row-Error-Light',
            is_item: true,
            is_previous_modified_parent: true,
        },
        8: {
            id: 8,
            parent_id: null,
            description: 'Table-Row-Error',
            amount: 50,
            is_item: true,
            is_previous_modified_child: true,
        },
    },
    columns: [
        {
            Header: 'Descripcion',
            assesor: 'description',
        }, 
    ],
    customRowClass:(row) => { 
        return (row.is_close) ? 'Table-Row-Close' :
        (row.is_warning) ? 'Table-Row-Warning' :
        (row.is_previous_modified_parent) ? 'Table-Row-Error-Light' :
        (row.is_previous_modified_child) ? 'Table-Row-Error' :
        (row.is_current_modified_parent) ? 'Table-Row-Approved-Dark' :
        (row.is_current_modified_child) ? 'Table-Row-Approved' :
        (row.is_lib) ? 'Table-Row-Info' :
        (row.is_close_alt) ? 'Table-Row-Close-Alt' : ''
    },
    isExpandRowsButtonActive: false,
    isCollapseRowsButtonActive: false,
};

export const NonEditable = Template.bind({});
NonEditable.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Partida 1',
            amount: 50,
            tax: 12,
            is_item: false,
            _children: [3,4],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Partida 2',
            amount: 20,
            tax: 0.16,
            is_item: false,
            _children: [5],
        },
        3: {
            id: 3,
            parent_id: 1,
            description: 'Sub Partida 1',
            amount: 50,
            tax: 12,
            is_item: false,
            _children: [6],
        },
        4: {
            id: 4,
            parent_id: 4,
            description: 'Concepto 1',
            amount: 50,
            tax: 12,
            is_item: true,
            _children: [],
        },
        5: {
            id: 5,
            parent_id: 2,
            description: 'Concepto 2',
            amount: 20,
            tax: 12,
            is_item: true,
            _children: [],
        },
        6: {
            id: 6,
            parent_id: 3,
            description: 'Sub Partida 2',
            amount: 30,
            tax: 10,
            is_item: false,
            _children: [7],
        },
        7: {
            id: 7,
            parent_id: 6,
            description: 'Sub Partida 3',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [8],
        },
        8: {
            id: 8,
            parent_id: 7,
            description: 'Sub Partida 4',
            amount: 30,
            tax: 10,
            is_item: false,
            _children: [9],
        },
        9: {
            id: 9,
            parent_id: 8,
            description: 'Sub Partida 5',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [10],
        },
        10: {
            id:10,
            parent_id: 9,
            description: 'Sub Partida 6',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [11],
        },
        11: {
            id:11,
            parent_id: 10,
            description: 'Sub Partida 7',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [12],
        },
        12: {
            id:12,
            parent_id: 11,
            description: 'Sub Partida 8',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [13],
        },
        13: {
            id:13,
            parent_id: 12,
            description: 'Concepto 3',
            amount: 40,
            tax: 8,
            is_item: true,
            _children: [],
        },
        13: {
            id:13,
            parent_id: 12,
            description: 'Concepto 3',
            amount: 40,
            tax: 8,
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
            columnClass: 'custom-column-non-editable'
        },{
            Header: 'Impuesto',
            assesor: 'tax',
            format: 'percentage',
        }
    ],
    expandRows: [1, 2],
};

export const DisableRow = Template.bind({});
DisableRow.args = {
    rows: {
        1: {
            id: 1,
            parent_id: null,
            description: 'Partida 1',
            amount: 50,
            tax: 12,
            is_item: false,
            _children: [3,4],
        },
        2: {
            id: 2,
            parent_id: null,
            description: 'Partida 2',
            amount: 20,
            tax: 0.16,
            is_item: false,
            _children: [5],
        },
        3: {
            id: 3,
            parent_id: 1,
            description: 'Sub Partida 1',
            amount: 50,
            tax: 12,
            is_item: false,
            _children: [6],
        },
        4: {
            id: 4,
            parent_id: 4,
            description: 'Concepto 1',
            amount: 50,
            tax: 12,
            is_item: true,
            _children: [],
        },
        5: {
            id: 5,
            parent_id: 2,
            description: 'Concepto 2',
            amount: 20,
            tax: 12,
            is_item: true,
            _children: [],
        },
        6: {
            id: 6,
            parent_id: 3,
            description: 'Sub Partida 2',
            amount: 30,
            tax: 10,
            is_item: false,
            _children: [7],
        },
        7: {
            id: 7,
            parent_id: 6,
            description: 'Sub Partida 3',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [8],
        },
        8: {
            id: 8,
            parent_id: 7,
            description: 'Sub Partida 4',
            amount: 30,
            tax: 10,
            is_item: false,
            _children: [9],
        },
        9: {
            id: 9,
            parent_id: 8,
            description: 'Sub Partida 5',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [10],
        },
        10: {
            id:10,
            parent_id: 9,
            description: 'Sub Partida 6',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [11],
        },
        11: {
            id:11,
            parent_id: 10,
            description: 'Sub Partida 7',
            amount: 40,
            tax: 8,
            // customRowClass: 'Table-Row-Disabled',
            is_item: false,
            _children: [12],
        },
        12: {
            id:12,
            parent_id: 11,
            description: 'Sub Partida 8',
            amount: 40,
            tax: 8,
            is_item: false,
            _children: [13],
        },
        13: {
            id:13,
            parent_id: 12,
            description: 'Concepto 3',
            amount: 40,
            tax: 8,
            // customRowClass: 'Table-Row-Disabled',
            is_item: true,
            _children: [],
        },
        13: {
            id:13,
            parent_id: 12,
            description: 'Concepto 3',
            amount: 40,
            tax: 8,
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
        },{
            Header: 'Impuesto',
            assesor: 'tax',
            format: 'percentage',
        }
    ],
    customRowClass: (row) => {
        return 'Table-Row-Disabled';
    },
    expandRows: [1, 2],
};