import React, { useState, useEffect } from "react";
import { recalculateChildrenCodes } from "../utils/Utils";
import { addIsItemToObjectArray, addChildrenToItems, verifyIntegrityOfCode, updateCode, fixCodesAsNumbers } from "../../src/utils/index";

const PasteModal = ({ isOpen, onClose, onConfirm, columns }) => {
    const [rows, setRows] = useState({})
    const [selectedRows, setSelectedRows] = useState([])

    const getLastId = (getCode = false) => {
        const rowsKeys = Object.keys(rows)
        const lastElement = rows[rowsKeys[rowsKeys.length - 1]]
        return !getCode? lastElement.id : lastElement.code
    }
    const agregarPartida = (actualRow, isItem) => {
        const functionObject = {
            name: `${isItem ? 'Agregar concepto' : 'Agregar partida'}`,
            icon: `${isItem ? 'plus' : 'sitemap'}`,
            subIcon: `${isItem ? '' : ' plus'}`,
            action: async () => {
                let newPackage = {}
                if (actualRow) {
                    if(!actualRow.is_item && actualRow._children ==null){
                        actualRow['_children'] = []
                    }
                    const lastChildrenCode = actualRow._children.length > 0 ? rows[actualRow._children[actualRow._children.length - 1]].code : actualRow.code + '.00'
                    const splittedLastCode = lastChildrenCode.toString().split('.')
                    const firstPart = splittedLastCode.slice(0, splittedLastCode.length - 1)
                    const secondPart = Number(splittedLastCode.slice(-1)) + 1
                    const newCode = `${firstPart}.${secondPart < 10 ? '0' + secondPart : secondPart}`
                    newPackage = {
                        is_item: isItem ? true : false,
                        parent_id: selectedRows[0],
                        id: getLastId() + 1,
                        code: newCode
                    }

                } else {
                    newPackage = {
                        is_item: isItem ? true : false,
                        parent_id: null,
                        id: getLastId() + 1,
                        code: `0${Object.keys(rows).length + 1}`
                    }
                }
                if (!isItem || isItem == null) {
                    newPackage['_children'] = []
                }
                const pastChildren = rows[newPackage.parent_id]?._children || []
                const newParentChildren = [...pastChildren, newPackage.id]
                const newPackages = {
                    ...rows,
                    [newPackage.parent_id]: {
                        ...rows[newPackage.parent_id],
                        _children: newParentChildren
                    },
                    [newPackage.id]:
                    {
                        ...newPackage
                    }
                }
                setRows(newPackages)
            }
        }
        return functionObject
    }

    const deleteObject = (actualRow) => {
        const functionObject = {
            name: 'Eliminar',
            icon: 'trash',
            action: async () => {
                const rowsCopy = { ...rows }
                if (rowsCopy[actualRow.parent_id]?._children) {
                    const parentRowChildrens = rowsCopy[actualRow.parent_id]._children
                    const newParentChildrens = parentRowChildrens.filter((childrenId) => childrenId !== actualRow.id)
                    rowsCopy[actualRow.parent_id]._children = newParentChildrens
                }
                const recursiveDelete = (row_id, rows) => {
                    if (rows[row_id]._children?.length > 0) {
                        for (const children_id of rows[row_id]._children) {
                            recursiveDelete(children_id, rows)
                        }
                    }
                    delete rows[row_id]
                }
                recursiveDelete(actualRow.id, rowsCopy)
                const newRows = { ...rowsCopy }
                setRows({
                    ...newRows,
                })
                setSelectedRows([])
            }
        }
        return functionObject
    }

    const getToolbarActions = () => {
        let toolbarActions = []
        if (Object.keys(rows).length > 0) {
            toolbarActions.push({
                name: 'Limpiar celdas',
                icon: 'eraser',
                action: async () => {
                    setRows({})
                    setSelectedRows([])
                }
            })
        }
        if (selectedRows.length > 0) {
            toolbarActions.push({ ...deleteObject(rows[selectedRows[0]]) })
            if (!rows[selectedRows[0]].is_item) {
                const actualRow = rows[selectedRows[0]]
                if (actualRow != null && !actualRow?.is_item) { //Check the children type of the selected element

                    if (actualRow._children?.length > 0) {
                        if (!rows[actualRow._children[0]]?.is_item) {
                            toolbarActions.push({ ...agregarPartida(actualRow) })
                        } else {
                            toolbarActions.push({ ...agregarPartida(actualRow, true) })
                        }
                    } else {
                        toolbarActions.push({ ...agregarPartida(actualRow) })
                        toolbarActions.push({ ...agregarPartida(actualRow, true) })
                    }
                } else {
                    toolbarActions.push({
                        name: 'Agregar paquete',
                        icon: 'plus',
                        action: async () => {
                        }
                    })
                }
            }
        }
        return toolbarActions
    }

    const onPasteRows = (selected_rows, newRows) => {
        if (selectedRows.length <= 0) {
            const lastElement = Object.keys(rows).length > 0 ? rows[Object.keys(rows).pop()] : null
            const lastIndex = (lastElement ? lastElement.id : 0) + 1

            const correctCodeRows = fixCodesAsNumbers(newRows, true)
            const orderedRows = correctCodeRows.sort()

            const rowsArray = orderedRows.map((row, index) => {
                return { code: row[0], description: row[1], id: index + lastIndex, is_item: false }
            })
            const isOk = verifyIntegrityOfCode(rowsArray, 0, rowsArray.length - 1, null, null)
            if (isOk) {
                const objectOfRows = rowsArray.reduce((acc, row) => {
                    acc[row.id] = { ...row }
                    return acc
                }, {})

                let rowsWithChildren = addChildrenToItems(objectOfRows)
                const finalArray = Object.keys(rowsWithChildren).map((key) => rowsWithChildren[key])
                const finalRows = addIsItemToObjectArray(finalArray)
                let finalObjectRows = finalRows.reduce((acc, row) => {
                    acc[row.id] = { ...row }
                    return acc
                }, {})
                if (Object.keys(rows).length > 0) {
                    const arrayIds = Object.keys(rows);
                    const onlyHeaders = arrayIds.filter(id => (!rows[id].is_item && rows[id].parent_id == null));
                    const lastItem = rows[onlyHeaders[onlyHeaders.length - 1]];
                    finalObjectRows = updateCode(finalObjectRows, lastItem.code)
                }
                setRows({ ...rows, ...finalObjectRows })
            }
        } else {
            if (selectedRows.length > 0) {
                const rowId = selectedRows[0];
                let item_selected = rows[rowId];
                const newPackages = [];
                for (let i = 0; i < newRows.length; i++) {
                    const row = newRows[i];
                    const defaultValues = {
                        is_item: 1,
                        parent_id: rowId,
                        id: rowId + i + 1,
                        code: `${item_selected.code}.0${i + 1}`
                    };
                    if (row.length > 0) {
                        defaultValues.description = row[0];
                    }
                    // if (row.length > 1) {
                    //     defaultValues.onsite_date = cdate(row[1]).format('YYYY-MM-DD');
                    // }
                    if (row.length > 2) {
                        defaultValues.deliver_time = row[2];
                    }
                    newPackages.push(defaultValues)
                }
                for (const packageModel of newPackages) {
                    setRows({
                        ...rows,
                        [packageModel.id]: packageModel
                    })
                }
            }
        }
    }

    const onItemRowSelected = (selectedRow) => {
        const newSelectedRows = [...selectedRow]
        setSelectedRows(newSelectedRows)
    }

    const onItemRowUpdate = (column, row, value) => {
        if (column.assesor === "code") {
            try {
                const new_entities = recalculateChildrenCodes(row, value, rows)
                setRows({
                    ...rows,
                    ...new_entities
                })
            } catch (error) {
                this.props.showMessage('ERROR', error.message)
            }
        } else if (column.assesor?.includes('date') || column.format === 'date') {
            let formattedValue = value?.trim()?.length > 0 ? value : null

            setRows({
                ...rows,
                [row.id]: {
                    ...row,
                    [column.assesor]: formattedValue,
                }
            })
        } else {
            setRows({
                ...rows,
                [row.id]: {
                    ...row,
                    [column.assesor]: value,
                }
            })
        }
    };

    return (<div></div>)
}

export default PasteModal;