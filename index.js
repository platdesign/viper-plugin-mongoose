'use strict';
require('mongoose');
var mongoose 	= require('mongoose-promised');
var fs 			= require('fs');
var path 		= require('path');
var extend		= require('extend');

var schemeExtend = require('./lib/schemaExtender.js');

var defaults = {
	configId: 'mongoose'
};


var defaultConfig = {
	modelsPath: './models',
	options: {}
};


module.exports = function() {
	var that = this;

	if( this._config[defaults.configId] ) {

		var config = this._config[defaults.configId]

		// Walk config and create connection-provider for each item
		Object.keys(config).forEach(function(serviceName) {

			// config args
			var args = extend(true, {}, defaultConfig, config[serviceName]);

			// Create provider for connection
			that.provider(serviceName, function() {
				// create connection
				var con = mongoose.connect(args.uri, args.options, function(err) {
					if(err) {
						return console.log(('Connection ('+serviceName+') failed. '+err.message).red);
					}

					console.log(('Connection ('+serviceName+') has been established successfully.').cyan);
				});

				schemeExtend(con);


				var modelsPath = path.resolve( that.cwd(), args.modelsPath );

				if( fs.existsSync(modelsPath) ) {

					fs.readdirSync( modelsPath ).forEach(function(item) {

						var itemPath = path.join( modelsPath, item );

						var stat = fs.statSync(itemPath);
						if(stat.isFile()) {
							var modelFile = require(itemPath);
							modelFile(con, mongoose.Schema, mongoose.Schema.Types);
						}

					});

				}

				// return service function which returns connection-object
				return function() {
					return con;
				};
			});


		});

	}

};
