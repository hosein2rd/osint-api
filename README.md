# FOR DEVELOPERS
## ADMIN PANEL
This project containg some folder:

* graphql
	* resolver
	* schema
* helper
* middleware
* model
* public
	* uploads

And some main file:

* app.js
* index.js ( **_into /graphql/resolver_** )
* index.js ( **_into /graphql/schema_** )

#### graphql
This folder containing resolver and schema. All definition of graphql are into this folder.

#### resolver
This folder containing resolver for graphql. Every query comes here at the end and return result to client.

#### schema
Every schema that use in graphql is defined into this folder.

#### helper
This folder some functions and utils that whole files.

#### middleware
This folder containing **_check-auth.js_** file to check authentiaction of user that send request to server.

#### public
Every person can access this folder by url.

#### uploads
All uploaded files will save into this folder.

#### app.js
This file containing all configuration of app.

#### index.js ( **_into /graphql/resolver_** )
This folder merge all resolvers that are in /graphql/resolver directory.

#### index.js ( **_into /graphql/schema_** )
This folder merge all schemas that are in /graphql/schema directory.

## TOOLS
* express
* mongoose
* graphql
* express-graphql
* graphql-upload
* body-parser
* jsonwebtoken
* passport
* fs
* snowboard
* dotenv

#### express
Used for running on a server
#### mongoose ([Documentation](https://www.npmjs.com/package/mongoose))
Used for mongo database
#### graphql ([Documentation](https://www.npmjs.com/package/graphql))
Used for implement GraphQL to app
#### express-graphql ([Documentation](https://www.npmjs.com/package/express-graphql))
Used GraphQL for **express** apps.
#### graphql-upload ([Documentation](https://www.npmjs.com/package/graphql-upload))
Used for upload file using GraphQL API
#### body-parser ([Documentation](https://www.npmjs.com/package/body-parser))
Used for parsing middlewares and request body
#### jsonwebtoken ([Documentation](https://www.npmjs.com/package/jsonwebtoken))
Used for authentication
#### passport ([Documentation](https://www.npmjs.com/package/passport))
Used for authentication
#### fs
Used for working with files
#### snowboard ([Documentation](https://github.com/bukalapak/snowboard))
Used for get output of APIDOC.apib. If you want to update document of APIDOC.apib and get output write this command in terminal

> snowboard html -o output.html APIDOC.apib

This command create a file by output.html name.
#### dotenv ([Documentation](https://www.npmjs.com/package/dotenv))
Used for keep safely secret key in **.env** file.

## HOW TO RUN
following these steps (if you installed mongodb start from step 2):

1. download and install mongodb on your system
2. run mongodb with this commands
    > sudo chown -R `id -un` /data/db
    
    > cd /data/db

    > mongod
3. Update or download all dependencies by this command

    > npm install

4. Run the server with this command
    
    > npm start

    **_NOTE:_** If you want to run server as product use this command
    
    > node app.js
