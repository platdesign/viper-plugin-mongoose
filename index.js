'use strict';

require('mongoose');
var mongoose 	= require('mongoose-promised');
var schemaExtender = require('./lib/schemaExtender.js');

module.exports = function() {

	this.config(function($configProvider, $dbProvider, $q, $is, $path, $cwd, $fs, $log) {

		$configProvider.each('mongoose', function(key, item) {

			if( $is.string( item.uri ) ) {

				$dbProvider.connect(key, function() {

					return $q.promise(function(resolve, reject) {

						// create connection
						var con = mongoose.connect(item.uri, item.options || {}, function(err) {
							if(err) {
								// reject promise
								reject(err);
								return;
							}

							// Make schemas extendable by default
							schemaExtender(con);

							// Load models from modelsPath
							/*



							*/

							// resolve with connection
							resolve(con);
						});

					});
				});

				if(item.modelsPath) {
					$dbProvider.onConnected(key, function(con) {

						var modelsPath = $path.resolve( $cwd, item.modelsPath );

						if( $fs.existsSync( modelsPath ) ) {
							$fs.readdirSync( modelsPath ).forEach(function(item) {
								var itemPath = $path.join( modelsPath, item );
								var stat = $fs.statSync(itemPath);
								if(stat.isFile()) {
									var modelFile = require(itemPath);
									modelFile(con, mongoose.Schema, mongoose.Schema.Types);
									$log.verbose('Mongoose: Loaded model file: '+item.green);
								}
							});
						}
					});
				}


			} else {
				throw new Error('Missing parameters for database connection: '+key);
			}

		});

	});

}
