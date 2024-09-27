const { applyFilter } = require('../src/utils/index');

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
    ];

    const filterOne = applyFilter(row[0], dateFilter);
    const filterTwo = applyFilter(row[1], dateFilter);
    const filterThree = applyFilter(row[2], dateFilter);

    expect(filterOne).toEqual(true);
    expect(filterTwo).toEqual(true);
    expect(filterThree).toEqual(false);
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

    expect(filterOne).toEqual(false);
    expect(filterTwo).toEqual(false);
    expect(filterThree).toEqual(true);
  });
});