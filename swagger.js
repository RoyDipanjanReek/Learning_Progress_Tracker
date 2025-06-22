import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Learning Progress Tracker API',
    description: 'Auto-generated Swagger docs for My backend (Learning_Progress_Tracker)',
    contact: {
      name: 'Dipanjan Roy', 
      email: 'dipanjan@example.com', 
    }
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, endpointsFiles, doc);