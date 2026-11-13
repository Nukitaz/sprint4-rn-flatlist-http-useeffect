# Práctica Sprint 4 · FlatList, peticiones HTTP y `useEffect`

App móvil **Rick and Morty Explorer** hecha con React Native + Expo. Tu trabajo es completar el proyecto base (el "cascarón") para que consuma una API real y muestre los datos en una lista eficiente.

## ¿Qué vas a practicar?

| Tema del Sprint 4 | Dónde lo aplicas |
|---|---|
| **Peticiones HTTP** | `src/services/charactersService.js` (`fetch`, códigos de estado, errores) |
| **`useEffect`** | `src/screens/CharactersScreen.js` (carga inicial, dependencias, limpieza) |
| **`FlatList`** | `src/screens/CharactersScreen.js` (render, paginación, pull to refresh, lista vacía) |

## Requisitos

- Node.js (versión LTS) y npm
- Git y una cuenta de GitHub
- La app **Expo Go** en tu teléfono (o un emulador Android / simulador iOS)
- Un editor de código (VS Code recomendado)

## Cómo arrancar

```bash
# 1. Clona tu copia del repositorio y entra a la carpeta
git clone <URL-de-tu-repo>
cd sprint4-rn-flatlist-http-useeffect

# 2. Instala dependencias
npm install

# 3. Instala las librerías que dependen de la versión de Expo (elige la versión compatible automáticamente)
npx expo install react react-native expo-status-bar react-native-safe-area-context

# 4. Inicia el servidor y escanea el QR con Expo Go
npx expo start
```

Si todo salió bien verás el título **Rick and Morty** y un texto de relleno. Ese es el punto de partida.

> **¿Expo Go dice que la versión del SDK no coincide?** Expo Go se actualiza solo al SDK más reciente. Ejecuta `npx expo install expo@latest --fix` y vuelve a iniciar.

## Estructura del proyecto

```
├── GUIA_ALUMNO.md                  ← 👈 empieza aquí (instrucciones paso a paso)
├── PREGUNTAS_REFLEXION.md          ← ✍️ aquí contestas las preguntas (viene en blanco)
├── App.js                          ✅ ya viene hecho
├── index.js                        ✅ ya viene hecho
└── src/
    ├── config/constants.js         ✅ URL de la API, colores, tiempo de debounce
    ├── components/
    │   ├── CharacterCard.js        ✅ tarjeta de un personaje
    │   └── StateMessage.js         ✅ mensaje centrado con botón opcional
    ├── services/
    │   └── charactersService.js    ✍️ LO PROGRAMAS TÚ (Paso 2)
    └── screens/
        └── CharactersScreen.js     ✍️ LO PROGRAMAS TÚ (Pasos 3 al 10)
```

## Cómo trabajar

1. Lee `GUIA_ALUMNO.md` y avanza **en orden**: cada paso se apoya en el anterior.
2. Haz **un commit por paso** con un mensaje claro.
3. Responde las preguntas de reflexión en `PREGUNTAS_REFLEXION.md`.
4. Al terminar, abre un **Pull Request** hacia `main`; la plantilla trae el checklist de entrega.

## API utilizada

[Rick and Morty API](https://rickandmortyapi.com/documentation): pública, gratuita y sin autenticación. Antes de empezar, abre en tu navegador `https://rickandmortyapi.com/api/character` para confirmar que responde.
