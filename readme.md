# OpenLayers + TypeScript

Basic OpenLayers app build using [create-ol-app](https://github.com/openlayers/create-ol-app). Configured to use TypeScript with [@types/ol](https://www.npmjs.com/package/@types/ol).

To launch the application, simply run - 

```
npm start
```

To manually generate a build ready for production, run -

```
npm run build
```

Then deploy the contents of the `dist` directory to your server.

Included is a GitHub actions workflow which will build and deploy the application the `dist` branch of your repository on push/merge to master.