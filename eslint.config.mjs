import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next.js 16 ships a native ESLint flat config (the legacy `next lint` command and
// the FlatCompat shim are gone). We consume the flat configs directly and run via
// `eslint .` (see the `lint` script in package.json).
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "coverage/**"],
  },
];

export default config;
