# Scroll infinito en Table

Requisito: `@hermosillo-i3/table-pkg` **≥ 1.18.29**.

## Cómo funciona

El `Table` de `@hermosillo-i3/table-pkg` no carga todo el listado de golpe. Pide **tandas** (por defecto 50 filas) y, al llegar al final, pide la siguiente.

Las piezas son:

- **`Table`:** el componente de tabla. Avisa cuando el scroll llega al final (`onReachBottom`).
- **`useTableInfiniteScroll`:** el hook de `table-pkg` que guarda las filas ya cargadas, el orden y el cursor. Lo usas en el componente de la ruta (por ejemplo `precalificacion/index.js`).
- **`fetchPage`:** la función que escribes en ese mismo componente. Habla con la action de Redux / el endpoint y traduce la respuesta.
- **Endpoint (fivebim-api o el microservicio):** arma la tanda con `fetchCursorPage` (utils-pkg): filtros, sort y cursor, y devuelve `next_cursor`.

El flujo:

1. El componente de la ruta llama `applySearch` (primera carga o filtros) o `applySort` (clic en una columna). `useTableInfiniteScroll` pide la **primera tanda** con `cursor: null` a través de `fetchPage`.
2. El endpoint responde con esas filas, un `total_count` y un `next_cursor` (o `null` si ya no hay más).
3. `useTableInfiniteScroll` guarda las filas **por id** y el **orden** que mandó el endpoint. El `Table` las muestra así, sin reordenarlas.
4. Cuando el usuario **baja** (rueda, teclas o scrollbar) y llega al final, el `Table` llama `onReachBottom` → `useTableInfiniteScroll` pide la siguiente tanda. Un `scroll` de layout o solo horizontal no pide otra tanda.
5. Las filas nuevas se **agregan** debajo. Un clic en columna vuelve al paso 1 con el nuevo sort: el endpoint reordena **todo** el listado, no solo lo que ya se ve.

`table-pkg` no conoce modelos, Redux ni URLs. Cada ruta aporta filtros, `fetchPage` y el mapa de columnas ordenables.

---

## ¿Cómo incluir Scroll Infinito a una Tabla?

### 1. Backend

Requisito: `@hermosillo-i3/utils-pkg` **≥ 1.22.16**.

1. Haz que el endpoint acepte, además de los filtros de la ruta, `limit` (típicamente 50), `cursor` (`null` en la primera tanda) y `sort.field` / `sort.direction` (`ASC` o `DESC`).
2. Devuelve siempre este contrato. `next_cursor` va en `null` cuando no hay más filas:

```js
{
  items: [...], // o el nombre de tu recurso
  next_cursor: { field, direction, value, id } | null,
  total_count: 123,
}
```

3. En la action de Redux, reenvía `filters`, `limit`, `cursor` y `sort`. Si el cursor va por query (GET), serialízalo con `JSON.stringify`. Si va en body (POST), mándalo como objeto.

#### Helpers de `cursorPagination` (utils-pkg)

Importa desde `@hermosillo-i3/utils-pkg/src/cursorPagination`.

`fetchCursorPage` ya hace el `count`, el `findAll` y arma el `next_cursor`. En tu módulo solo pasas el modelo, los filtros (`where`) y el sort. Si vuelves a escribir `count` / `findAll` / `next_cursor` a mano, estás duplicando lo que el helper ya cubre.

| Función | Qué hace |
|---|---|
| **`fetchCursorPage`** | Arma una tanda: cuenta **sin** cursor (`total_count`), aplica el `where` del cursor, `findAll` con `limit + 1`, recorta la página y devuelve `{ items, next_cursor, total_count }`. |
| **`resolveListSortConfig`** | Traduce `sort.field` / `sort.direction` con el mapa `sortFields`. Si el campo no existe, usa el default (p. ej. `created_at`). |
| **`buildCursorWhere`** | `where` que continúa después del cursor. En DESC incluye filas sin valor (`NULL`, p. ej. estatus abierto). |
| **`buildSortOrder`** | `ORDER BY` de la columna o el join, siempre desempatando por `id`. |
| **`buildNextCursor`** | Cursor de la siguiente tanda a partir de la última fila (`field`, `direction`, `value`, `id`). |

Cuando el sort **no** es una columna de la tabla ni un join, `fetchCursorPage` no puede armar el `ORDER BY` ni el cursor solo. En ese caso le pasas **hooks**: funciones opcionales que sustituyen el comportamiento por default.

| Hook | Cuándo pasarlo |
|---|---|
| `buildOrder` | El `ORDER BY` no es una columna/join (SQL literal). |
| `buildCursorWhere` | El `where` del cursor tampoco es una columna/join. |
| `resolveNextCursorValue` | El valor del cursor no está en la fila (está en un join) o hay que serializarlo (fecha ISO, etiqueta de catálogo). |
| `formatPage` | Hay que aplanar o hidratar las filas antes de responder. |

Opciones de Sequelize que también se pasan a `fetchCursorPage` (no son hooks): `include`, `attributes`, `findAllOptions` (p. ej. `subQuery: false` cuando hay join).

#### Mapa de columnas ordenables

4. En el módulo, crea un mapa `sortFields`: cada `field` que el usuario pueda ordenar se traduce a columna o join de Sequelize.

```js
const sortFields = {
  created_at: { column: 'created_at', association: null, model: null },
  name: { column: 'name', association: null, model: null },
  supplier_name: { column: 'name', association: 'contact', model: Contact },
};
```

#### Función de listado

5. El controller (o un util corto del módulo) arma los **filtros** y llama a `fetchCursorPage`. Un listado de columnas reales queda así:

```js
const {
  fetchCursorPage,
  resolveListSortConfig,
} = require('@hermosillo-i3/utils-pkg/src/cursorPagination');

const sortConfig = resolveListSortConfig({
  sort: { field: query.sort_field, direction: query.sort_direction },
  sortFields,
});

const { items, next_cursor, total_count } = await fetchCursorPage({
  model: ChangeOrder,
  where: { project_id: query.project_id },
  sortConfig,
  cursor: query.cursor,
  limit: query.limit,
});
```

Preca y reportes de seguridad usan el mismo `fetchCursorPage`. En esos utils solo queda lo de dominio: `where` de filtros, mapa `sortFields`, y los hooks de sort especial (SQL de `form_data` en preca, ranking de riesgo en reportes).

#### Columnas especiales

Usa el default de `fetchCursorPage` (`buildCursorWhere` / `buildSortOrder`) cuando el valor es **una columna o un join** (fecha, código, tipo, UEN, estatus que es una fecha/`NULL`).

Si una columna ordena con SQL especial o un valor específico del modelo (nivel de riesgo en Reportes de Seguridad, nombre en preca), pásalo en los hooks `buildOrder` / `buildCursorWhere` del módulo. Fechas ISO del cursor y etiquetas de catálogo también se resuelven ahí (`resolveNextCursorValue`).

Si el valor del cursor vive en una asociación (no en la fila), pásalo con el hook `resolveNextCursorValue`.

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
  pageSize: 50,
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
