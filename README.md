# Table-PKG

Componente clave para la representación de información en formato de Tabla simple o Tabla tipo arbol.

## Como linkear componente para trabajo local

Si estas trabajando localmente y necesitas hacer actualizaciones al componente de Tabla vas a necesitar 'linkear' el componente a tu proyecto. Esto se necesita para evitar tener que publicar una nueva version de la tabla y que tengas que actualizar tus dependencias en tu proyecto.

Para linkear, únicamente es necesario realizar lo siguiente:
1. Do "yarn link" root folder of this repository.
2. Do the follow command in the app: "yarn link @hermosillo-i3/table-pkg"

A partir de ahora, se pueden realizar cambios en los componentes de la carpeta src dentro de la aplicacion sin necesidad de ejecutar run build-ws o run build.

## Storybook

Este componente cuenta con una página en storybook para mostrar casos de uso.

URL: https://hermosillo-i3.github.io/table-pkg

Pará más información revisa esta documentación: https://www.evernote.com/shard/s683/sh/d6971c8b-a9cf-112f-7333-97805c1cb8b6/VU7FSmRXOu4qyu40JPc6yGBerNIFGEGf27SMIMB5ticOkTTH_WfEvrXUXg