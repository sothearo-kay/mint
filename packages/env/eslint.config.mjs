import createConfig from "@mint/eslint-config/create-config";

export default createConfig({}, {
  rules: {
    "node/no-process-env": "off",
  },
});
