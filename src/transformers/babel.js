//--------------------------------------------------------
//-- Babel transformer
//--------------------------------------------------------
import { createRequire } from "module";
import babelJest from "babel-jest";

const require = createRequire(__filename);

export default babelJest.createTransformer({
	presets: [[require.resolve("@babel/preset-env"), { targets: { node: "current" } }]],
});
