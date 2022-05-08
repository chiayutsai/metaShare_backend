const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'MetaShare Api',
    description: 'MetaShare 相關 Api',
  },
  host: 'mata-share-backend.herokuapp.com',
  schemes: ['http', 'https'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'headers',
      name: 'Authorization',
      description: 'JWT Token',
    },
  },
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
