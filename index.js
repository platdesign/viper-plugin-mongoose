'use strict';
require('mongoose');
var mongoose 	= require('mongoose-promised');
var fs 			= require('fs');
var path 		= require('path');
var extend		= require('extend');
var Q 			= require('q');

var schemaExtender = require('./lib/schemaExtender.js');

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

				var d = Q.defer();

				// create connection
				var con = mongoose.connect(args.uri, args.options, function(err) {
					if(err) {
						// Log failure
						console.log(('Connection ('+serviceName+') failed. '+err.message).red);

						// reject promise
						d.reject(err);

						return;
					}

					// Log success! =)
					console.log(('Connection ('+serviceName+') has been established successfully.').cyan);

					// Make schemas extendable by default
					schemaExtender(con);


					// Load models from modelsPath
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

					// resolve with connection
					d.resolve(con);
				});





				// return service function which returns connection-object
				return function() {
					return d.promise;
				};
			});


		});

	}

};
