import {useCallback, useEffect, useRef, useState} from 'react';

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SORT = {field: 'created_at', direction: 'DESC'};

/**
 * Cursor-based infinite list state for a table-pkg Table.
 * Pair `loadMore` with Table `onReachBottom`, and `isLoadingMore` / `hasMore` with the matching Table props.
 *
 * @param {Object} params
 * @param {(args: {cursor: Object|null, limit: number, filters: Object, sort: {field: string, direction: string}}) => Promise<{items: Object, orderedIds?: string[], nextCursor: Object|null, total_count?: number|null}>} params.fetchPage
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
 *   applySearch: (filters: Object) => Promise<Object>,
 *   applySort: (sort: {field: string, direction: string}) => Promise<Object>,
 *   loadMore: () => Promise<void>,
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
   const isLoadingMoreRef = useRef(false);
   const isFetchingRef = useRef(false);
   const filtersRef = useRef({});
   const sortRef = useRef(initialSort);
   const fetchPageRef = useRef(fetchPage);
   const listGenerationRef = useRef(0);

   useEffect(() => {
      nextCursorRef.current = nextCursor;
      isLoadingMoreRef.current = isLoadingMore;
      isFetchingRef.current = isFetching;
      fetchPageRef.current = fetchPage;
      sortRef.current = sort;
   }, [nextCursor, isLoadingMore, isFetching, fetchPage, sort]);

   /**
    * @description Invalidates in-flight load-more requests and clears the loaded list.
    * @returns {number} New list generation token.
    */
   const resetListState = useCallback(() => {
      const nextGeneration = listGenerationRef.current + 1;
      listGenerationRef.current = nextGeneration;
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
      setNextCursor(null);
      nextCursorRef.current = null;
      setItems({});
      setItemOrder([]);
      return nextGeneration;
   }, []);

   /**
    * @description Loads the first page for the given filters and sort, replacing the list.
    * @param {Object} filters - Filter payload forwarded to `fetchPage`.
    * @param {{field: string, direction: string}} sortToApply - Server sort forwarded to `fetchPage`.
    * @returns {Promise<Object>} Normalized first-page items map.
    */
   const loadFirstPage = useCallback(async (filters, sortToApply) => {
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
            nextCursor: pageCursor,
            total_count: totalCount,
         } = await fetchPageRef.current({
            cursor: null,
            limit: pageSize,
            filters,
            sort: sortToApply,
         });

         if (generation !== listGenerationRef.current) {
            return {};
         }

         const nextOrder = Array.isArray(orderedIds) ? orderedIds : Object.keys(pageItems);
         setItems(pageItems);
         setItemOrder(nextOrder);
         setNextCursor(pageCursor);
         nextCursorRef.current = pageCursor;
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
    * @returns {Promise<Object>} Normalized first-page items map.
    */
   const applySearch = useCallback(async (filters) => {
      return loadFirstPage(filters, sortRef.current);
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
    * Appends the next page using the current cursor, filters, and sort.
    * @returns {Promise<void>}
    */
   const loadMore = useCallback(async () => {
      if (!nextCursorRef.current || isLoadingMoreRef.current || isFetchingRef.current) {
         return;
      }

      const generation = listGenerationRef.current;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      const cursor = nextCursorRef.current;
      try {
         const {
            items: pageItems,
            orderedIds,
            nextCursor: pageCursor,
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
         setItems((prev) => ({...prev, ...pageItems}));
         setItemOrder((prev) => {
            const seen = new Set(prev);
            const appended = pageOrder.filter((id) => !seen.has(id));
            return [...prev, ...appended];
         });
         setNextCursor(pageCursor);
         nextCursorRef.current = pageCursor;
         if (totalCount != null) {
            setItemCount(totalCount);
         }
      } finally {
         if (generation === listGenerationRef.current) {
            isLoadingMoreRef.current = false;
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
         return {
            ...prev,
            [normalizedId]: {
               ...prev[normalizedId],
               ...patch,
            },
         };
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
      updateItem,
      removeItems,
   };
};

export default useTableInfiniteScroll;
