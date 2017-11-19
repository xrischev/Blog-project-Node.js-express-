const path = require('path');

module.exports = {
    development: {
        rootFolder: path.normalize(path.join(__dirname, '/../')),
        connectionString: 'mongodb://xrischev:vakanzia93@ds151355.mlab.com:51355/mymongoapp1'
    },
    production:{}
};



