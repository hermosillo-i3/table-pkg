const { applyFilter, fixRowsFromClipboard } = require('../src/utils/index');

describe('applyFilter', () => {
  it('should apply status filters correctly', () => {
    const openFilter = [
      {
        key: 'status',
        value: [
          {
            id: 'OPEN',
            value: 'OPEN',
            key: 'OPEN',
            text: 'Abierto'
          }
        ],
        format: {
          type: 'select',
          options: [
            { id: 'OPEN', value: 'OPEN', key: 'OPEN', text: 'Abierto' },
            { id: 'CLOSE', value: 'CLOSE', key: 'CLOSE', text: 'Cerrado' },
            { id: 'PENDING', value: 'PENDING', key: 'PENDING', text: 'Proceso' },
            { id: 'CANCEL', value: 'CANCEL', key: 'CANCEL', text: 'Cancelado' },
            { id: 'CRITICAL', value: 'CRITICAL', key: 'CRITICAL', text: 'Crítico' }
          ],
          placeholder: 'Tipo de progreso'
        }
      }
    ];
    const closeFilter = [
      {
        key: 'status',
        value: [
          {
            id: 'CLOSE',
            value: 'CLOSE',
            key: 'CLOSE',
            text: 'Cerrado'
          }
        ],
        format: {
          type: 'select',
          options: [
            { id: 'OPEN', value: 'OPEN', key: 'OPEN', text: 'Abierto' },
            { id: 'CLOSE', value: 'CLOSE', key: 'CLOSE', text: 'Cerrado' },
            { id: 'PENDING', value: 'PENDING', key: 'PENDING', text: 'Proceso' },
            { id: 'CANCEL', value: 'CANCEL', key: 'CANCEL', text: 'Cancelado' },
            { id: 'CRITICAL', value: 'CRITICAL', key: 'CRITICAL', text: 'Crítico' }
          ],
          placeholder: 'Tipo de progreso'
        }
      }
    ];

    const row = [
      { id: 24792, project_id: 168, procurement_schedule_id: 489, is_item: true,  description: 'REQUERIMIENTOS GENERALES', order_date:"2023-01-09", status: 'OPEN', },
      { id: 24793, project_id: 169, procurement_schedule_id: 490, is_item: true, description: 'REQUERIMIENTOS ESPECÍFICOS', order_date:"2023-01-12", status: 'CLOSE', },
    ];

    const filterOne = applyFilter(row[0], openFilter);
    const filterTwo = applyFilter(row[1], openFilter);
    const filterThree = applyFilter(row[0], closeFilter);

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(false);
    expect(filterThree).toEqual(false);
  });

  it('should apply date filters correctly', () => {
    const dateFilter = [
      {
        key: 'order_date',
        value: {max: '2023-01-12', min: '2023-01-09', equal: null},
        format: {
          type: 'date',
          placeholder: 'Fecha de orden'
        }
      }
    ];

    const row = [
      { id: 24792, project_id: 168, procurement_schedule_id: 489, is_item: true,  description: 'REQUERIMIENTOS GENERALES', order_date:"2023-01-09", status: 'OPEN', },
      { id: 24793, project_id: 169, procurement_schedule_id: 490, is_item: true, description: 'REQUERIMIENTOS ESPECÍFICOS', order_date:"2023-01-12", status: 'CLOSE', },
      { id: 24794, project_id: 170, procurement_schedule_id: 491, is_item: true, description: 'OBRA', order_date:"2023-01-13", status: 'CLOSE', },
      { id: 24795, project_id: 171, procurement_schedule_id: 492, is_item: true, description: 'OBRA', order_date:null, status: 'CLOSE', },
    ];

    const filterOne = applyFilter(row[0], dateFilter);
    const filterTwo = applyFilter(row[1], dateFilter);
    const filterThree = applyFilter(row[2], dateFilter);
    const filterFour = applyFilter(row[3], dateFilter);

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(true);
    expect(filterThree).toEqual(false);
    expect(filterFour).toEqual(false);
  });

  it('should apply multiple filters correctly', () => {
    const filters = [
      {
        key: 'status',
        value: [
          {
            id: 'CLOSE',
            value: 'CLOSE',
            key: 'CLOSE',
            text: 'Cerrado'
          }
        ],
        format: {
          type: 'select',
          options: [
            { id: 'OPEN', value: 'OPEN', key: 'OPEN', text: 'Abierto' },
            { id: 'CLOSE', value: 'CLOSE', key: 'CLOSE', text: 'Cerrado' },
            { id: 'PENDING', value: 'PENDING', key: 'PENDING', text: 'Proceso' },
            { id: 'CANCEL', value: 'CANCEL', key: 'CANCEL', text: 'Cancelado' },
            { id: 'CRITICAL', value: 'CRITICAL', key: 'CRITICAL', text: 'Crítico' }
          ],
          placeholder: 'Tipo de progreso'
        }
      },
      {
        key: 'order_date',
        value: {max: '2023-01-11', min: '2023-01-09', equal: null},
        format: {
          type: 'date',
          placeholder: 'Fecha de orden'
        }
      },
      {
        key: "purchase_orders",
        value: "4600002104",
        format: "list"
      },
      {
        format:"text",
        key:"description",
        value:"obra"
      }
    ];

    const row = [
      { id: 24792, project_id: 168, procurement_schedule_id: 489, is_item: true,  description: 'REQUERIMIENTOS GENERALES', order_date:"2023-01-09", status: 'OPEN', purchase_orders:[]},
      { id: 24793, project_id: 169, procurement_schedule_id: 490, is_item: true, description: 'REQUERIMIENTOS obra', order_date:"2023-01-12", status: 'CLOSE', purchase_orders: []},
      { id: 24794, project_id: 170, procurement_schedule_id: 491, is_item: true, description: 'OBRA', order_date:"2023-01-11", status: 'CLOSE', purchase_orders: [ "4600002104", "4600004595"]},
      { id: 24795, project_id: 171, procurement_schedule_id: 492, is_item: true, description: 'OBRA', order_date:null, status: 'CLOSE', purchase_orders: [ "4600002176"]},
    ];

    const filterOne = applyFilter(row[0], filters);
    const filterTwo = applyFilter(row[1], filters);
    const filterThree = applyFilter(row[2], filters);
    const filterFour = applyFilter(row[3], filters);

    expect(filterOne).toEqual(false);
    expect(filterTwo).toEqual(false);
    expect(filterThree).toEqual(true);
    expect(filterFour).toEqual(false);
  });

  it('should apply searchSelect filters correctly', () => {
    const searchSelectFilter = [
      {
        key: 'category',
        value: ['Metal', 'Acero'],
        format: 'searchSelect'
      }
    ];

    const rows = [
      { id: 1, category: 'Metalurgia y Soldadura', description: 'Proceso de soldadura' },
      { id: 2, category: 'Acero Inoxidable', description: 'Material resistente' },
      { id: 3, category: 'Plástico PVC', description: 'Tubería de plástico' },
      { id: 4, category: 'Aluminio', description: 'Material ligero' },
      { id: 5, category: 'ACERO GALVANIZADO', description: 'Material protegido' },
    ];

    const filterOne = applyFilter(rows[0], searchSelectFilter); // Contains 'Metal'
    const filterTwo = applyFilter(rows[1], searchSelectFilter); // Contains 'Acero'
    const filterThree = applyFilter(rows[2], searchSelectFilter); // No match
    const filterFour = applyFilter(rows[3], searchSelectFilter); // No match
    const filterFive = applyFilter(rows[4], searchSelectFilter); // Contains 'ACERO' (case insensitive)

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(true);
    expect(filterThree).toEqual(false);
    expect(filterFour).toEqual(false);
    expect(filterFive).toEqual(true);
  });

  it('should handle searchSelect with empty filter values', () => {
    const emptySearchSelectFilter = [
      {
        key: 'category',
        value: [],
        format: 'searchSelect'
      }
    ];

    const row = { id: 1, category: 'Metalurgia y Soldadura' };

    const filterResult = applyFilter(row, emptySearchSelectFilter);

    expect(filterResult).toEqual(true); // Empty filter should pass all rows
  });

  it('should handle searchSelect with null cell values', () => {
    const searchSelectFilter = [
      {
        key: 'category',
        value: ['Metal'],
        format: 'searchSelect'
      }
    ];

    const rows = [
      { id: 1, category: null },
      { id: 2, category: undefined },
      { id: 3, category: '' },
    ];

    const filterOne = applyFilter(rows[0], searchSelectFilter);
    const filterTwo = applyFilter(rows[1], searchSelectFilter);
    const filterThree = applyFilter(rows[2], searchSelectFilter);

    expect(filterOne).toEqual(false);
    expect(filterTwo).toEqual(false);
    expect(filterThree).toEqual(false);
  });

  it('should apply searchSelect with partial matches', () => {
    const searchSelectFilter = [
      {
        key: 'description',
        value: ['req', 'obra'],
        format: 'searchSelect'
      }
    ];

    const rows = [
      { id: 1, description: 'REQUERIMIENTOS GENERALES' },
      { id: 2, description: 'Material para obra civil' },
      { id: 3, description: 'Herramientas especiales' },
      { id: 4, description: 'Requirement analysis' },
    ];

    const filterOne = applyFilter(rows[0], searchSelectFilter); // Contains 'req'
    const filterTwo = applyFilter(rows[1], searchSelectFilter); // Contains 'obra'
    const filterThree = applyFilter(rows[2], searchSelectFilter); // No match
    const filterFour = applyFilter(rows[3], searchSelectFilter); // Contains 'req' (case insensitive)

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(true);
    expect(filterThree).toEqual(false);
    expect(filterFour).toEqual(true);
  });

  it('should apply searchSelect in combination with other filters', () => {
    const combinedFilters = [
      {
        key: 'status',
        value: [
          {
            id: 'ACTIVE',
            value: 'ACTIVE',
            key: 'ACTIVE',
            text: 'Activo'
          }
        ],
        format: {
          type: 'select',
          options: [
            { id: 'ACTIVE', value: 'ACTIVE', key: 'ACTIVE', text: 'Activo' },
            { id: 'INACTIVE', value: 'INACTIVE', key: 'INACTIVE', text: 'Inactivo' }
          ]
        }
      },
      {
        key: 'category',
        value: ['Metal'],
        format: 'searchSelect'
      }
    ];

    const rows = [
      { id: 1, is_item: true, status: 'ACTIVE', category: 'Metalurgia Industrial' },
      { id: 2, is_item: true, status: 'INACTIVE', category: 'Metalurgia Industrial' },
      { id: 3, is_item: true, status: 'ACTIVE', category: 'Plástico PVC' },
      { id: 4, is_item: true, status: 'ACTIVE', category: 'Acero Galvanizado' },
    ];

    const filterOne = applyFilter(rows[0], combinedFilters); // ACTIVE + contains 'Metal'
    const filterTwo = applyFilter(rows[1], combinedFilters); // INACTIVE + contains 'Metal'
    const filterThree = applyFilter(rows[2], combinedFilters); // ACTIVE + no 'Metal'
    const filterFour = applyFilter(rows[3], combinedFilters); // ACTIVE + no 'Metal'

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(false);
    expect(filterThree).toEqual(false);
    expect(filterFour).toEqual(false);
  });
});

describe('fixRowsFromClipboard', () => {
  it('should reformat the rows copied from a spreadsheet and prepare them to be used pasted in the table', () => {
      const initialRows = [[
          "item1",
          "lte",
          "566",
          "768\nitem2",
          "lte",
          "38",
          "456\nitem3",
          "lte",
          "56",
          "879\nitem4",
          "lte",
          "152",
          "78\nitem5",
          "lte",
          "53",
          "86\nitem6",
          "lte",
          "546",
          "265\nitem7",
          "lte",
          "786",
          "789\nitem8",
          "lte",
          "15",
          "786\nitem9",
          "lte",
          "738",
          "45\nitem10",
          "lte",
          "786",
          "456"
      ]];

      const expectedRows = [
          ['item1', 'lte', '566', '768'],
          ['item2', 'lte', '38', '456'],
          ['item3', 'lte', '56', '879'],
          ['item4', 'lte', '152', '78'],
          ['item5', 'lte', '53', '86'],
          ['item6', 'lte', '546', '265'],
          ['item7', 'lte', '786', '789'],
          ['item8', 'lte', '15', '786'],
          ['item9', 'lte', '738', '45'],
          ['item10', 'lte', '786', '456']
      ];

      const fixedRows = fixRowsFromClipboard(initialRows);

      expect(fixedRows).toEqual(expectedRows);
  });

  it('should handle rows with only one column', () => {
    const initialRows = [[
      'item1\nitem2\nitem3\nitem4\nitem5\nitem6\nitem7\nitem8\nitem9\nitem10\n'
    ]];

    const expectedRows = [
      ['item1'],
      ['item2'],
      ['item3'],
      ['item4'],
      ['item5'],
      ['item6'],
      ['item7'],
      ['item8'],
      ['item9'],
      ['item10']
    ];

    const fixedRows = fixRowsFromClipboard(initialRows);

    expect(fixedRows).toEqual(expectedRows);
  });

  it('should handle formatting a single row with multiple columns', () => {
    const initialRows = [[
      'item1',
      'lte',
      '566',
      '768\n'
    ]];

    const expectedRows = [
      ['item1', 'lte', '566', '768']
    ];

    const fixedRows = fixRowsFromClipboard(initialRows);

    expect(fixedRows).toEqual(expectedRows);
  });
});