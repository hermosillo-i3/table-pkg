/**
 * Generates a hierarchical structure of rows with partidas, subpartidas, and conceptos.
 *
 * @param {number} partidas - The number of partidas to generate.
 * @param {number} subpartidas - The number of subpartidas for each partida.
 * @param {number} conceptos - The number of conceptos for each subpartida.
 * @returns {Object} An object containing the generated rows.
 */
const generateRows = (partidas, subpartidas, conceptos) => {
    const rows = {};
    let idCounter = 1;

    for (let i = 1; i <= partidas; i++) {
        const row = {
            _children: [],
            amount: 0,
            description: `Partida ${i}`,
            id: idCounter++,
            is_item: false,
            parent_id: null
        };

        rows[row.id] = row;

        for (let j = 1; j <= subpartidas; j++) {
            const subRow = {
                _children: [],
                amount: 0,
                description: `Sub Partida ${i}.${j}`,
                id: idCounter++,
                is_item: false,
                parent_id: row.id
            };
            row._children.push(subRow.id);
            rows[subRow.id] = subRow;

            for (let k = 1; k <= conceptos; k++) {
                const conceptRow = {
                    _children: [],
                    amount: Math.floor(Math.random() * 50) + 1,
                    description: `Concepto ${i}.${j}.${k}`,
                    id: idCounter++,
                    is_item: true,
                    parent_id: subRow.id
                };

                subRow._children.push(conceptRow.id);
                rows[conceptRow.id] = conceptRow;
                subRow.amount += conceptRow.amount;
            }

            row.amount += subRow.amount;
        }
    }

    return rows;
}

export default generateRows;