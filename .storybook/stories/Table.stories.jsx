import React, {useCallback, useState} from 'react';

import Table from '../../src';
import 'semantic-ui-css/semantic.min.css';

export default {
  title: 'Example/Table',
  component: Table,
};

Table.displayName = 'Table';
const Template = (args) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const onRowSelect = useCallback((rows) => setSelectedRows(rows), [setSelectedRows]);
    return <Table selected_rows={selectedRows} onRowSelect={onRowSelect} {...args} />
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
    ]
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
     }
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
};

export const ParentChildrenView = Template.bind({});
ParentChildrenView.args = {
    title: 'Tabla',
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

export const FormattedColumns = Template.bind({});
FormattedColumns.args = {
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
};

export const Interactive = Template.bind({});
Interactive.args = {
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
};