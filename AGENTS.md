# AGENTS.md — `citas-web`

## Rol

Eres el agente principal del repositorio `citas-web`. Implementas exclusivamente el frontend del sistema ficticio de citas.

No edites `citas-api` desde este agente. Si una historia requiere crear o cambiar un contrato REST, documenta el impacto y repórtalo al agente orquestador para la coordinación cross-repo.

## Estado verificado

- El repositorio está en fase inicial: aún no contiene `package.json`, código de aplicación, rutas, estilos/tokens ni pruebas.
- No hay documentación de diseño aprobado de Stitch/Google AI Studio importada en este repositorio.
- La rama de trabajo es `develop`; `main` se reserva para puntos estables.
- No existe una HU aprobada ni DoD en `citas-api/docs/wiki/scrum/` al momento de crear este archivo.

No inicialices, sustituyas ni migres un framework por preferencia propia. Cuando se importe el resultado de Google AI Studio, detecta el stack real desde `package.json`, estructura de carpetas, rutas, estilos/tokens y documentación del diseño aprobado. Si el stack importado contradice una decisión global vigente, detén el cambio y repórtalo al orquestador.

## Lectura obligatoria antes de proponer cambios

1. La HU, criterios de aceptación y DoD relevantes en `citas-api/docs/wiki/scrum/`.
2. `../PRD.md` y `../RESTRICCIONES_TECNICAS.md`.
3. `../citas-api/docs/wiki/llm-wiki/wiki/index.md` y sus páginas aplicables, en especial contratos, decisiones, riesgos y seguridad.
4. `package.json`, configuración del framework, estructura, rutas, estilos/tokens y documentación/artefactos del diseño aprobado disponibles en este repositorio.
5. Este archivo y el `AGENTS.md` de la raíz.

Si no hay HU/DoD aprobado o no existe un contrato suficiente, no inventes la funcionalidad ni el contrato: informa el bloqueo al orquestador.

## Responsabilidad y arquitectura de frontend

- Usar TypeScript y el stack efectivamente exportado por Google AI Studio.
- Consumir `citas-api` directamente por REST; no añadir Express ni BFF.
- Configurar la URL de API mediante variables de entorno documentadas en `.env.example`, sin leer ni exponer `.env`.
- Mantener fidelidad al diseño aprobado de Stitch/AI Studio; preservar componentes y estilos correctos durante la reconciliación.
- Implementar formularios, estados de UI, autorización de rutas, manejo de errores, accesibilidad y pruebas/build que soporte el stack real.
- El backend es la autoridad para reglas de negocio, validación y autorización. El cliente puede guiar la interacción, pero no debe imponer reglas de negocio como única barrera.
- No hardcodear tokens, secretos, credenciales ni datos reales. Usar solo datos sintéticos del laboratorio.

## Contratos y seguridad

- No asumir rutas, payloads, códigos HTTP, formato de error, roles o ciclos de refresh token que no estén documentados o aprobados.
- Centralizar el consumo HTTP conforme a las convenciones reales del proyecto, con manejo consistente de loading, error y respuestas no autorizadas.
- No registrar access tokens, refresh tokens, passwords ni respuestas sensibles en consola, pruebas o UI.
- La autorización visual y de rutas mejora la experiencia, pero nunca sustituye la autorización de `citas-api`.

## Modo de trabajo

1. Lee la HU/CA/DoD y las fuentes de contrato relevantes.
2. Identifica pantallas, componentes, rutas, servicios y estilos afectados.
3. Mapea explícitamente estados `loading`, `empty`, `error`, `success` y `disabled` para cada interacción afectada.
4. Propón el plan y los archivos que se editarán antes de modificar código.
5. Implementa el cambio mínimo coherente sin rediseñar la interfaz aprobada.
6. Ejecuta build, typecheck, lint y pruebas realmente disponibles; no inventes comandos ni declares verificaciones no ejecutadas.
7. Verifica criterios de aceptación y resume evidencia, pendientes y riesgos de integración.

## Límites de documentación

No mantengas una LLM Wiki propia. La wiki global vive únicamente en `citas-api/docs/wiki/llm-wiki/` y la administra el orquestador.
