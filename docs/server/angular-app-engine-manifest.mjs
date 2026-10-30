
export default {
  basePath: "/evergreenaqua-static",
  allowedHosts: [
  "smparamount.in",
  "www.smparamount.in",
  "localhost"
],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    "": () => import('./main.server.mjs')
  },
};
