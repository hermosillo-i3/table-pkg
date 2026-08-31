# Scroll infinito opt-in en Table

Esta guía explica cómo cablear el `Table` de `@hermosillo-i3/table-pkg` para cargar filas al llegar al final, en **cualquier módulo**. El paquete no conoce modelos, endpoints ni Redux: cada pantalla aporta filtros, fetch y el mapa de columnas ordenables.

Requisito: `@hermosillo-i3/table-pkg` **≥ 1.18.29**.

## Qué ya está listo (no lo vuelvas a crear)

- **Table (opt-in):** `onReachBottom`, `hasMore`, `isLoadingMore`, `reachBottomThresholdPx`. Sin esas props el comportamiento no cambia.
- **Hook:** `useTableInfiniteScroll` — estado de páginas, sort y carga al final.
- **Sort de servidor en Table:** `onSortChange` (desde 1.18.27). Mientras está activo, el orden de las filas cargadas se preserva con `order_position`.
- **Backend (recomendado):** `@hermosillo-i3/utils-pkg` `cursorPagination` — `buildCursorWhere`, `buildSortOrder`, `buildNextCursor`.

El orden por columna lo resuelve el **servidor**. El front solo muestra lo que llega y pide la siguiente tanda.

---

## 1. Backend: listado por cursor

El endpoint acepta, además de los filtros del módulo:

- `limit` (típicamente 20)
- `cursor` (`null` en la primera página; objeto o JSON en las siguientes)
- `sort.field` + `sort.direction` (`ASC` / `DESC`)

Y responde siempre:

```js
{
  items: [...], // o el nombre de tu recurso
  next_cursor: { field, direction, value, id } | null,
  total_count: 123,
}
```

`next_cursor` es `null` cuando no hay más filas.

### A. Mapa de columnas ordenables

Traduce el `field` de la UI a columna o asociación de Sequelize. Cada `field` que el usuario pueda ordenar debe existir aquí.

```js
const sortFields = {
  created_at: { column: 'created_at', association: null, model: null },
  name: { column: 'name', association: null, model: null },
  supplier_name: { column: 'name', association: 'contact', model: Contact },
};
```

### B. Función de listado (`fetchXForList`)

Crea una función por módulo, por ejemplo `fetchXForList({ filters, limit, cursor, sort })`:

1. Resolver `sortConfig` con el mapa de A (campo desconocido → default, p. ej. `created_at`).
2. Contar **antes** de aplicar el cursor, para que `total_count` cubra el filtro completo.
3. Armar el `where` del cursor con `buildCursorWhere({ cursor, sortConfig })` y combinarlo (AND) con los filtros.
4. Ordenar con `buildSortOrder({ sortConfig })` (siempre incluye `id` como desempate).
5. `findAll` con `limit`.
6. Si vinieron `limit` filas: `buildNextCursor({ lastRow, sortConfig })`; si no, `null`.

```js
const {
  buildCursorWhere,
  buildSortOrder,
  buildNextCursor,
} = require('@hermosillo-i3/utils-pkg/src/cursorPagination');
```

`buildCursorWhere` incluye filas sin valor cuando el orden es DESC (el caso de estatus “abierto” / `NULL`). El API no conoce la tabla del front: solo filtros, sort y cursor.

---

## 2. Action / cliente HTTP

Una action que reciba `{ ...filters, limit, cursor, sort }` y devuelva `{ items, next_cursor, total_count }` (o el nombre de tu recurso).

Si el cursor va por query (GET), serialízalo:

```js
if (params.cursor != null && typeof params.cursor === 'object') {
  params.cursor = JSON.stringify(params.cursor);
}
```

Si va en body (POST), envíalo como objeto.

---

## 3. Vista: `fetchPage` (contrato del hook)

Esta es **la función que sí escribes en cada pantalla**. El hook espera:

```
{ cursor, limit, filters, sort }
  → { items, orderedIds, nextCursor, total_count }
```

- `items`: mapa **keyed by id** (`{ [id]: row }`), no un array.
- `orderedIds`: ids en el orden que devolvió el servidor.
- `nextCursor`: el `next_cursor` del API.

```js
const fetchPage = useCallback(async ({ cursor, limit, filters, sort }) => {
  const result = await dispatch(getMiListado({ ...filters, limit, cursor, sort }));
  const list = result?.response?.items ?? [];
  return {
    items: normalizeToIdMap(list),
    orderedIds: list.map((row) => String(row.id)),
    nextCursor: result?.response?.next_cursor ?? null,
    total_count: result?.response?.total_count ?? null,
  };
}, [dispatch]);
```

`normalizeToIdMap` es de la pantalla: labels, joins, `is_item: true`, etc.

---

## 4. Enganchar el hook

```js
import Table, { useTableInfiniteScroll } from '@hermosillo-i3/table-pkg';
// o: import { Table, useTableInfiniteScroll } from '@hermosillo-i3/table-pkg';

const {
  items,
  itemOrder,
  itemCount,
  sort: activeSort,
  isFetching,
  isLoadingMore,
  hasMore,
  applySearch,
  applySort,
  loadMore,
  updateItem,
  removeItems,
} = useTableInfiniteScroll({
  fetchPage,
  pageSize: 20,
  initialSort: { field: 'created_at', direction: 'DESC' },
});
```

| Quieres… | Llamas |
|---|---|
| Primera carga / filtros | `applySearch(filters)` |
| Clic en columna | `applySort({ field, direction })` |
| Llegar al final | `loadMore` (lo dispara el Table) |
| Editar una fila ya cargada | `updateItem(id, patch)` |
| Borrar filas | `removeItems([id, …])` |

No uses `setRef` ni listeners de scroll en el DOM. El Table cuelga el listener en su contenedor de scroll.

Carga inicial:

```js
useEffect(() => {
  applySearch({});
}, []);
```

---

## 5. Armar `rows` para el Table

El Table busca filas por `id` y **no reordena** lo paginado. El orden viaja en `order_position`:

```js
const tableRows = useMemo(() => (
  itemOrder.reduce((rows, id, index) => {
    const row = items[id];
    if (!row) {
      return rows;
    }
    rows[id] = { ...row, order_position: index, is_item: true };
    return rows;
  }, {})
), [itemOrder, items]);

const preserveServerRowOrder = (left, right) => (
  (left.order_position ?? 0) - (right.order_position ?? 0)
);
```

---

## 6. Cablear el Table

```jsx
<Table
  title={`Listado (${itemCount || 0})`}
  rows={tableRows}
  columns={getColumns()}
  isLoading={isFetching}
  onReachBottom={loadMore}
  isLoadingMore={isLoadingMore}
  hasMore={hasMore}
  sort={preserveServerRowOrder}
/>
```

Al llegar al final (o si las filas no llenan la pantalla y `hasMore` es true) se pide la siguiente tanda. El pie “Cargando más…” aparece solo si no pasas `bottomToolbar`.

Props opt-in:

| Prop | Rol |
|---|---|
| `onReachBottom` | Se llama cerca del final y cuando el contenido no llena el viewport |
| `hasMore` | Si es `false`, no dispara `onReachBottom` |
| `isLoadingMore` | Footer por defecto (“Cargando más…”) si no hay `bottomToolbar` |
| `reachBottomThresholdPx` | Distancia al fondo; default 80 |

---

## 7. Orden por columna

El sort nativo del Table solo reordena **lo ya cargado** y pelea con el cursor. Usa sort de servidor.

**A. `onSortChange` del Table** (módulos nuevos):

```jsx
<Table
  onSortChange={applySort}
  onReachBottom={loadMore}
  isLoadingMore={isLoadingMore}
  hasMore={hasMore}
  sort={preserveServerRowOrder}
/>
```

`applySort` recibe `{ field, direction }`. Cada `field` debe existir en el mapa del backend (paso 1A).

**B. Cabeceras de servidor** (fivebim-app: `buildServerSortColumn` + `resolveNextSortDirection`):

```js
const handleServerSort = useCallback((field) => {
  return applySort({
    field,
    direction: resolveNextSortDirection(activeSort, field),
  });
}, [activeSort, applySort]);

const getColumns = () => [
  buildServerSortColumn({
    label: 'Nombre',
    field: 'name',
    activeSort,
    onSort: handleServerSort,
  }),
];
```

En columnas paginadas deja `sortable: false` (ya lo hace `buildServerSortColumn`).

---

## 8. Checklist

1. Endpoint con `limit` + `cursor` + `sort` → `{ lista, next_cursor, total_count }`.
2. Mapa `sortFields` + `buildCursorWhere` / `buildSortOrder` / `buildNextCursor`.
3. Action que reenvía filtros, `limit`, `cursor` y `sort`.
4. `fetchPage` que convierte la respuesta al contrato del hook.
5. `useTableInfiniteScroll({ fetchPage })`.
6. `rows` keyed by id + `order_position`.
7. Table: `onReachBottom` / `hasMore` / `isLoadingMore`.
8. Sort por servidor (`onSortChange` o cabeceras de servidor).
9. Filtros → `applySearch`; editar/borrar → `updateItem` / `removeItems`.

---

## 9. Fuera de alcance

- No copies el hook ni cuelgues scroll en el DOM.
- No metas Redux, endpoints ni modelos dentro de `table-pkg`.
- Aún no cubre abrir un registro desde un enlace directo cuando no está entre los primeros resultados, ni el scroll hacia arriba.
