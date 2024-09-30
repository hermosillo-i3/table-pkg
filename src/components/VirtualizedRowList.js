import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo
} from 'react';
import {
    AutoSizer,
    Grid,
    CellMeasurer,
    CellMeasurerCache
} from 'react-virtualized';

const VirtualizedRowList = ({
    getColumnsAll,
    isDragColumnVisible,
    initGenerateRows,
    updateParentTable,
    updateParentHeaderScroll,
}) => {
    const gridRef = useRef(null);
    const [scrollVerticalPosition, setScrollVerticalPosition] = useState(0);
    const [scrollHorizontalPosition, setScrollHorizontalPosition] = useState(0);

    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 22,
    });

    useEffect(() => {
        updateParentTable();
    }, []);

    const cellRenderer = ({ columnIndex, key, rowIndex, style, parent }) => {
        const rowData = initGenerateRows(style)[rowIndex];
        return (
            <CellMeasurer
                key={key}
                cache={cache}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                parent={parent}
            >
                {rowData}
            </CellMeasurer>
        );
    };

    const overscanIndicesGetter = ({ cellCount, overscanCellsCount, startIndex, stopIndex }) => {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
        };
    };

    const getTotalWidth = () => {
        const columns = getColumnsAll();
        let totalWidth = columns.reduce((acc, { width = 0 }) => acc + width, 0);
    
        if (isDragColumnVisible) {
            totalWidth += 25;
        }
        return totalWidth;
    };
    
    const totalWidth = getTotalWidth();

    const handleScroll = useCallback(({ scrollTop, scrollLeft }) => {
        if (scrollVerticalPosition !== scrollTop) {
            updateParentTable();
            setScrollVerticalPosition(scrollTop);
        }

        if (scrollHorizontalPosition !== scrollLeft) {
            updateParentHeaderScroll(scrollLeft);
            setScrollHorizontalPosition(scrollLeft);
            if (gridRef.current) {
                gridRef.current.scrollToPosition({ scrollTop, scrollLeft });
            }
        }
    }, [scrollVerticalPosition, scrollHorizontalPosition]);

    return (
        <AutoSizer>
            {({ height, width }) => {
                return (
                    <Grid
                        ref={gridRef}
                        width={totalWidth}
                        height={height}
                        columnWidth={totalWidth}
                        rowHeight={cache.rowHeight}
                        columnCount={1}
                        rowCount={initGenerateRows().length}
                        cellRenderer={cellRenderer}
                        overscanRowCount={30}
                        overscanIndicesGetter={overscanIndicesGetter}
                        onScroll={handleScroll}
                        deferredMeasurementCache={cache}
                    />
                );
            }}
        </AutoSizer>
    );
};

export default VirtualizedRowList;


// TODO: Fix a los siguientes bugs
// ⚠️ Los Rows tardan varios segundos en cargar 
// ✔️ Los Rows con alturas mayores a 22px no se renderizan correctamente
// ✔️ Los bordes no se muestran
// ✔️ Las columnas con state de freezee no se renderizan correctamente al hacer scroll
// ✔️ La barra de scroll parpadea (y hay dobles)
// 🔴 El scroll vertical de la tabla está hasta lado derecho de la tabla (se tiene que hacer scroll hacia la derecha para verlo)
// 🔴 Algunos cells tienen un scrollbar
// 🟠 Tabla de usuarios, expandir y reducir todos los rows deja un espacio blanco abajo de CDMX
// 🟢 Una vez se dibuja la tabla, el ancho ya no puede cambiar
