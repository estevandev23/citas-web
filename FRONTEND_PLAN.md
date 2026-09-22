# Plan frontend — Next.js + TypeScript

## Punto de partida

`citas-web` aún no contiene una aplicación, rutas ni `package.json`. La decisión registrada para el curso es Next.js + TypeScript; la UI se debe importar desde Google AI Studio después de la aprobación visual y luego reconciliarse, no recrearse desde cero. La referencia visual disponible es `styles/auth.module.css` (Clinical Trust).

El frontend consumirá `citas-api` directamente por REST. La URL se expondrá solo como `NEXT_PUBLIC_API_URL`; no habrá Express, BFF, secretos ni reglas de negocio duplicadas.

## Fundaciones previas

1. Importar el proyecto exportado por Google AI Studio y confirmar App Router, TypeScript, comandos de build/typecheck/test y la ubicación de estilos.
2. Incorporar los tokens de `styles/auth.module.css` como fuente de la apariencia de autenticación: lienzo claro, superficies blancas, azul `#0051d5`, azul marino `#001428`, tipografía Plus Jakarta Sans, controles de 44 px y foco visible.
3. Crear un cliente REST tipado que lea `NEXT_PUBLIC_API_URL`, normalice los errores `code/message/fields` y no conozca detalles de negocio.
4. Definir con el orquestador el mecanismo de custodia de refresh. El contrato actual lo retorna en JSON; antes de persistirlo en navegador se requiere una decisión de seguridad cross-repo. Nunca se guardará ningún secreto de servidor en el cliente.
5. Incorporar pruebas disponibles en el stack importado y validar build, typecheck y accesibilidad básica por ruta.

## Entrega por historias existentes

| Orden | Historia | Pantallas/componentes | Estados obligatorios | Dependencia / evidencia esperada |
| --- | --- | --- | --- | --- |
| 1 | [[HU-001-registrar-usuario]] | `/registro`, formulario de datos mínimos, resumen lateral | inicial, campos inválidos, enviando/deshabilitado, email/documento repetido, éxito | `POST /api/v1/auth/register`; `201`, `400`, `409`; conserva los estilos `authShell`, `authCard`, `authFields`. |
| 2 | [[HU-002-iniciar-sesion]] | `/iniciar-sesion`, formulario email/contraseña, enlace a registro | inicial, loading, credenciales inválidas, éxito/redirección, controles deshabilitados | `POST /api/v1/auth/login` y `GET /api/v1/session/me`; el cierre de HU exige evidencia de estos estados. |
| 3 | [[HU-003-renovar-y-cerrar-sesion]] | proveedor/estado de autenticación, guardas de ruta, acción de salir | access vencido, refresh válido, refresh inválido, ruta no autorizada, salida | `POST /api/v1/auth/refresh` existe; `logout` requiere contrato backend antes de implementar o cerrar HU. |
| 4 | [[HU-004-recuperar-contrasena]] | `/recuperar-contrasena` y restablecimiento cuando exista contrato | solicitud válida, error genérico, enlace inválido/vencido, éxito | Bloqueada de forma funcional hasta que backend defina el contrato seguro. |
| 5 | [[HU-005-gestionar-perfil-y-afiliacion]] | perfil y afiliación | carga, vacío, edición, validación, guardado/error | Requiere contratos de perfil, EPS y plan. |
| 6 | [[HU-006-consultar-catalogos-fijos]] / [[HU-007-administrar-eps-y-planes]] / [[HU-008-administrar-especialidades]] | selectores y vistas de catálogo, administración por rol | carga, vacío, error, sin permiso, éxito | Requiere endpoints y autorización API de las HU respectivas. |

Las épicas de profesionales, agenda, citas, reprogramación y automatización no se diseñan aún a nivel de componentes: sus HU detalladas y contratos REST siguen pendientes. Se añadirán al plan cuando queden especificadas y aprobadas, sin inventar pantallas.

## Reglas de reconciliación visual y accesibilidad

- Conservar la composición aprobada: cabecera, tarjeta de formulario y panel lateral; en móvil las columnas se apilan.
- Usar `label` asociado, errores por campo con `aria-describedby`, resumen de error con anuncio, foco visible y orden de tabulación natural.
- Mantener el botón principal deshabilitado durante el envío; no simular éxito si el API rechaza la solicitud.
- Traducir los códigos de error del contrato a mensajes de UI sin revelar información sensible.
- Tras cada ruta, ejecutar build/typecheck/tests disponibles y contrastar los CA de la HU antes de cambiar su estado Scrum.

## Bloqueos conocidos

- No hay exportación de AI Studio ni aplicación Next.js en el repositorio, por lo que no se puede implementar ni verificar rutas todavía.
- HU-003 requiere un contrato explícito de logout y una decisión cross-repo para custodia del refresh token.
