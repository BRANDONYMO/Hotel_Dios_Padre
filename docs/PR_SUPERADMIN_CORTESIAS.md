## Problema y cambio

El sistema carecía de cortesías y de un rol que controlara su autorización. Agrega Superadministrador con acceso al panel y endpoints administrativos existentes, y un límite de cortesía persistido en MySQL que solo ese rol puede modificar. Administrador puede aplicar cortesías dentro del límite, validado transaccionalmente por el backend.

Integra el porcentaje en creación/edición, totales, saldos y reportes sin representar cortesías como pagos. Protege creación/asignación y gestión de cuentas privilegiadas; consulta el rol vigente para evitar privilegios retenidos por JWT antiguos.

## Migración y operación

Aplicar `sql/2026_11_superadmin_cortesias.sql` antes del código nuevo, tras respaldo y ensayo en una copia. Es aditiva y reejecutable; inicia el límite en 0% y no asciende usuarios. Un operador MySQL debe asignar el primer Superadministrador a una cuenta verificada. Instrucciones y limitaciones en `docs/SUPERADMIN_CORTESIAS.md`.

Conserva la regla existente de pago obligatorio. Un límite menor no recalcula reservas guardadas; sus futuras ediciones deben cumplirlo.

## Validación

- `npm run build`
- `npm test -- --runInBand`: 56 pruebas aprobadas.
- `DB_PORT=3307 node test/cortesias.integration.cjs`: 57 comprobaciones aprobadas con MariaDB 11.8.6 local, incluyendo migración repetida y peticiones HTTP/JWT reales.
- `node --check public/admin.js` y `node --check public/app.js`
- ESLint dirigido: sin errores ni advertencias en los archivos de permisos, autenticación, configuración y usuarios.

Sin acceso a producción: pendiente ensayo contra una copia MySQL real y revisión visual en navegador. Sin merge ni despliegue en Railway.
