

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

Valudacion de PK:
el reto menciona que se debe enviar un PK en Authorization en formato Bearer, para efectos de la funcionabilidad mencionada en el reto se creo un collection llamado consumer con ese pk. Solo los comercios que tengan su pk registrado en mongodb podran consumir las apis ...
para efectos de simpleza el PK funcional es : pk_test_12345 (enviar en formato Bearer)
cualquier otro Pk enviado el servicio rechazara el consumo del servicio