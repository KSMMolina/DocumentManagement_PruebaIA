const ts = require("typescript");

const pathFile =
  "src/app/domonow-shared-components-web/files-config/tsconfig-shared.app.json";

const librariesToRemove = [
  "@angular/platform-browser",
  "@angular/platform-browser/animations",
  "@angular/platform-browser/testing",
  "@angular/platform-browser-dynamic",
  "@angular/platform-browser-dynamic/testing",
  "@angular/animations/browser",
  "@angular/animations/browser/testing",
];

const {
  compilerOptions: { paths },
} = ts.readConfigFile(pathFile, ts.sys.readFile)?.config;

const getPathsAlias = () => {
  return Object.keys(paths)?.reduce(
    (obj, key) => ({
      ...obj,
      [key]: {
        singleton: true,
        strictVersion: false,
        requiredVersion: "auto",
        import: paths[key]?.[0],
      },
    }),
    {}
  );
};

const removeLib = (shared) =>
  librariesToRemove.forEach((lib) => delete shared?.[lib]);

const getPathsAliasJest = () =>
  Object.keys(paths)?.reduce(
    (obj, key) => ({ ...obj, [key]: `<rootDir>/${paths[key][0]}` }),
    {}
  ) || {};

const getPathsAliasJestFixed = () =>
  Object.keys(paths)?.reduce(
    (obj, key) => ({
      ...obj,
      ["^" + key?.replace("/*", "/(.*)$")]: `<rootDir>/${paths[key][0]?.replace(
        "/*",
        "/$1"
      )}`,
    }),
    {}
  ) || {};

const initWebPackFederation = ({
  name = "",
  exposes = {
    "./Component": "./src/app/app.component.ts",
    "./routes": "./src/app/app.routes.ts",
    "./Module": "./src/bootstrap.ts",
  },
}) => {
  const {
    shareAll,
    withModuleFederationPlugin,
  } = require("@angular-architects/module-federation/webpack");

  const shared = {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    })
  };

  removeLib(shared);

  return withModuleFederationPlugin({
    name,
    exposes,
    shared: {
      ...shared,
      ...getPathsAlias(),
    },
  });
};

module.exports = {
  getPathsAlias,
  removeLib,
  getPathsAliasJest,
  getPathsAliasJestFixed,
  initWebPackFederation,
};
