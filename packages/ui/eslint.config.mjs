import createConfig from "@mint/eslint-config/create-config";

export default createConfig(
  {
    react: true,
  },
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
