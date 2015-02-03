#viper-plugin-sequelize

##Install

##Docs
Will come...

###options

This plugin allows multiple configurations. e.g.

	{
		db_a: {
			database: 'db_a',
			username: 'dev',
			password: 'dev'
		},
		
		db_b: {
			database: 'db_b',
			username: 'dev',
			password: 'dev'
		}
	}

There will be a connection for each configuration accessable through the key of the hash (`db_a`, `db_b`).


####- database *[string]*
Name of the database.

####- username *[string]*
Username to access the database.

####- password *[string]*
Password for the user.

####- options *[object]*
Options hash will be passed to sequelize constructor options. For more information on this options have a look at [sequelize options](http://sequelize.readthedocs.org/en/latest/docs/usage/#options).

####- modelsDir *[string|array]*
Path to directory/directories (as string or array) where model definitions are located.