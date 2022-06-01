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
    const onRowSelect = useCallback((rows) => setSelectedRows(rows), [setSelectedRows]);
    return <Table selected_rows={selectedRows} onRowSelect={onRowSelect} {...args}/>
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
            date: new Date(),
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
            date: new Date(),
            percentage: 10,
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
        }, {
            Header: 'Porcentaje',
            assesor: 'percentage',
            format: 'percentage',
        }, {
            Header: 'Progreso',
            assesor: 'percentage',
            format: 'progress-bar',
            editable: true,
        }
    ],
};

export const CustomCell = Template.bind({});
// Cell Custom
CustomCell.args = {
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