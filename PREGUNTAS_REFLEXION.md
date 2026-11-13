# Preguntas de reflexión

_Escribe tus respuestas debajo de cada pregunta._

**Alumno:** Kevin Jair Nuño Trujillo

---

## Paso 1 · Explorando la API

| Pregunta | Mi respuesta |
|---|---|
| ¿Cuántos personajes trae cada página? | 20 personajes por página. |
| ¿Qué campo me dice si existe una página siguiente? | El campo `info.next` (contiene la URL de la siguiente página). |
| ¿Qué valor tiene ese campo en la última página? | `null`. |
| ¿Qué código HTTP devuelve una búsqueda sin resultados? | Código `404` (Not Found) con el cuerpo `{"error": "There is nothing here"}`. |
| ¿Qué campos del personaje usa `CharacterCard`? | `name`, `status`, `species` e `image` (además de `id` como key en la lista). |

## Paso 2 · Petición HTTP

**¿Qué diferencia hay entre que `fetch` "falle" y que el servidor responda con un error? ¿Qué debo revisar en la respuesta?**

> `fetch` solo rechaza su promesa cuando ocurre un fallo de red (por ejemplo, sin conexión a internet o DNS caído). Si el servidor responde con un error HTTP (como `404` o `500`), `fetch` resuelve la promesa normalmente, por lo que debemos revisar manualmente la propiedad `response.ok` o el código numérico `response.status`.

## Paso 3 · Estado

**¿Por qué guardo los personajes en estado y no en una variable normal?**

> Porque una variable normal se reinicia cada vez que el componente se vuelve a renderizar y modificarla no le avisa a React que debe actualizar la interfaz. Guardar los datos en `useState` conserva el arreglo entre renders y dispara un nuevo renderizado automático cuando llegan los datos.

## Paso 4 · useEffect

1. **¿Qué pasa si omito por completo el arreglo de dependencias?**

> El efecto se ejecutará después de **cada** renderizado del componente, lo que provoca un bucle infinito de peticiones HTTP porque actualizar el estado dentro del efecto vuelve a disparar un nuevo render.

2. **¿Qué significa dejar el arreglo vacío?**

> Significa que el efecto no depende de ningún estado ni prop, por lo que React lo ejecutará **una sola vez** cuando el componente se monte en pantalla.

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

> Porque toda función `async` devuelve implícitamente una `Promise`, mientras que `useEffect` espera que el valor de retorno sea `undefined` o una función de limpieza (*cleanup*). Por eso se define una función `async` interna y se invoca dentro del efecto.

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> `keyExtractor` le proporciona a React un identificador único (`string`) para cada ítem de la lista, permitiéndole rastrear qué elementos cambiaron, se agregaron o se eliminaron sin tener que reconstruir toda la lista.

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> `ScrollView` renderiza todos los elementos en memoria de golpe aunque no estén visibles, lo que degrada el rendimiento con listas largas o paginadas. `FlatList` virtualiza la lista y renderiza únicamente los elementos visibles en pantalla más un pequeño margen, ahorrando memoria y CPU.

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> Porque le comunica claramente al usuario qué ocurrió (feedback visual) y le ofrece una acción directa para recuperarse del fallo sin tener que cerrar y volver a abrir la aplicación.

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> Se lanzarían múltiples peticiones simultáneas para la misma página, duplicando personajes en el arreglo y generando errores de llaves duplicadas (`duplicate keys`). Lo evité verificando al inicio de la función si ya está cargando (`isLoadingMore`), si está refrescando (`refreshing`), o si no hay más páginas (`!hasNextPage`).

## Paso 9 · Pull to refresh

**¿Por qué usé un estado distinto (`refreshing`) y no el mismo de la carga inicial?**

> Porque durante la carga inicial se oculta la lista para mostrar un spinner centrado en toda la pantalla, mientras que en el *pull to refresh* la lista actual debe permanecer visible en pantalla mientras se muestra únicamente el indicador nativo superior de actualización.

## Paso 10 · Búsqueda

1. **¿Qué es el debounce y qué problema resuelve?**

> Es una técnica que retrasa la ejecución de una acción hasta que pasa un tiempo determinado sin que el usuario realice nuevos cambios. Evita saturar la API con decenas de peticiones innecesarias por cada letra que el usuario teclea.

2. **¿Para qué sirve la función de limpieza (cleanup) que se devuelve en un `useEffect`? Da un ejemplo de esta práctica.**

> Sirve para cancelar tareas pendientes o suscripciones antes de que el efecto vuelva a ejecutarse o cuando el componente se desmonte. En esta práctica se usa para ejecutar `clearTimeout(timerId)` y cancelar el temporizador anterior si el usuario escribe otra letra antes de los 500 ms.

3. **Si el usuario escribe rápido y las respuestas llegan en desorden, ¿qué podría salir mal?**

> Una petición anterior más lenta podría resolverse después de una búsqueda más reciente y sobrescribir la lista con resultados desactualizados que no coinciden con lo que está escrito en el buscador.

## Cierre

**Menciona dos mejoras que le harías a la app si tuvieras una hora más:**

> 1. Agregar una pantalla de detalle al presionar cada tarjeta (`CharacterCard`) para mostrar el origen, ubicación actual y lista de episodios del personaje.
> 2. Añadir filtros rápidos mediante botones (*pills*) para filtrar por estado (`Alive`, `Dead`, `unknown`) combinados con la barra de búsqueda.