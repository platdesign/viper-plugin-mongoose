'use strict';
var owl = require('owl-deepcopy');
var extend = require('extend');

module.exports = function(con) {

	// Mongoose Model
	var Model 	= con.Model;

	// Mongoose Schema
	var Schema = con.Schema;

	Model.extend = function(name, schema, options) {

		var schemaClone = owl.deepCopy(this.schema);

		schemaClone.add(schema);

		extend(true, schemaClone.options, options);

		return this.discriminator(name, schemaClone);

	};


};
