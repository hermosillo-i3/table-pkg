import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Modal, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Icon, Input } from 'semantic-ui-react';

const PasteErrorModal = ({
    open,
    onClose,
    errorRows,
    onApplyCorrections,
}) => {
    const [editedRows, setEditedRows] = useState([...errorRows]);
    
    // Update editedRows when errorRows prop changes
    useEffect(() => {
        // Make a deep copy of the errorRows
        setEditedRows(errorRows.map(row => [...row]));
    }, [errorRows]);
    
    const columnNames = [
        {name: 'Descripción', value: 'String'},
        {name: 'Unidad', value: 'String'},
        {name: 'Cantidad', value: 'Number'},
        {name: 'Precio Unitario MXN', value: 'Number'},
        {name: 'Precio Unitario USD', value: 'Number'},
    ];

    // Function to validate if a cell value matches its expected type
    const isCellValid = (cellValue, expectedType) => {
        const value = cellValue != null ? cellValue.toString().trim() : '';
        
        if (value === '') return true;
        
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
        
        return true;
    };

    /*
    Check if the last column (Precio Unitario USD) has any data
        if not, don't show it */
    const hasDataInLastColumn = editedRows.some(row => {
        const lastCell = row[4];
        return lastCell != null && lastCell.toString().trim() !== '';
    });

    // Filter columns to show based on whether last column has data
    const columnsToShow = hasDataInLastColumn ? columnNames : columnNames.slice(0, -1);

    // Calculate validation status
    const getValidationStatus = () => {
        let totalCells = 0;
        let validCells = 0;
        
        editedRows.forEach((row) => {
            row.slice(0, columnsToShow.length).forEach((cell, cellIndex) => {
                const columnType = columnsToShow[cellIndex]?.value;
                totalCells++;
                if (isCellValid(cell, columnType)) {
                    validCells++;
                }
            });
        });
        
        return { totalCells, validCells, errorCells: totalCells - validCells };
    };

    const { totalCells, validCells, errorCells } = getValidationStatus();

    const handleCellChange = (rowIndex, cellIndex, newValue) => {
        const newEditedRows = [...editedRows];
        newEditedRows[rowIndex][cellIndex] = newValue;
        setEditedRows(newEditedRows);
    };

    const handleApplyCorrections = () => {
        onApplyCorrections(editedRows);
    }

    const renderErrorCell = (cellValue, rowIndex, cellIndex, columnType) => {
        const isValid = isCellValid(cellValue, columnType);

        return (
            <TableCell key={cellIndex} error={!isValid}>
                <div style={{ position: 'relative' }}>
                    <Input
                        value={cellValue || ''}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        error={!isValid}
                        size="small"
                        fluid
                    />
                    {!isValid && (
                        <Icon 
                            name="attention" 
                            color="red"
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                            }}
                        />
                    )}
                </div>
            </TableCell>
        );
    }

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
                <p>
                    <strong>Estado de validación:</strong> {validCells} de {totalCells} celdas válidas
                    {errorCells > 0 && (
                        <span style={{ color: 'red' }}> ({errorCells} errores restantes)</span>
                    )}
                    {errorCells === 0 && (
                        <span style={{ color: 'green' }}> (✓ Todos los errores corregidos)</span>
                    )}
                </p>

                {editedRows.length > 0 && (
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
                            {editedRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.slice(0, columnsToShow.length).map((cell, cellIndex) => {
                                        const columnType = columnsToShow[cellIndex]?.value;
                                        
                                        return renderErrorCell(cell, rowIndex, cellIndex, columnType);
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button 
                    color={errorCells > 0 ? "blue" : "green"}
                    onClick={handleApplyCorrections}
                    disabled={errorCells > 0}
                >
                    <Icon name="checkmark" />
                    {errorCells > 0 ? "Aplicar correcciones" : "Pegar datos corregidos"}
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

PasteErrorModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    errorRows: PropTypes.array.isRequired,
    onApplyCorrections: PropTypes.func.isRequired,
};

export default PasteErrorModal;