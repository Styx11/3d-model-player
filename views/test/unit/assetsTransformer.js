const path = require('path');

// jest testing when requiring static assets
// https://github.com/facebook/jest/issues/2663
module.exports = {
	process(src, filename, config, options)
	{
		return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
	},
};