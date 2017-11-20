const path = require('path');


let mongoInInternet='mongodb://xrischev:vakanzia93@ds151355.mlab.com:51355/mymongoapp1'

module.exports = {
    development: {
        rootFolder: path.normalize(path.join(__dirname, '/../')),
        connectionString: mongoInInternet
    },
    production:{}
};



