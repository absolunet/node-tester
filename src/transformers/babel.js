//--------------------------------------------------------
//-- Babel transformer
//--------------------------------------------------------
import babelJest from 'babel-jest';


export default babelJest.createTransformer({
	presets: [
		[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }]
	]
});
