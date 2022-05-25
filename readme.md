## Classes

<dl>
<dt><a href="#Column">Column</a></dt>
<dd></dd>
<dt><a href="#Model">Model</a></dt>
<dd></dd>
<dt><a href="#Options">Options</a></dt>
<dd></dd>
<dt><a href="#Query">Query</a></dt>
<dd></dd>
<dt><a href="#Table">Table</a></dt>
<dd></dd>
</dl>

<a name="Column"></a>

## Column
**Kind**: global class  

* [Column](#Column)
    * [new Column(colName, sql, validations, formatter)](#new_Column_new)
    * [.name](#Column+name)
    * [.name](#Column+name)
    * [.nameInTable](#Column+nameInTable)
    * [.dataType](#Column+dataType)
    * [.sql](#Column+sql)
    * [.format(val)](#Column+format) ⇒
    * [.runValidations(val, allInputs)](#Column+runValidations)

<a name="new_Column_new"></a>

### new Column(colName, sql, validations, formatter)
<p>Creates instance of Column</p>


| Param | Description |
| --- | --- |
| colName | <p>name of the column</p> |
| sql | <p>sql statement to create column</p> |
| validations | <p>Array of validation functions, which throw error on validation failure</p> |
| formatter | <p>Function which formats the column value, returns formatted value</p> |

<a name="Column+name"></a>

### column.name
<p>Gets column name</p>

**Kind**: instance property of [<code>Column</code>](#Column)  
<a name="Column+name"></a>

### column.name
<p>Sets column name</p>

**Kind**: instance property of [<code>Column</code>](#Column)  
<a name="Column+nameInTable"></a>

### column.nameInTable
<p>Gets the name of the column which is used to identify it in the sql</p>

**Kind**: instance property of [<code>Column</code>](#Column)  
<a name="Column+dataType"></a>

### column.dataType
<p>Gets data type of the column</p>

**Kind**: instance property of [<code>Column</code>](#Column)  
<a name="Column+sql"></a>

### column.sql
<p>Get sql statement which is used for column creation</p>

**Kind**: instance property of [<code>Column</code>](#Column)  
<a name="Column+format"></a>

### column.format(val) ⇒
<p>Runs column's formatter function for given value</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
**Returns**: <p>formatted value</p>  

| Param | Description |
| --- | --- |
| val | <p>Any value for column input</p> |

<a name="Column+runValidations"></a>

### column.runValidations(val, allInputs)
<p>Runs column's validator functions for given value</p>

**Kind**: instance method of [<code>Column</code>](#Column)  

| Param | Description |
| --- | --- |
| val | <p>Any input value</p> |
| allInputs | <p>Optional - inputs of other columns</p> |

<a name="Model"></a>

## Model
**Kind**: global class  

* [Model](#Model)
    * [new Model(tableName, config)](#new_Model_new)
    * _instance_
        * [.tableName](#Model+tableName)
        * [.table](#Model+table)
        * [.beforeCreate(hook)](#Model+beforeCreate)
        * [.afterCreate(hook)](#Model+afterCreate)
        * [.beforeUpdate(hook)](#Model+beforeUpdate)
        * [.afterUpdate(hook)](#Model+afterUpdate)
        * [.beforeDestroy(hook)](#Model+beforeDestroy)
        * [.afterDestroy(hook)](#Model+afterDestroy)
        * [.useHook(type, hook)](#Model+useHook)
        * [.addForeignKey(foreignKey)](#Model+addForeignKey)
        * [.define(columns)](#Model+define)
        * [.runWithHooks(operation, allInputs, fn)](#Model+runWithHooks) ⇒
        * [.findAll(options)](#Model+findAll) ⇒
        * [.findAllWhere(whereClause, params)](#Model+findAllWhere) ⇒
        * [.findOne(needle)](#Model+findOne) ⇒
        * [.findByPk(pkey)](#Model+findByPk) ⇒
        * [.create(data)](#Model+create) ⇒
        * [.createMany(data)](#Model+createMany) ⇒
        * [.update(data, where)](#Model+update) ⇒
        * [.updateByPk(pkey, data)](#Model+updateByPk) ⇒
        * [.patch(data, where)](#Model+patch) ⇒
        * [.patchByPk(pkey, data)](#Model+patchByPk) ⇒
        * [.destroy(wher)](#Model+destroy) ⇒
        * [.destroyByPk(pkey)](#Model+destroyByPk) ⇒
    * _static_
        * [.useConnection(pgClient)](#Model.useConnection)

<a name="new_Model_new"></a>

### new Model(tableName, config)
<p>Creates <code>Model</code> instance</p>


| Param | Description |
| --- | --- |
| tableName | <p>name of the database table</p> |
| config | <p>model configurations</p> |

<a name="Model+tableName"></a>

### model.tableName
<p>Returns table name (with prefix)</p>

**Kind**: instance property of [<code>Model</code>](#Model)  
<a name="Model+table"></a>

### model.table
<p>Returns <code>Table</code> instance</p>

**Kind**: instance property of [<code>Model</code>](#Model)  
<a name="Model+beforeCreate"></a>

### model.beforeCreate(hook)
<p>Creates a hook on model which runs before every <code>insert</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs before every insertion in DB</p> |

<a name="Model+afterCreate"></a>

### model.afterCreate(hook)
<p>Creates a hook on model which runs after every <code>insert</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs after every insertion in DB</p> |

<a name="Model+beforeUpdate"></a>

### model.beforeUpdate(hook)
<p>Creates a hook on model which runs before every <code>update</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs before every update action in DB</p> |

<a name="Model+afterUpdate"></a>

### model.afterUpdate(hook)
<p>Creates a hook on model which runs after every <code>update</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs after every update action in DB</p> |

<a name="Model+beforeDestroy"></a>

### model.beforeDestroy(hook)
<p>Creates a hook on model which runs before every <code>delete</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs before every delete action in DB</p> |

<a name="Model+afterDestroy"></a>

### model.afterDestroy(hook)
<p>Creates a hook on model which runs after every <code>delete</code> query</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| hook | <p>A function, which runs after every delete action in DB</p> |

<a name="Model+useHook"></a>

### model.useHook(type, hook)
<p>Adds specified hook to the Model, you can add as many hooks as you want</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| type | <p>Name of the hook, i.e 'beforeCreate,afterCreate,beforeUpdate,afterUpdate,beforeDestroy,afterDestroy</p> |
| hook | <p>A function, to add as hook</p> |

<a name="Model+addForeignKey"></a>

### model.addForeignKey(foreignKey)
<p>Creates foreign key on the Model</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| foreignKey | <p>An object containing foregin key config options</p> |

<a name="Model+define"></a>

### model.define(columns)
<p>Creates new tables with specified columns, or alters table if exists already (and <code>alter:true</code> is set in model options)</p>

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| columns | <p>An object cotaining columns schema and other options</p> |

<a name="Model+runWithHooks"></a>

### model.runWithHooks(operation, allInputs, fn) ⇒
<p>Takes user inputs, operation name and runs given function with all the hooks matching <code>operation</code></p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>any value returned by 'fn'</p>  

| Param | Description |
| --- | --- |
| operation | <p>Name of the database operation i.e 'Create, Update or Destroy'</p> |
| allInputs | <p>User inputs</p> |
| fn | <p>Function which does some database operation</p> |

<a name="Model+findAll"></a>

### model.findAll(options) ⇒
<p>Finds all records in the table, or records matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Found rows or empty array</p>  

| Param | Description |
| --- | --- |
| options | <p>Search options</p> |

<a name="Model+findAllWhere"></a>

### model.findAllWhere(whereClause, params) ⇒
<p>Finds all records matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Found rows or empty array</p>  

| Param | Description |
| --- | --- |
| whereClause | <p>String containing where clause</p> |
| params | <p>Values to replace in where clause</p> |

<a name="Model+findOne"></a>

### model.findOne(needle) ⇒
<p>Finds first record in the table, or record matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Found row or null</p>  

| Param | Description |
| --- | --- |
| needle | <p>Object containing search conditions, column-value pairs</p> |

<a name="Model+findByPk"></a>

### model.findByPk(pkey) ⇒
<p>Finds first record matching primary key</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Found row or null</p>  

| Param | Description |
| --- | --- |
| pkey | <p>Primary key value</p> |

<a name="Model+create"></a>

### model.create(data) ⇒
<p>Inserts new record in the table</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Inserted row</p>  

| Param | Description |
| --- | --- |
| data | <p>Object containing data to insert, column-value pairs</p> |

<a name="Model+createMany"></a>

### model.createMany(data) ⇒
<p>Inserts multiple records in the table</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Inserted rows</p>  

| Param | Description |
| --- | --- |
| data | <p>Array of objects containing data to insert, column-value pairs</p> |

<a name="Model+update"></a>

### model.update(data, where) ⇒
<p>Updates all records matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Updated row</p>  

| Param | Type | Description |
| --- | --- | --- |
| data |  | <p>Object containing data to update, column-value pairs</p> |
| where | <code>whereOptions</code> | <p>Object containing where options</p> |

<a name="Model+updateByPk"></a>

### model.updateByPk(pkey, data) ⇒
<p>Updates first record matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Updated row</p>  

| Param | Description |
| --- | --- |
| pkey | <p>Primary key value</p> |
| data | <p>Object containing data to update, column-value pairs</p> |

<a name="Model+patch"></a>

### model.patch(data, where) ⇒
<p>Partially updates all records matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Updated row</p>  

| Param | Type | Description |
| --- | --- | --- |
| data |  | <p>Object containing data to update, column-value pairs</p> |
| where | <code>whereOptions</code> | <p>Object containing where options</p> |

<a name="Model+patchByPk"></a>

### model.patchByPk(pkey, data) ⇒
<p>Partially updates first record matching primary key</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Updated row</p>  

| Param | Description |
| --- | --- |
| pkey | <p>Primary key value</p> |
| data | <p>Object containing data to update, column-value pairs</p> |

<a name="Model+destroy"></a>

### model.destroy(wher) ⇒
<p>Deletes all records matching given conditions</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Deleted rows</p>  

| Param | Type | Description |
| --- | --- | --- |
| wher | <code>whereOptions</code> | <p>e Object containing where options</p> |

<a name="Model+destroyByPk"></a>

### model.destroyByPk(pkey) ⇒
<p>Deletes first record matching primary key</p>

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <p>Deleted row</p>  

| Param | Description |
| --- | --- |
| pkey | <p>Primary key value</p> |

<a name="Model.useConnection"></a>

### Model.useConnection(pgClient)
<p>Connects Model class to database using <code>pg</code>, postgresql driver for nodejs</p>

**Kind**: static method of [<code>Model</code>](#Model)  

| Param | Description |
| --- | --- |
| pgClient | <p>client instance returned by <code>pg</code> package</p> |

<a name="Options"></a>

## Options
**Kind**: global class  

* [Options](#Options)
    * [new Options(input, defaults)](#new_Options_new)
    * [.config](#Options+config)

<a name="new_Options_new"></a>

### new Options(input, defaults)
<p>Takes an input object and a default object, merges both objects and generates new config, that can be accessed using <code>config</code> property</p>


| Param | Description |
| --- | --- |
| input | <p>input object</p> |
| defaults | <p>default values for missing input values</p> |

<a name="Options+config"></a>

### options.config
<p>Returns merged <code>input</code> and <code>defaults</code> objects</p>

**Kind**: instance property of [<code>Options</code>](#Options)  
<a name="Query"></a>

## Query
**Kind**: global class  

* [Query](#Query)
    * [new Query(tableName, columns)](#new_Query_new)
    * _instance_
        * [.query](#Query+query)
        * [.values](#Query+values)
        * [.client](#Query+client)
        * [.prepare(query, values, columns, where)](#Query+prepare) ⇒
        * [.returning(cols)](#Query+returning) ⇒
        * [.count(column)](#Query+count) ⇒
        * [.sum(column, where)](#Query+sum) ⇒
        * [.orderBy(columns)](#Query+orderBy) ⇒
        * [.groupBy(columns)](#Query+groupBy) ⇒
        * [.insert(values)](#Query+insert) ⇒
        * [.select(options)](#Query+select) ⇒
        * [.update(values, columns, where)](#Query+update) ⇒
        * [.delete(where)](#Query+delete) ⇒
        * [.tableExists()](#Query+tableExists) ⇒
        * [.columnExists(name, type)](#Query+columnExists) ⇒
        * [.constraintExists(name)](#Query+constraintExists) ⇒
        * [.createTable(colsSchema)](#Query+createTable) ⇒
        * [.addColumns(colsSchema)](#Query+addColumns) ⇒
        * [.dropTable()](#Query+dropTable) ⇒
        * [.dropColumn(name)](#Query+dropColumn) ⇒
        * [.foreignKey(options)](#Query+foreignKey) ⇒
        * [.run()](#Query+run) ⇒
        * [.log()](#Query+log) ⇒
    * _static_
        * [.setClient(pgClient)](#Query.setClient)

<a name="new_Query_new"></a>

### new Query(tableName, columns)
<p>Creates a new <code>Query</code> instance</p>


| Param | Description |
| --- | --- |
| tableName | <p>Name of the table</p> |
| columns | <p>Names of the columns for the table</p> |

<a name="Query+query"></a>

### query.query
<p>Gets query string</p>

**Kind**: instance property of [<code>Query</code>](#Query)  
<a name="Query+values"></a>

### query.values
<p>Gets query values</p>

**Kind**: instance property of [<code>Query</code>](#Query)  
<a name="Query+client"></a>

### query.client
<p>Gets the client object</p>

**Kind**: instance property of [<code>Query</code>](#Query)  
<a name="Query+prepare"></a>

### query.prepare(query, values, columns, where) ⇒
<p>Prepares the query for the given values, that can be get with <code>query.query</code> and <code>query.values</code></p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| query |  | <p>Query string</p> |
| values |  | <p>Values to be replaced in the query</p> |
| columns |  | <p>Columns to be selected</p> |
| where | <code>whereOptions</code> | <p>Where clause</p> |

<a name="Query+returning"></a>

### query.returning(cols) ⇒
<p>Appends <code>returning</code> clause to the query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| cols | <p>string (comma seperated) or an array of column names</p> |

<a name="Query+count"></a>

### query.count(column) ⇒
<p>Creates a query to count values of given column in the table</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| column | <p>Name of the column</p> |

<a name="Query+sum"></a>

### query.sum(column, where) ⇒
<p>Create a query to sum the values of given column</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| column |  | <p>Name of the column</p> |
| where | <code>whereOptions</code> | <p>An object of filters</p> |

<a name="Query+orderBy"></a>

### query.orderBy(columns) ⇒
<p>Appends <code>order by</code> clause for given columns to the query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| columns | <p>List of column names, a comma seperated string, or an array of strings</p> |

<a name="Query+groupBy"></a>

### query.groupBy(columns) ⇒
<p>Appends <code>group by</code> clause for given columns to the query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| columns | <p>List of column names, a comma seperated string, or an array of strings</p> |

<a name="Query+insert"></a>

### query.insert(values) ⇒
<p>Creates an insert query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| values | <p>Values to be inserted</p> |

<a name="Query+select"></a>

### query.select(options) ⇒
<p>Creates a select query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| options | <p>Select options like <code>limit</code>, <code>offset</code>, <code>orderBy</code>, <code>where</code></p> |

<a name="Query+update"></a>

### query.update(values, columns, where) ⇒
<p>Creates a query to update a row</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| values | <p>Values to be replaced in the query</p> |
| columns | <p>Columns to be selected</p> |
| where | <p>Where clause</p> |

<a name="Query+delete"></a>

### query.delete(where) ⇒
<p>Creates a query to delete a row</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| where | <p>Where clause</p> |

<a name="Query+tableExists"></a>

### query.tableExists() ⇒
<p>Creates a query to check if the table exists</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  
<a name="Query+columnExists"></a>

### query.columnExists(name, type) ⇒
<p>Creates a query to check if the column exists</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| name | <p>Name of the column</p> |
| type | <p>Data type of the column</p> |

<a name="Query+constraintExists"></a>

### query.constraintExists(name) ⇒
<p>Creates a query to check if the constraint exists</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| name | <p>Name of the constraint</p> |

<a name="Query+createTable"></a>

### query.createTable(colsSchema) ⇒
<p>Creates a query to create a table</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| colsSchema | <p>Schema of the columns</p> |

<a name="Query+addColumns"></a>

### query.addColumns(colsSchema) ⇒
<p>Creates a query to alter a table to add columns</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| colsSchema | <p>Schema of the columns</p> |

<a name="Query+dropTable"></a>

### query.dropTable() ⇒
<p>Creates a query to drop a table</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  
<a name="Query+dropColumn"></a>

### query.dropColumn(name) ⇒
<p>Creates a query to drop a column</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| name | <p>Name of the column</p> |

<a name="Query+foreignKey"></a>

### query.foreignKey(options) ⇒
<p>Creates a query to add a foreign key constraint</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  

| Param | Description |
| --- | --- |
| options | <p>Options for the constraint</p> |

<a name="Query+run"></a>

### query.run() ⇒
<p>Runs the query</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  
<a name="Query+log"></a>

### query.log() ⇒
<p>Logs the query and its values</p>

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <p>reference to the instance</p>  
<a name="Query.setClient"></a>

### Query.setClient(pgClient)
<p>Connects to the database</p>

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| pgClient | <p>Client object returned by <code>pg.Client.connect()</code></p> |

<a name="Table"></a>

## Table
**Kind**: global class  

* [Table](#Table)
    * [new Table(tableName, columns, options)](#new_Table_new)
    * _instance_
        * [.options](#Table+options)
        * [.name](#Table+name)
        * [.columns](#Table+columns)
        * [.query](#Table+query)
        * [.name](#Table+name)
        * [.run(query)](#Table+run) ⇒
        * [.create()](#Table+create)
        * [.select(options)](#Table+select) ⇒
        * [.insert(data)](#Table+insert) ⇒
        * [.insertMany(data)](#Table+insertMany) ⇒
        * [.update(data, pkey)](#Table+update) ⇒
        * [.delete(pkey)](#Table+delete) ⇒
        * [.exists()](#Table+exists) ⇒
        * [.columnExists(name, type)](#Table+columnExists) ⇒
        * [.contraintExists(name)](#Table+contraintExists) ⇒
        * [.drop()](#Table+drop)
        * [.alter()](#Table+alter) ⇒
        * [.addForeignKey(foreignKey)](#Table+addForeignKey)
        * [.addTimestamps()](#Table+addTimestamps)
        * [.setParanoid()](#Table+setParanoid)
        * [.setColumns(columns)](#Table+setColumns)
        * [.getColumn(colName)](#Table+getColumn) ⇒
        * [.getColumnNames(includeTimestamps)](#Table+getColumnNames) ⇒
        * [.getValidInputs(allInputs, nulls)](#Table+getValidInputs) ⇒
        * [.getInputsArrangedAsColumns(allInputs)](#Table+getInputsArrangedAsColumns) ⇒
        * [.runValidations(allInputs)](#Table+runValidations)
    * _static_
        * [.setClient(client)](#Table.setClient)

<a name="new_Table_new"></a>

### new Table(tableName, columns, options)
<p>Creates a new <code>Table</code> instance</p>


| Param | Description |
| --- | --- |
| tableName | <p>Name of the table to be created</p> |
| columns | <p>Columns to be added to the table</p> |
| options | <p>Configuration options for the table</p> |

<a name="Table+options"></a>

### table.options
<p>Gets configurable object</p>

**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+name"></a>

### table.name
<p>Gets the name of the table</p>

**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+columns"></a>

### table.columns
<p>Gets the columns of the table</p>

**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+query"></a>

### table.query
<p>Gets the query instance</p>

**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+name"></a>

### table.name
<p>Sets the name of the table</p>

**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+run"></a>

### table.run(query) ⇒
<p>Runs a query and returns the result</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>result of the query</p>  

| Param | Description |
| --- | --- |
| query | <p>Query to be run</p> |

<a name="Table+create"></a>

### table.create()
<p>Creates the table in the database</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+select"></a>

### table.select(options) ⇒
<p>Selects data from the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>selected rows</p>  

| Param | Description |
| --- | --- |
| options | <p>Set options for the query</p> |

<a name="Table+insert"></a>

### table.insert(data) ⇒
<p>Inserts a row into the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>inserted row</p>  

| Param | Description |
| --- | --- |
| data | <p>Data to be inserted</p> |

<a name="Table+insertMany"></a>

### table.insertMany(data) ⇒
<p>Inserts multiple rows into the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>inserted rows</p>  

| Param | Description |
| --- | --- |
| data | <p>Data to be inserted</p> |

<a name="Table+update"></a>

### table.update(data, pkey) ⇒
<p>Updates all rows in the table, or a single row if <code>pkey</code> is provided</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>updated row</p>  

| Param | Description |
| --- | --- |
| data | <p>Data to be updated</p> |
| pkey | <p>primary key of the row to be updated</p> |

<a name="Table+delete"></a>

### table.delete(pkey) ⇒
<p>Deletes row(s) from the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>deleted rows</p>  

| Param | Type | Description |
| --- | --- | --- |
| pkey | <code>string</code> \| <code>whereOptions</code> | <p>primary key of the row to be deleted or where options</p> |

<a name="Table+exists"></a>

### table.exists() ⇒
<p>Checks if the table exists in the database</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>true if the table exists, false otherwise</p>  
<a name="Table+columnExists"></a>

### table.columnExists(name, type) ⇒
<p>Checks if the column exists in the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>true if the column exists, false otherwise</p>  

| Param | Description |
| --- | --- |
| name | <p>Name of the column</p> |
| type | <p>Data type of the column</p> |

<a name="Table+contraintExists"></a>

### table.contraintExists(name) ⇒
<p>Check if the constraint exists in the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>true if constraint exists, false otherwise</p>  

| Param | Description |
| --- | --- |
| name | <p>Name of the table</p> |

<a name="Table+drop"></a>

### table.drop()
<p>Drops the table from database</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+alter"></a>

### table.alter() ⇒
<p>Alters the table in the database</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>true if table is altered, false otherwise</p>  
<a name="Table+addForeignKey"></a>

### table.addForeignKey(foreignKey)
<p>Creates a foreign key</p>

**Kind**: instance method of [<code>Table</code>](#Table)  

| Param | Description |
| --- | --- |
| foreignKey | <p>Object containing foreign key configuration</p> |

<a name="Table+addTimestamps"></a>

### table.addTimestamps()
<p>Alters table to add timestamps (created_at, updated_at) columns in it</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+setParanoid"></a>

### table.setParanoid()
<p>Adds deleted_at column in the table</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+setColumns"></a>

### table.setColumns(columns)
<p>Sets new columns on table instance</p>

**Kind**: instance method of [<code>Table</code>](#Table)  

| Param | Description |
| --- | --- |
| columns | <p>Object containing table columns configuration</p> |

<a name="Table+getColumn"></a>

### table.getColumn(colName) ⇒
<p>Gets column object</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>matched column</p>  

| Param | Description |
| --- | --- |
| colName | <p>Column name</p> |

<a name="Table+getColumnNames"></a>

### table.getColumnNames(includeTimestamps) ⇒
<p>Get array of column names</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>array of column names</p>  

| Param | Default | Description |
| --- | --- | --- |
| includeTimestamps | <code>false</code> | <p>true for including timestamp columns names, false otherwise</p> |

<a name="Table+getValidInputs"></a>

### table.getValidInputs(allInputs, nulls) ⇒
<p>Returns a list of valid inputs</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>object of valid inputs, columnName-input pairs</p>  

| Param | Default | Description |
| --- | --- | --- |
| allInputs |  | <p>User inputs object</p> |
| nulls | <code>false</code> | <p>If true, will return nulls for missing inputs</p> |

<a name="Table+getInputsArrangedAsColumns"></a>

### table.getInputsArrangedAsColumns(allInputs) ⇒
<p>Arranges keys in input object according to arrangment of columns object</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
**Returns**: <p>object of arranged inputs</p>  

| Param | Description |
| --- | --- |
| allInputs | <p>object containing user inputs</p> |

<a name="Table+runValidations"></a>

### table.runValidations(allInputs)
<p>Runs validation functions of all columns on corresponding input value</p>

**Kind**: instance method of [<code>Table</code>](#Table)  

| Param | Description |
| --- | --- |
| allInputs | <p>object containing user inputs</p> |

<a name="Table.setClient"></a>

### Table.setClient(client)
<p>Connects to the database</p>

**Kind**: static method of [<code>Table</code>](#Table)  

| Param | Description |
| --- | --- |
| client | <p>Client to be used for the query (to connect to the database)</p> |

