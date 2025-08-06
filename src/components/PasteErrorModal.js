import React from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Modal, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Icon } from 'semantic-ui-react';

const PasteErrorModal = ({
    open,
    onClose,
    errorRows,
}) => {
    const columnNames = [
        {name: 'Descripción', value: 'String'},
        {name: 'Unidad', value: 'String'},
        {name: 'Cantidad', value: 'Number'},
        {name: 'Precio Unitario MXN', value: 'Number'},
        {name: 'Precio Unitario USD', value: 'Number'},
    ];

    // Check if the last column (Precio Unitario USD) has any data
    const hasDataInLastColumn = errorRows.some(row => {
        const lastCell = row[4]; // Index 4 is the last column
        return lastCell != null && lastCell.toString().trim() !== '';
    });

    // Filter columns to show based on whether last column has data
    const columnsToShow = hasDataInLastColumn ? columnNames : columnNames.slice(0, -1);

    // Function to validate if a cell value matches its expected type
    const isCellValid = (cellValue, expectedType) => {
        const value = cellValue != null ? cellValue.toString().trim() : '';
        
        if (value === '') return true; // Empty values are considered valid
        
        if (expectedType === 'Number') {
            // Check if the cell contains a valid number (remove commas and currency symbols first)
            const cleanedValue = value.replace(/[$,]/g, '');
            return !isNaN(cleanedValue) && !isNaN(parseFloat(cleanedValue));
        } else if (expectedType === 'String') {
            // For strings, check that it's not empty and not just a number
            const cleanedValue = value.replace(/[$,]/g, '');
            const isJustANumber = !isNaN(cleanedValue) && !isNaN(parseFloat(cleanedValue)) && cleanedValue.trim() !== '';
            return value.length > 0 && !isJustANumber;
        }
        
        return true; // Default to true for unknown types
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="small"
        >
            <Header
                icon="exclamation triangle"
                content="Error al pegar los renglones"
            />
            <Modal.Content>
                <p>
                    Se encontraron errores en los datos pegados.
                    Por favor, verifique el formato y orden de los datos copiados.
                </p>

                {errorRows.length > 0 && (
                    <Table celled compact size="small">
                        <TableHeader>
                            <TableRow>
                                {columnsToShow.map((column, index) => (
                                    <TableHeaderCell key={index}>
                                        {column.name}
                                        <br />
                                        <small>({column.value === 'String' ? 'Texto' : 'Numérico'})</small>
                                    </TableHeaderCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {errorRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.slice(0, columnsToShow.length).map((cell, cellIndex) => {
                                        const columnType = columnsToShow[cellIndex]?.value;
                                        const isValid = isCellValid(cell, columnType);
                                        
                                        return (
                                            <TableCell key={cellIndex} error={!isValid}>
                                                {!isValid && <Icon name="attention" />}
                                                {cell || ''}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button color="blue" onClick={() => onClose()}>
                    Cerrar
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

PasteErrorModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    errorRows: PropTypes.array.isRequired,
};

export default PasteErrorModal;