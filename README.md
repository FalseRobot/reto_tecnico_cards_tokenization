
**Referencias para el desarrollo de la aplicación:**

Código fuente para la validación de tarjetas de crédito con el algoritmo de Luhn: https://github.com/tolbon/luhn-ts/blob/master/src/luhn.ts

**Nota importante: La aplicación ya está en vivo en AWS. Para probar los servicios, sigue estos pasos:**

1. Instala las dependencias de la aplicación:
   ```
   npm install
   ```

2. Genera la compilación de TypeScript que se cargará en las funciones Lambda:
   ```
   npm run build
   ```

3. Ejecuta el linter para asegurar la calidad del código:
   ```
   npm run lint
   ```

4. Ejecuta los comandos dummies para probar las funciones creadas:
   ```
   npm run generate-token-dummy
   npm run get-card-dummy
   ```

**Base de datos MongoDB:**

Se ha configurado un clúster gratuito shared de MongoDB. Además, se ha creado un índice con TTL activo para el componente de expiración. Los documentos "cards" se eliminarán automáticamente después de 15 minutos de su creación.

**Validación de PK (Primary Key):**

El reto menciona enviar una clave principal (PK) en la cabecera de Autorización en formato Bearer. Para que las funciones de la aplicación funcionen correctamente, se ha creado una colección llamada "consumer" para registrar estas claves. Solo los comercios que tengan sus claves registradas en MongoDB podrán consumir las APIs.

Para simplificar, la PK funcional es: `pk_test_12345` (debe enviarse en el formato Bearer). Cualquier otra PK será rechazada por el servicio.