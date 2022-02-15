import express from 'express';
import router from './routes';
import * as mongoUtil from './utils/mongoUtil';
import {Request, Response, NextFunction} from 'express'
import passport from 'passport';

mongoUtil.connect().then();

const app = express()

require('./utils/passport');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.use(passport.initialize());
app.use(router);


// OPENAPI DOCS
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import {resolveRefsAt} from 'json-refs';
import path from "path";

/**
 * Return JSON with resolved references
 * @returns {Promise.<JSON>}
 */
const multiFileSwagger = () => {
  const options = {
    filter: ["relative", "remote"],
    loaderOptions: {
      processContent: function (res: any, callback: any) {
        callback(null, yamljs.parse(res.text));
      },
    },
  };

  return resolveRefsAt(path.join(__dirname, "./docs/openapi.yaml"), options).then(
      function (results: any) {
        return results.resolved;
      },
      function (err: any) {
        console.log(err.stack);
      }
  );
};

multiFileSwagger().then((swaggerDocument) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
})

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Fitness Coaching Application API')
});

export const api = app;