Referencias:
https://github.com/tolbon/luhn-ts/blob/master/src/luhn.ts

NOTA: La aplicacion ya esta esta live en AWS. Para probar los servicios descargarse e importar el archivo postman_collection.json de la carpeta docs.

1. Instalar dependencias de la app
  npm install

2. Generar el compilado de typeScript que sera subido a los lambdas
  npm run build

3. Ejecuta linter
  npm run lint

4. Ejecutar dummies para ejecutar funciones creadas
  npm run generate-token-dummy
  npm run get-card-dummy

mongoDB:
se creo un cluster free shared,y para el feature de expiracion se creo un index con TTL activo. Los documentos son eliminados pasados 15 minutos de creacion.

