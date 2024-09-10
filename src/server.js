import express from 'express';
import { initialize } from 'express-openapi';
import v1WorldsService from './api-v1/services/worldsService.js';
import v1ApiDoc from './api-v1/api-doc.js';
import swaggerUi from 'swagger-ui-express'

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(v1ApiDoc));
initialize({
  app,
  // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
  // apiDoc: './api-v1/api-doc.yml',
  apiDoc: v1ApiDoc,
  dependencies: {
    worldsService: v1WorldsService
  },
  paths: 'src/api-v1/paths'
});

app.listen(3000);