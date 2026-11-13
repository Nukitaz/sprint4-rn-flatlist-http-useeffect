# Guía del alumno · Práctica Sprint 4

**FlatList · Peticiones HTTP · `useEffect`**
App: *Rick and Morty Explorer* (React Native + Expo)

⏱️ Duración estimada: 3 horas

---

## 🎯 Qué vas a construir

Una app que:

1. Pide personajes a una API real y los muestra en una lista.
2. Muestra un indicador mientras carga y un mensaje con botón de reintento si falla.
3. Carga más personajes automáticamente al llegar al final de la lista (**paginación infinita**).
4. Permite actualizar con el gesto de **jalar hacia abajo** (*pull to refresh*).
5. Permite **buscar por nombre** sin saturar la API (*debounce*).

## 🧭 Mapa de pasos

| Paso | Qué haces | Tema principal |
|---|---|---|
| 0 | Preparar el entorno y ejecutar la app base | Setup |
| 1 | Explorar la API antes de programar | HTTP |
| 2 | Crear la función que pide los datos | **Peticiones HTTP** |
| 3 | Declarar el estado de la pantalla | `useState` |
| 4 | Cargar los datos al abrir la pantalla | **`useEffect`** |
| 5 | Mostrar los personajes | **`FlatList`** |
| 6 | Estados de carga y error, con reintento | HTTP + `useEffect` |
| 7 | Separador y lista vacía | **`FlatList`** |
| 8 | Paginación infinita | **`FlatList`** + HTTP |
| 9 | Pull to refresh | **`FlatList`** |
| 10 | Búsqueda con debounce | **`useEffect`** (dependencias y limpieza) |
| 11 | Revisión final y entrega | Git / GitHub |

## 📚 Documentación para consultar

- FlatList: https://reactnative.dev/docs/flatlist
- Networking en React Native: https://reactnative.dev/docs/network
- `fetch` (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- `useEffect`: https://react.dev/reference/react/useEffect
- API de Rick and Morty: https://rickandmortyapi.com/documentation

## 🧩 Cómo usar esta guía

- Cada paso tiene **objetivo**, **qué debes hacer**, **cómo comprobar que quedó bien** y, a veces, una **pista** desplegable. Intenta primero sin abrir la pista.
- Los archivos ya tienen comentarios `TODO Paso N` que te indican dónde trabajar.
- Esta guía **no trae el código**: deducirlo a partir de la documentación es parte de la práctica.
- Haz un **commit por paso**. Formato sugerido: `feat(paso-4): carga inicial con useEffect`.
- Cuando veas **🧠 Reflexión**, contesta en `PREGUNTAS_REFLEXION.md` antes de pasar al siguiente paso.

---

## Paso 0 · Preparar el entorno

**Objetivo:** tener la app base corriendo en tu teléfono o emulador.

**Qué debes hacer**

1. Clona tu copia del repositorio, instala dependencias e inicia el servidor siguiendo el `README.md`.
2. Abre la app con Expo Go (o con tu emulador).
3. Recorre los archivos del proyecto y fíjate en cuáles dicen **✅ YA VIENE HECHO** y cuáles **✍️ LO PROGRAMAS TÚ**.
4. Abre `CharacterCard.js` y `StateMessage.js`: lee qué **props** recibe cada uno. Los vas a usar más adelante.

**✅ Cómo sé que está bien**
- Ves el título "Rick and Morty" y un texto de relleno, sin errores rojos.

**Commit sugerido:** `chore: proyecto base funcionando`

---

## Paso 1 · Explorar la API

**Objetivo:** entender qué datos llegan **antes** de escribir código. Siempre se hace así al integrar una API.

**Qué debes hacer**

Abre estas direcciones en el navegador (o en Postman / Thunder Client) y observa la respuesta:

| # | Dirección | Qué observar |
|---|---|---|
| 1 | `https://rickandmortyapi.com/api/character` | Estructura general de la respuesta |
| 2 | `https://rickandmortyapi.com/api/character?page=2` | Cómo cambia `info` |
| 3 | `https://rickandmortyapi.com/api/character?name=rick` | Cómo funciona el filtro |
| 4 | `https://rickandmortyapi.com/api/character?name=zzzzzz` | Qué responde cuando no hay coincidencias |

Para el punto 4 necesitas ver también el **código de estado HTTP**. En el navegador, abre las herramientas de desarrollador → pestaña *Network*.

La respuesta tiene dos bloques principales. **Descubre tú qué contiene cada uno** (no todo sirve para esta práctica):

```json
{
  "info": { ... },
  "results": [ { ... } ]
}
```

**✅ Cómo sé que está bien**
- Completaste la tabla de **Paso 1** en `PREGUNTAS_REFLEXION.md`.

**Commit sugerido:** `docs(paso-1): notas sobre la API`

---

## Paso 2 · La función que pide los datos (HTTP)

**Objetivo:** aislar la comunicación con la API en un solo lugar, separada de la interfaz.

**Archivo:** `src/services/charactersService.js`

**Qué debes hacer**

Implementa `getCharacters` respetando este contrato:

- **Recibe** un objeto con `page` (por defecto 1) y `name` (por defecto texto vacío).
- **Devuelve** (como promesa) un objeto con:
  - `results`: el arreglo de personajes.
  - `hasNextPage`: `true` si la API indica que existe una página siguiente, `false` si no.

**Reglas que debe cumplir**

1. La dirección se arma con la URL base de `constants.js`, la ruta de personajes y el número de página.
2. El parámetro de búsqueda se agrega **solo si** el texto no está vacío (ignora espacios al inicio y al final) y debe ir **codificado** para que caracteres como espacios o acentos no rompan la URL.
3. Usa `fetch` con `async/await` y convierte la respuesta a objeto JavaScript.
4. Lo que descubriste en el Paso 1 (punto 4) sobre una búsqueda sin coincidencias **no debe tratarse como un error de la app**: significa "sin resultados". En ese caso devuelve una lista vacía y `hasNextPage` en `false`.
5. Para cualquier otra respuesta que no sea exitosa, **lanza un `Error`** con un mensaje comprensible que incluya el código recibido.
6. Si falla la red, el error de `fetch` debe seguir de largo (no lo captures aquí; la pantalla lo atenderá).

**✅ Cómo sé que está bien**
- Aún no se ve nada en pantalla, así que pruébala de forma temporal: llámala **a nivel de archivo** en `CharactersScreen.js` (fuera del componente, para que se ejecute una sola vez), muestra el resultado con `console.log` y revisa la terminal donde corre Expo. Bórralo al terminar la prueba.
- Probaste: página 1, página 2, un nombre existente y un nombre inventado.

<details>
<summary>💡 Pista</summary>

- Consulta en la documentación de `fetch` **cuándo** se rechaza su promesa y cuándo no, y revisa qué propiedades de `Response` describen el resultado HTTP (el código numérico y un indicador de éxito).
- Para codificar texto en una URL existe una función global de JavaScript que empieza con `encode...`.
</details>

**🧠 Reflexión:** contesta la pregunta del Paso 2 en `PREGUNTAS_REFLEXION.md`.

**Commit sugerido:** `feat(paso-2): servicio getCharacters con fetch`

---

## Paso 3 · Estado de la pantalla

**Objetivo:** decidir qué información "vive" en la pantalla y cambia con el tiempo.

**Archivo:** `src/screens/CharactersScreen.js`

**Qué debes hacer**

Declara tres estados con el hook de estado de React:

| Estado | Para qué | Valor inicial |
|---|---|---|
| Personajes | La lista que se mostrará | Arreglo vacío |
| Carga | Si estamos esperando respuesta | Verdadero (la pantalla arranca cargando) |
| Error | Mensaje si algo falló | Nada (sin error) |

Agrega los `import` que necesites (de `react` y del servicio).

**✅ Cómo sé que está bien**
- La app sigue funcionando igual que antes, sin errores ni advertencias.

**🧠 Reflexión:** contesta la pregunta del Paso 3.

**Commit sugerido:** `feat(paso-3): estados de la pantalla`

---

## Paso 4 · Primera carga con `useEffect`

**Objetivo:** pedir los datos **cuando la pantalla aparece**, no en cada render.

**Qué debes hacer**

1. Usa `useEffect` para llamar a `getCharacters` una sola vez al montar la pantalla.
2. Cuando llegue la respuesta, guarda los personajes en el estado.
3. Si falla, guarda el mensaje de error en el estado.
4. Pase lo que pase (éxito o error), marca que **terminó la carga**.
5. Necesitas esperar la respuesta con `await`. Antes de escribir el efecto, lee en la documentación qué espera React que **devuelva** la función que le pasas a `useEffect`.
6. Decide qué poner en el **arreglo de dependencias** para que el efecto se ejecute solo al montar.

**✅ Cómo sé que está bien**
- Agrega un `console.log` dentro del efecto: en la terminal debe aparecer **una sola vez** por carga de la app.
- Muestra en consola cuántos personajes llegaron: debe coincidir con lo que observaste en el Paso 1.

<details>
<summary>💡 Pista</summary>

Si tu `console.log` aparece muchas veces seguidas, revisa el arreglo de dependencias y relee en la documentación **cuándo** se ejecuta un efecto.
</details>

**🧠 Reflexión:** contesta las tres preguntas del Paso 4.

**Commit sugerido:** `feat(paso-4): carga inicial con useEffect`

---

## Paso 5 · Mostrar los personajes con `FlatList`

**Objetivo:** mostrar los personajes en pantalla con el componente de listas de React Native.

**Qué debes hacer**

1. Quita el texto de relleno y coloca un `FlatList`.
2. Indícale tres cosas fundamentales: **de dónde salen los datos**, **cómo dibujar cada elemento** (usa `CharacterCard`) y **cómo identificar cada elemento de forma única**.
3. Para la identificación única usa el `id` que trae la API. Fíjate en el tipo de dato que espera React.
4. Aplícale el estilo `listContent` al contenido de la lista para que el último elemento no quede pegado al borde.
5. **No** envuelvas el `FlatList` en un `ScrollView`.

**✅ Cómo sé que está bien**
- Ves las tarjetas de la primera página con foto, nombre, estado y especie.
- Puedes desplazarte hasta la última sin que se corte.
- No aparece ninguna advertencia amarilla sobre *keys*.

<details>
<summary>💡 Pista</summary>

En la documentación de `FlatList`, busca las props llamadas `data`, `renderItem` y `keyExtractor`. Observa qué recibe `renderItem`: no es el elemento directamente, sino un objeto que **contiene** el elemento.
</details>

**🧠 Reflexión:** contesta las dos preguntas del Paso 5.

**Commit sugerido:** `feat(paso-5): lista de personajes con FlatList`

---

## Paso 6 · Estados de carga y error

**Objetivo:** manejar los tres resultados posibles de una petición: cargando, error y éxito.

**Qué debes hacer**

1. Mientras la pantalla está **cargando**, muestra un indicador de actividad (usa el estilo `loader` y el color primario de `COLORS`) en lugar de la lista.
2. Si hubo **error y no hay personajes**, muestra `StateMessage` con el texto del error y un botón **"Reintentar"**.
3. Al presionar "Reintentar" debe **volver a ejecutarse la carga inicial**. Piensa: *¿qué cosa puede cambiar para que React vuelva a correr un efecto?* Necesitarás un estado nuevo que participe en el arreglo de dependencias.
4. Al comenzar cada carga, el efecto debe volver a poner "cargando" en verdadero y borrar el error anterior.

**✅ Cómo sé que está bien**
- Prueba el error: activa el **modo avión** (o apaga el Wi-Fi), recarga la app y verifica que aparece el mensaje con el botón.
- Reactiva la red, presiona "Reintentar" y comprueba que aparece el spinner y luego la lista.

<details>
<summary>💡 Pista</summary>

Un contador que aumenta en 1 cada vez que se presiona el botón es una forma sencilla de "avisarle" a un efecto que debe volver a ejecutarse.
</details>

**🧠 Reflexión:** contesta la pregunta del Paso 6.

**Commit sugerido:** `feat(paso-6): estados de carga y error con reintento`

---

## Paso 7 · Pulir la lista: separador y lista vacía

**Objetivo:** conocer los componentes decorativos que ofrece `FlatList`.

**Qué debes hacer**

1. Agrega un **separador** entre tarjetas usando el estilo `separator`. Defínelo **fuera** del componente de la pantalla para que no se recree en cada render.
2. Agrega un **componente para lista vacía** que use `StateMessage` con un texto claro (por ejemplo, que no hay personajes que mostrar).

**✅ Cómo sé que está bien**
- Entre cada tarjeta hay un pequeño espacio.
- Para ver la lista vacía, reemplaza temporalmente el arreglo de datos por uno vacío; debe aparecer tu mensaje. Revierte el cambio.

<details>
<summary>💡 Pista</summary>

Busca en la documentación las props de `FlatList` que terminan en `Component`.
</details>

**Commit sugerido:** `feat(paso-7): separador y lista vacía`

---

## Paso 8 · Paginación infinita

**Objetivo:** cargar más datos solo cuando el usuario los necesita.

**Qué debes hacer**

1. Agrega estados para: **página actual**, **si existe página siguiente** y **si se están cargando más elementos** (distinto a la carga inicial).
2. Ajusta tu carga inicial para que también guarde la página 1 y si hay página siguiente.
3. Crea una función que **cargue la página siguiente**. Debe:
   - Decidir, antes de pedir datos, **en qué situaciones no tiene sentido ejecutarse** (piensa en qué puede estar pasando en la pantalla en ese momento y qué sabes sobre la API).
   - Pedir la página `actual + 1`.
   - **Agregar** los nuevos personajes al final de la lista existente, sin perder los anteriores (crea un arreglo nuevo, no modifiques el anterior).
   - Actualizar página actual y "hay siguiente".
   - Si falla, guardar el error sin borrar los personajes ya cargados.
4. Conecta esa función al `FlatList` para que se dispare cuando el usuario **se acerque al final** (a la mitad de una pantalla de distancia).
5. Muestra un **indicador de actividad al final de la lista** mientras se cargan más elementos y, si hubo error, el texto con el estilo `footerError`.

**✅ Cómo sé que está bien**
- Al bajar hasta el final aparece un spinner y se agregan más personajes a la lista, sin perder los anteriores.
- No se repiten personajes ni aparece la advertencia de *keys* duplicadas.
- Con un `console.log` en tu función comprueba que **no se dispara varias veces seguidas** para la misma página.

<details>
<summary>💡 Pista</summary>

En la documentación de `FlatList` busca las props `onEndReached`, `onEndReachedThreshold` y `ListFooterComponent`. Usa un `console.log` dentro de tu función para observar **cuántas veces** se ejecuta mientras te desplazas.
</details>

**🧠 Reflexión:** contesta la pregunta del Paso 8.

**Commit sugerido:** `feat(paso-8): paginación infinita`

---

## Paso 9 · Pull to refresh

**Objetivo:** permitir actualizar la lista con el gesto de jalar hacia abajo.

**Qué debes hacer**

1. Agrega un estado propio para indicar que se está **actualizando**.
2. Crea una función que vuelva a pedir la **página 1**, **reemplace** toda la lista, reinicie la página actual y "hay siguiente", y por último marque que terminó de actualizar (haya salido bien o mal).
3. Conéctala al `FlatList` con las dos props que controlan el gesto: una que dice **si está actualizando** y otra que dice **qué hacer al jalar**.
4. Evita que "cargar más" se ejecute mientras se está actualizando.

**✅ Cómo sé que está bien**
- Jalas desde arriba, aparece el indicador nativo, y la lista vuelve a mostrar solo los personajes de la primera página.
- Tras actualizar, la paginación sigue funcionando.

<details>
<summary>💡 Pista</summary>

Piensa en qué ve el usuario durante la carga inicial y qué ve durante una actualización, y en qué se diferencian.
</details>

**🧠 Reflexión:** contesta la pregunta del Paso 9.

**Commit sugerido:** `feat(paso-9): pull to refresh`

---

## Paso 10 · Búsqueda con debounce

**Objetivo:** buscar por nombre sin lanzar una petición por cada letra. Aquí practicas lo más importante de `useEffect`: **dependencias y limpieza**.

**Qué debes hacer**

1. Agrega un **campo de texto** debajo del título (estilo `input`, texto de ayuda con color atenuado, sin autocorrección).
   - Colócalo **fuera** de la parte que cambia entre spinner / error / lista; si no, se desmonta al cargar y se cierra el teclado.
2. Necesitas **dos estados de texto**:
   - Uno con **lo que el usuario escribe** (cambia en cada tecla).
   - Otro con **el texto que realmente se usa para buscar** (cambia solo cuando el usuario deja de escribir un momento).
3. Crea un **segundo `useEffect`** que se ejecute cuando cambie lo que el usuario escribe. Dentro programa un temporizador (usa `DEBOUNCE_MS`) que copie el texto al segundo estado. Si el usuario sigue escribiendo, **el temporizador anterior no debe llegar a ejecutarse**.
4. Modifica tu **efecto de carga inicial** para que dependa del texto de búsqueda "ya esperado". Así, cada búsqueda nueva vuelve a empezar desde la página 1 con la lista reemplazada. Envía el texto a `getCharacters`.
5. Haz tu app robusta ante peticiones lentas: si el usuario cambia la búsqueda mientras una petición anterior sigue en camino, la pantalla debe terminar mostrando **los resultados de la búsqueda más reciente**.
6. Haz que "cargar más" y "actualizar" también usen el texto de búsqueda vigente.

**✅ Cómo sé que está bien**
- Escribe "rick" **rápido**: en la terminal (con un `console.log` temporal en el servicio) debe verse **una sola petición**, aproximadamente medio segundo después de dejar de escribir.
- Escribe un nombre inventado: aparece tu mensaje de **lista vacía**, **no** un error.
- Borra el texto: vuelve la lista completa desde la página 1.
- Con una búsqueda activa, la paginación sigue funcionando con ese filtro.

<details>
<summary>💡 Pista 1 · Debounce</summary>

Lee en la documentación de `useEffect` la sección sobre la **función de limpieza** y fíjate en **cuándo** se ejecuta respecto al efecto siguiente.
</details>

<details>
<summary>💡 Pista 2 · Respuestas fuera de orden</summary>

Piensa qué pasaría si dos peticiones terminan en distinto orden del que se lanzaron, y qué podrías recordar dentro del efecto para saber, cuando llega una respuesta, si todavía te corresponde usarla.
</details>

**🧠 Reflexión:** contesta las tres preguntas del Paso 10.

**Commit sugerido:** `feat(paso-10): búsqueda con debounce y limpieza de efectos`

---

## Paso 11 · Revisión final y entrega

**Qué debes hacer**

1. Elimina los `console.log` de depuración y el código comentado que ya no uses.
2. Recorre tu código y verifica que cada `useEffect` tenga un arreglo de dependencias correcto.
3. Revisa el checklist de la plantilla de Pull Request.
4. Completa `PREGUNTAS_REFLEXION.md`, incluida la sección **Cierre**.
5. Sube tus commits y abre un **Pull Request** hacia `main` con una captura o GIF de tu app funcionando.

**✅ Autoevaluación final**

- [ ] La app arranca sin errores ni advertencias
- [ ] Los datos se piden desde un servicio, no desde el componente
- [ ] Cada petición controla la búsqueda sin resultados y los errores de red
- [ ] No hay efectos que se ejecuten en bucle
- [ ] La lista usa `keyExtractor`, separador y mensaje de lista vacía
- [ ] La paginación no duplica personajes ni se dispara varias veces
- [ ] Pull to refresh funciona y deja la paginación operativa
- [ ] La búsqueda hace una sola petición al dejar de escribir
- [ ] Hice un commit por paso

---

## 🚀 Retos opcionales (puntos extra)

| Reto | Descripción |
|---|---|
| **A · Cancelar peticiones** | Investiga `AbortController` y úsalo para **cancelar** realmente la petición anterior cuando cambia la búsqueda. |
| **B · Dos columnas** | Muestra los personajes en una cuadrícula de 2 columnas (investiga la prop de `FlatList` para columnas y adapta la tarjeta). |
| **C · Rendimiento** | Investiga `React.memo` y evita que las tarjetas se redibujen sin necesidad. |
| **D · Detalle** | Al tocar una tarjeta, abre una pantalla con los datos del personaje pidiendo `/character/{id}` en un `useEffect` que dependa del `id`. |
| **E · Filtro por estado** | Agrega botones "Alive / Dead / unknown" que se combinen con la búsqueda por nombre (la API soporta el parámetro `status`). |
