import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Modal, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Icon, Input } from 'semantic-ui-react';

import {validatePastedCellValue} from '../utils/Utils';

const PasteErrorModal = ({
    open,
    onClose,
    errorRows,
    onSubmit,
    pastedRowsValidator,
}) => {
    const [editedRows, setEditedRows] = useState([...errorRows]);
    
    // Update editedRows when errorRows prop changes
    useEffect(() => {
        // Make a deep copy of the errorRows
        setEditedRows(errorRows.map(row => [...row]));
    }, [errorRows]);
    

    // Calculate validation status
    const getValidationStatus = () => {
        let totalCells = 0;
        let validCells = 0;
        
        editedRows.forEach((row) => {
            row.slice(0, pastedRowsValidator.length).forEach((cell, cellIndex) => {
                const columnType = pastedRowsValidator[cellIndex]?.columnType;
                totalCells++;
                if (validatePastedCellValue(cell, columnType)) {
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
        onSubmit(editedRows);
    }

    const renderErrorCell = (cellValue, rowIndex, cellIndex, columnType) => {
        const isValid = validatePastedCellValue(cellValue, columnType);

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
                                {pastedRowsValidator.map((column, index) => (
                                    <TableHeaderCell key={index}>
                                        {column.columnName}
                                        <br />
                                        <small>({column.columnType === 'String' ? 'Texto' : 'Numérico'})</small>
                                    </TableHeaderCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {editedRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.slice(0, pastedRowsValidator.length).map((cell, cellIndex) => {
                                        const columnType = pastedRowsValidator[cellIndex]?.columnType;
                                        console.log('columnType', columnType);
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
    onSubmit: PropTypes.func.isRequired,
};

export default PasteErrorModal;