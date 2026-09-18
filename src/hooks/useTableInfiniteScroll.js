import {useCallback, useEffect, useRef, useState} from 'react';

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SORT = {field: 'created_at', direction: 'DESC'};

/**
 * Cursor-based infinite list state for a table-pkg Table.
 * Pair `loadMore` with Table `onReachBottom`.
 *
 * @param {Object} params
 * @param {(args: {cursor: Object|null, limit: number, filters: Object, sort: {field: string, direction: string}, focusId?: string|number|null}) => Promise<{items: Object, orderedIds?: string[], nextCursor?: Object|null, total_count?: number|null}>} params.fetchPage
 *        Fetches one page. `items` is an id-keyed map merged on load-more.
 * @param {number} [params.pageSize=50] - Page size sent to `fetchPage`.
 * @param {{field: string, direction: string}} [params.initialSort] - Default server sort.
 * @returns {{
 *   items: Object,
 *   itemOrder: string[],
 *   itemCount: number,
 *   sort: {field: string, direction: string},
 *   isFetching: boolean,
 *   isLoadingMore: boolean,
 *   hasMore: boolean,
 *   applySearch: (filters: Object, options?: {focusId?: string|number|null}) => Promise<Object>,
 *   applySort: (sort: {field: string, direction: string}) => Promise<Object>,
 *   loadMore: () => Promise<void>,
 *   ensureFocusedItem: (focusId: string|number|null) => Promise<Object>,
 *   updateItem: (id: string|number, patch: Object) => void,
 *   removeItems: (ids: Array<string|number>) => void,
 * }}
 */
const useTableInfiniteScroll = ({
   fetchPage,
   pageSize = DEFAULT_PAGE_SIZE,
   initialSort = DEFAULT_SORT,
}) => {
   const [items, setItems] = useState({});
   const [itemOrder, setItemOrder] = useState([]);
   const [itemCount, setItemCount] = useState(0);
   const [sort, setSort] = useState(initialSort);
   const [nextCursor, setNextCursor] = useState(null);
   const [isFetching, setIsFetching] = useState(false);
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const nextCursorRef = useRef(null);
   const isPagingRef = useRef(false);
   const isFetchingRef = useRef(false);
   const filtersRef = useRef({});
   const sortRef = useRef(initialSort);
   const itemsRef = useRef({});
   const fetchPageRef = useRef(fetchPage);
   const listGenerationRef = useRef(0);

   useEffect(() => {
      nextCursorRef.current = nextCursor;
      isFetchingRef.current = isFetching;
      fetchPageRef.current = fetchPage;
      sortRef.current = sort;
      itemsRef.current = items;
   }, [nextCursor, isFetching, fetchPage, sort, items]);

   /**
    * @description Invalidates in-flight page requests and clears the loaded list.
    * @returns {number} New list generation token.
    */
   const resetListState = useCallback(() => {
      const nextGeneration = listGenerationRef.current + 1;
      listGenerationRef.current = nextGeneration;
      isPagingRef.current = false;
      setIsLoadingMore(false);
      setNextCursor(null);
      nextCursorRef.current = null;
      setItems({});
      itemsRef.current = {};
      setItemOrder([]);
      return nextGeneration;
   }, []);

   /**
    * @description Loads the first page for the given filters and sort, replacing the list.
    * @param {Object} filters - Filter payload forwarded to `fetchPage`.
    * @param {{field: string, direction: string}} sortToApply - Server sort forwarded to `fetchPage`.
    * @param {{focusId?: string|number|null}} [options] - Optional deep-link id; loads every page through that row's batch.
    * @returns {Promise<Object>} Normalized first-page items map.
    */
   const loadFirstPage = useCallback(async (filters, sortToApply, options = {}) => {
      const generation = resetListState();
      filtersRef.current = filters;
      sortRef.current = sortToApply;
      setSort(sortToApply);
      setIsFetching(true);
      isFetchingRef.current = true;
      try {
         const {
            items: pageItems,
            orderedIds,
            nextCursor: pageNextCursor,
            total_count: totalCount,
         } = await fetchPageRef.current({
            cursor: null,
            limit: pageSize,
            filters,
            sort: sortToApply,
            focusId: options.focusId ?? null,
         });

         if (generation !== listGenerationRef.current) {
            return {};
         }

         const nextOrder = Array.isArray(orderedIds) ? orderedIds : Object.keys(pageItems);
         setItems(pageItems);
         itemsRef.current = pageItems;
         setItemOrder(nextOrder);
         setNextCursor(pageNextCursor ?? null);
         nextCursorRef.current = pageNextCursor ?? null;
         setItemCount(totalCount ?? 0);
         return pageItems;
      } finally {
         if (generation === listGenerationRef.current) {
            isFetchingRef.current = false;
            setIsFetching(false);
         }
      }
   }, [pageSize, resetListState]);

   /**
    * Resets the list and loads the first page for the given filters (keeps current sort).
    * @param {Object} filters - Filter payload forwarded to `fetchPage`.
    * @param {{focusId?: string|number|null}} [options] - Optional deep-link id; loads every page through that row's batch.
    * @returns {Promise<Object>} Normalized first-page items map.
    */
   const applySearch = useCallback(async (filters, options = {}) => {
      return loadFirstPage(filters, sortRef.current, options);
   }, [loadFirstPage]);

   /**
    * Resets the list and loads the first page for a new sort (keeps current filters).
    * @param {{field: string, direction: string}} nextSort - Server sort to apply.
    * @returns {Promise<Object>} Normalized first-page items map.
    */
   const applySort = useCallback(async (nextSort) => {
      return loadFirstPage(filtersRef.current, nextSort);
   }, [loadFirstPage]);

   /**
    * Reloads the list through `focusId`'s batch when that row is not already loaded.
    * @param {string|number|null} focusId - Row id from a deep link.
    * @returns {Promise<Object>} Current or reloaded items map.
    */
   const ensureFocusedItem = useCallback(async (focusId) => {
      if (focusId == null || `${focusId}`.trim() === '') {
         return itemsRef.current;
      }
      if (itemsRef.current[String(focusId)]) {
         return itemsRef.current;
      }
      return loadFirstPage(filtersRef.current, sortRef.current, {focusId});
   }, [loadFirstPage]);

   /**
    * Appends the next page using the current next cursor, filters, and sort.
    * @returns {Promise<void>}
    */
   const loadMore = useCallback(async () => {
      if (!nextCursorRef.current || isPagingRef.current || isFetchingRef.current) {
         return;
      }

      const generation = listGenerationRef.current;
      isPagingRef.current = true;
      setIsLoadingMore(true);
      const cursor = nextCursorRef.current;
      try {
         const {
            items: pageItems,
            orderedIds,
            nextCursor: pageNextCursor,
            total_count: totalCount,
         } = await fetchPageRef.current({
            cursor,
            limit: pageSize,
            filters: filtersRef.current,
            sort: sortRef.current,
         });
         if (generation !== listGenerationRef.current) {
            return;
         }
         const pageOrder = Array.isArray(orderedIds) ? orderedIds : Object.keys(pageItems);
         setItems((prev) => {
            const nextItems = {...prev, ...pageItems};
            itemsRef.current = nextItems;
            return nextItems;
         });
         setItemOrder((prev) => {
            const seen = new Set(prev);
            const appended = pageOrder.filter((id) => !seen.has(id));
            return [...prev, ...appended];
         });
         setNextCursor(pageNextCursor ?? null);
         nextCursorRef.current = pageNextCursor ?? null;
         if (totalCount != null) {
            setItemCount(totalCount);
         }
      } finally {
         if (generation === listGenerationRef.current) {
            isPagingRef.current = false;
            setIsLoadingMore(false);
         }
      }
   }, [pageSize]);

   /**
    * @description Patches a single item in the loaded collection.
    * @param {string|number} id - Item id.
    * @param {Object} patch - Partial fields to merge into the item.
    * @returns {void}
    */
   const updateItem = useCallback((id, patch) => {
      const normalizedId = String(id);
      setItems((prev) => {
         if (!prev[normalizedId]) {
            return prev;
         }
         const nextItems = {
            ...prev,
            [normalizedId]: {
               ...prev[normalizedId],
               ...patch,
            },
         };
         itemsRef.current = nextItems;
         return nextItems;
      });
   }, []);

   /**
    * @description Removes items from the loaded collection.
    * @param {Array<string|number>} ids - Item ids to remove.
    * @returns {void}
    */
   const removeItems = useCallback((ids = []) => {
      const normalizedIds = ids.map((entry) => String(entry));
      const idsToRemove = new Set(normalizedIds);
      setItems((prev) => {
         const nextItems = {...prev};
         normalizedIds.forEach((itemId) => {
            delete nextItems[itemId];
         });
         itemsRef.current = nextItems;
         return nextItems;
      });
      setItemOrder((prev) => prev.filter((itemId) => !idsToRemove.has(itemId)));
      setItemCount((prev) => Math.max(0, prev - normalizedIds.length));
   }, []);

   return {
      items,
      itemOrder,
      itemCount,
      sort,
      isFetching,
      isLoadingMore,
      hasMore: nextCursor != null,
      applySearch,
      applySort,
      loadMore,
      ensureFocusedItem,
      updateItem,
      removeItems,
   };
};

export default useTableInfiniteScroll;
