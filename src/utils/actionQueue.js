/**
 * Creates an in-memory queue that runs actions one at a time per queueKey.
 *
 * Used by Toolbar when an action defines `queueKey`. Rapid clicks on the same
 * button are serialized instead of running in parallel, which prevents race
 * conditions when each click depends on state updated by the previous one.
 *
 * Different queueKey values run independently. A new click executes immediately
 * when the previous action for that key has already finished.
 *
 * @returns {{enqueue: function(string, function): Promise<*>}} Queue controller
 */
export const createActionQueue = () => {
   const queues = {};

   /**
    * Schedules an action after every prior action with the same queueKey.
    * @param {string} queueKey Identifier that groups related actions (e.g. parent row id)
    * @param {Function} action Sync or async function to execute when its turn arrives
    * @returns {Promise<*>} Result of this specific action
    */
   const enqueue = (queueKey, action) => {
      // First click uses an already-resolved promise, so the action runs immediately.
      const previousAction = queues[queueKey] || Promise.resolve();

      const currentAction = previousAction
         // Keep the queue alive when a prior action fails.
         .catch(() => {})
         // Run the new action only after the previous one settles.
         .then(() => Promise.resolve(action()));

      // Store this promise so the next click waits for it.
      // Swallow errors here so a failed action does not block future clicks.
      queues[queueKey] = currentAction.catch(() => {});

      return currentAction;
   };

   return {enqueue};
};

export default createActionQueue;
