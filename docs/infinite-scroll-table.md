# Scroll infinito en Table

Requisito: `@hermosillo-i3/table-pkg` **≥ 1.18.29**.

## Cómo funciona

El `Table` de `@hermosillo-i3/table-pkg` no carga todo el listado de golpe. Pide **tandas** (por defecto 20 filas) y, al llegar al final, pide la siguiente.

Las piezas son:

- **`Table`:** el componente de tabla. Avisa cuando el scroll llega al final (`onReachBottom`).
- **`useTableInfiniteScroll`:** el hook de `table-pkg` que guarda las filas ya cargadas, el orden y el cursor. Lo usas en el componente de la ruta (por ejemplo `precalificacion/index.js`).
- **`fetchPage`:** la función que escribes en ese mismo componente. Habla con la action de Redux / el endpoint y traduce la respuesta.
- **Endpoint (fivebim-api o el microservicio):** arma la tanda con filtros, sort y cursor, y devuelve `next_cursor`.

El flujo:

1. El componente de la ruta llama `applySearch` (primera carga o filtros) o `applySort` (clic en una columna). `useTableInfiniteScroll` pide la **primera tanda** con `cursor: null` a través de `fetchPage`.
2. El endpoint responde con esas filas, un `total_count` y un `next_cursor` (o `null` si ya no hay más).
3. `useTableInfiniteScroll` guarda las filas **por id** y el **orden** que mandó el endpoint. El `Table` las muestra así, sin reordenarlas.
4. Cuando el usuario llega al final, el `Table` llama `onReachBottom` → `useTableInfiniteScroll` pide la siguiente tanda con ese `next_cursor`.
5. Las filas nuevas se **agregan** debajo. Un clic en columna vuelve al paso 1 con el nuevo sort: el endpoint reordena **todo** el listado, no solo lo que ya se ve.

`table-pkg` no conoce modelos, Redux ni URLs. Cada ruta aporta filtros, `fetchPage` y el mapa de columnas ordenables.

---

## ¿Cómo incluir Scroll Infinito a una Tabla?

### 1. Backend

1. Haz que el endpoint acepte, además de los filtros de la ruta, `limit` (típicamente 20), `cursor` (`null` en la primera tanda) y `sort.field` / `sort.direction` (`ASC` o `DESC`).
2. Devuelve siempre este contrato. `next_cursor` va en `null` cuando no hay más filas:

```js
{
  items: [...], // o el nombre de tu recurso
  next_cursor: { field, direction, value, id } | null,
  total_count: 123,
}
```

3. En la action de Redux, reenvía `filters`, `limit`, `cursor` y `sort`. Si el cursor va por query (GET), serialízalo con `JSON.stringify`. Si va en body (POST), mándalo como objeto.

#### Mapa de columnas ordenables

4. Crea un mapa `sortFields` en el util del listado: cada `field` que el usuario pueda ordenar se traduce a columna o join de Sequelize.

```js
const sortFields = {
  created_at: { column: 'created_at', association: null, model: null },
  name: { column: 'name', association: null, model: null },
  supplier_name: { column: 'name', association: 'contact', model: Contact },
};
```

#### Función de listado

5. En el util del controller (por ejemplo `fetchReportesForGlobalSearch`), implementa la tanda con `{ filters, limit, cursor, sort }`:

   1. Resuelve el sort con el mapa. Si el campo no existe, usa el default (p. ej. `created_at`).
   2. Cuenta **antes** de aplicar el cursor, para que `total_count` cubra todo el filtro.
   3. Arma el `where` del cursor con `buildCursorWhere({ cursor, sortConfig })` y combínalo (AND) con los filtros.
   4. Ordena con `buildSortOrder({ sortConfig })`. Siempre desempata por `id`.
   5. Haz `findAll` con `limit`.
   6. Si vinieron `limit` filas, arma `next_cursor` con `buildNextCursor({ lastRow, sortConfig })`. Si no, devuelve `null`.

```js
const {
  buildCursorWhere,
  buildSortOrder,
  buildNextCursor,
} = require('@hermosillo-i3/utils-pkg/src/cursorPagination');
```

`buildCursorWhere` incluye filas sin valor cuando el orden es DESC (p. ej. estatus abierto / `NULL`).

#### Columnas especiales

Usa `cursorPagination` cuando el valor es **una columna o un join** (fecha, código, tipo, UEN, estatus que es una fecha/`NULL`).

Si una columna ordena con SQL especial o un valor especifico del modelo (como el nivel de riesgo en los Reportes de Seguridad), deja ese `where`/`order` en el util del listado y usa los helpers en el resto. Fechas ISO del cursor y etiquetas de catálogo también se quedan en ese util.

Si el valor del cursor vive en una asociación (no en la fila), pásalo a `buildNextCursor` con `value`.

### 2. Front (fivebim-app)

#### `fetchPage`

6. En el componente de la ruta, escribe `fetchPage`. `useTableInfiniteScroll` espera:

```
{ cursor, limit, filters, sort }
  → { items, orderedIds, nextCursor, total_count }
```

`items` es un mapa por id (`{ [id]: row }`), no un array. `orderedIds` es el orden que devolvió el endpoint.

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

#### `useTableInfiniteScroll` y `Table`

7. Importa el `Table` y el hook desde `table-pkg`, y pásale `fetchPage`:

```js
import Table, { useTableInfiniteScroll } from '@hermosillo-i3/table-pkg';

const {
  items, itemOrder, itemCount, sort: activeSort,
  isFetching, isLoadingMore, hasMore,
  applySearch, applySort, loadMore, updateItem, removeItems,
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
| Llegar al final | `loadMore` (el `Table` lo dispara con `onReachBottom`) |
| Editar o borrar filas ya cargadas | `updateItem` / `removeItems` |

8. Arma `rows` keyed by id y pon el orden del endpoint en `order_position`. El `Table` busca por `id` y no reordena lo paginado.

```js
const tableRows = useMemo(() => (
  itemOrder.reduce((rows, id, index) => {
    const row = items[id];
    if (!row) return rows;
    rows[id] = { ...row, order_position: index, is_item: true };
    return rows;
  }, {})
), [itemOrder, items]);
```

9. Pasa al `Table` `onReachBottom={loadMore}`, `isLoadingMore` y `hasMore`:

```jsx
<Table
  title={`Listado (${itemCount || 0})`}
  rows={tableRows}
  columns={getColumns()}
  isLoading={isFetching}
  onReachBottom={loadMore}
  isLoadingMore={isLoadingMore}
  hasMore={hasMore}
  sort={(left, right) => (left.order_position ?? 0) - (right.order_position ?? 0)}
/>
```

10. En un `useEffect` del componente de la ruta, llama `applySearch({})` (o los filtros iniciales) para la primera carga.

El pie “Cargando más…” lo muestra el `Table` si no pasas `bottomToolbar`.

#### Orden por columna

El sort nativo del `Table` solo reordena las filas ya cargadas. El orden tiene que pedirse al endpoint.

11. En rutas nuevas, pasa `onSortChange={applySort}` al `Table`. Recibe `{ field, direction }`; cada `field` debe existir en el mapa del backend.

En fivebim-app también puedes usar `buildServerSortColumn` y `resolveNextSortDirection` de `ServerSortHeader`:

```js
const handleServerSort = (field) => applySort({
  field,
  direction: resolveNextSortDirection(activeSort, field),
});
```
