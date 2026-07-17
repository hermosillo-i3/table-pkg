const { createActionQueue } = require('../src/utils/actionQueue');

describe('createActionQueue', () => {
  it('should execute an action immediately and return its result', async () => {
    const { enqueue } = createActionQueue();
    const parentRowId = 24792;
    const createChildItem = () => ({
      id: 1001,
      parent_id: parentRowId,
      description: 'REQUERIMIENTOS GENERALES',
    });

    const result = await enqueue(parentRowId, createChildItem);

    expect(result).toEqual({
      id: 1001,
      parent_id: 24792,
      description: 'REQUERIMIENTOS GENERALES',
    });
  });

  it('should serialize actions with the same queueKey', async () => {
    const { enqueue } = createActionQueue();
    const parentRowId = 24792;
    const executionOrder = [];
    let finishFirstAction;
    let firstActionStarted;

    const firstActionPending = new Promise((resolve) => {
      finishFirstAction = resolve;
    });
    const firstActionStartedPromise = new Promise((resolve) => {
      firstActionStarted = resolve;
    });

    const firstActionPromise = enqueue(parentRowId, async () => {
      executionOrder.push('create-item-1001');
      firstActionStarted();
      await firstActionPending;
      return { id: 1001, parent_id: parentRowId };
    });

    const secondActionPromise = enqueue(parentRowId, async () => {
      executionOrder.push('create-item-1002');
      return { id: 1002, parent_id: parentRowId };
    });

    await firstActionStartedPromise;
    expect(executionOrder).toEqual(['create-item-1001']);

    finishFirstAction();

    const firstResult = await firstActionPromise;
    const secondResult = await secondActionPromise;

    expect(firstResult).toEqual({ id: 1001, parent_id: 24792 });
    expect(secondResult).toEqual({ id: 1002, parent_id: 24792 });
    expect(executionOrder).toEqual(['create-item-1001', 'create-item-1002']);
  });

  it('should run actions with different queueKeys in parallel', async () => {
    const { enqueue } = createActionQueue();
    const parentRowA = 24792;
    const parentRowB = 24793;
    const executionOrder = [];
    let finishActionA;
    let actionAStarted;

    const actionAPending = new Promise((resolve) => {
      finishActionA = resolve;
    });
    const actionAStartedPromise = new Promise((resolve) => {
      actionAStarted = resolve;
    });

    const actionAPromise = enqueue(parentRowA, async () => {
      executionOrder.push('parent-24792-started');
      actionAStarted();
      await actionAPending;
      executionOrder.push('parent-24792-finished');
      return { id: 1001, parent_id: parentRowA };
    });

    const actionBPromise = enqueue(parentRowB, async () => {
      executionOrder.push('parent-24793-finished');
      return { id: 1002, parent_id: parentRowB };
    });

    await actionAStartedPromise;

    const resultB = await actionBPromise;
    expect(resultB).toEqual({ id: 1002, parent_id: 24793 });
    expect(executionOrder).toEqual(['parent-24792-started', 'parent-24793-finished']);

    finishActionA();

    const resultA = await actionAPromise;
    expect(resultA).toEqual({ id: 1001, parent_id: 24792 });
    expect(executionOrder).toEqual([
      'parent-24792-started',
      'parent-24793-finished',
      'parent-24792-finished',
    ]);
  });
});
