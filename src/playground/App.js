import React, { useCallback, useEffect, useState } from 'react';
import { Table } from '../index';
import generateRows from './utils/generateRows';

const App = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const onRowSelect = useCallback((rows) => setSelectedRows(rows), [setSelectedRows]);
    const [rows, setRows] = useState({});
    const staticRows = generateRows(10, 10, 4);
    const columns = [
        {
            Header: 'Descripcion',
            assesor: 'description'
        },
        {
            Header: 'Monto',
            assesor: 'amount'
        }
    ]

    useEffect(() => {
        setRows(staticRows);
    }, []);


    return (
        <>
            <h1>Table Playground</h1>
            <Table
                actions={[{
                    name: 'Eliminar todo',
                    action: () => {
                        setRows({});
                    },
                    icon: 'trash',
                    position: 'right'
                },
                {
                    name: 'Restaurar',
                    action: () => {
                        setRows(staticRows);
                    },
                    icon: 'undo',
                    position:'right',
                },
                ]}
                columns={columns}
                rows={rows}
                enableSelectAll={true}
                onRowSelect={onRowSelect}
                selected_rows={selectedRows}
            />
        </>
    );
};

export default App;