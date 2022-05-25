const { Query } = require('../dist/index.js');
const { pgClient } = require('./util')
const pg = require('pg')

describe('Query Class', () => {
    it('should be defined', () => {
        expect(Query).toBeDefined();
    })

    it('should set pgclient', async () => {

        Query.setClient(pgClient)

        let query = new Query('test', ['id', 'name'])
        const result = await query.insert(['1', 'john']).run()

        expect(result.rows).toEqual(['1', 'john'])
    })

    it('should create a query instance', () => {
        const query = new Query('testTable', ['id', 'name']);
        expect(query).toBeDefined();
    })

    it('should create a insert query', () => {
        const query = new Query('testTable', ['id', 'name']);
        expect(query.insert([1, 'john']).query).toBe('INSERT INTO testTable (id,name) VALUES ($1,$2)');
        expect(query.values).toEqual([1, 'john']);
    })

    it('should create a update query', () => {
        const query = new Query('testTable', ['id', 'name']);
        expect(query.update([1, 'john']).query).toBe('UPDATE testTable SET id=$1,name=$2');

        expect(query.update([1], ['id']).query).toBe('UPDATE testTable SET id=$1');
        expect(query.update(['john'], ['name']).query).toBe('UPDATE testTable SET name=$1');
        expect(query.update(['john', 1], ['name', 'id']).query).toBe('UPDATE testTable SET name=$1,id=$2');

        expect(query.update([1, 'john'], ['id', 'name']).query).toBe('UPDATE testTable SET id=$1,name=$2');

        expect(query.update([1, 'john'], ['id', 'name'], { sql: 'id=#{idnum}', values: [1] }).query).toBe('UPDATE testTable SET id=$1,name=$2 WHERE id=$3');

        expect(() => query.update([1], ['id', 'name']).query).toThrow('UPDATE_VALUES_MISMATCH: The number of values and columns must be equal')
        expect(() => query.update([1, 'john'], ['id']).query).toThrow('UPDATE_VALUES_MISMATCH: The number of values and columns must be equal')

    })

    it('should create a delete query', () => {
        const query = new Query('testTable', ['id', 'name']);
        expect(query.delete().query).toBe('DELETE FROM testTable');
        expect(query.delete({ sql: 'id=#{idnum}', values: [1] }).query).toBe('DELETE FROM testTable WHERE id=$1');
    })

    it('should create a select query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.select().query).toBe('SELECT id,name,age FROM testTable');
        expect(query.select({ limit: 5, offset: 2 }).query).toBe('SELECT id,name,age FROM testTable LIMIT 5 OFFSET 2');
        expect(query.select({ limit: 5 }).query).toBe('SELECT id,name,age FROM testTable LIMIT 5');
        expect(query.select({ offset: 5 }).query).toBe('SELECT id,name,age FROM testTable OFFSET 5');
        expect(query.select({ limit: 5, offset: 0, columns: ['id', 'name'] }).query).toBe('SELECT id,name FROM testTable LIMIT 5');
        expect(query.select({
            columns: ['id', 'name'], where: { sql: 'id=#{idnum}', values: [1] }
        }).query).toBe('SELECT id,name FROM testTable WHERE id=$1');

    })

    it('should create a create table query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.createTable('id serial primary key, name text, age integer').query).toBe('CREATE TABLE IF NOT EXISTS testTable (id serial primary key, name text, age integer)');
    })

    it('should create table exists query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.tableExists().query).toBe('SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = \'testTable\')');
    })

    it('should create a drop table query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.dropTable().query).toBe('DROP TABLE IF EXISTS testTable');
    })

    it('should create column exists query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.columnExists('id', 'int').query).toBe('SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = \'testTable\' AND column_name = \'id\' AND data_type = \'int\')');
    })

    it('should create constraint exists query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.constraintExists('test_constraint').query).toBe('SELECT EXISTS(SELECT 1 FROM information_schema.table_constraints WHERE table_name = \'testTable\' AND constraint_name = \'test_constraint\')');
    })

    it('should create add colums query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.addColumns(['id int', 'name text', 'age integer']).query).toBe('ALTER TABLE testTable ADD COLUMN id int, ADD COLUMN name text, ADD COLUMN age integer');
    })

    it('should create drop column query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        expect(query.dropColumn('id').query).toBe('ALTER TABLE testTable DROP COLUMN id');
    })

    it('should create foreign key query', () => {
        const query = new Query('testTable', ['id', 'name', 'age']);
        const foptions = {
            column: 'id',
            table: 'testTable',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                column: 'id2',
                table: 'testTable2'
            }
        }
        expect(query.foreignKey(foptions).query).toBe('ALTER TABLE testTable ADD CONSTRAINT testTable_id_fkey FOREIGN KEY (id) REFERENCES testTable2 (id2) ON DELETE CASCADE ON UPDATE CASCADE');
    })

    it('should append returning clause', () => {
        const query = new Query('testTable', ['id', 'name']);
        const _query = query.insert([1, 'john'])
        expect(_query.returning('*').query).toBe('INSERT INTO testTable (id,name) VALUES ($1,$2) RETURNING *');

        const query1 = new Query('testTable', ['id', 'name']);
        const _query1 = query1.insert([1, 'john'])
        expect(_query1.returning('id,name').query).toBe('INSERT INTO testTable (id,name) VALUES ($1,$2) RETURNING id,name');

        const query2 = new Query('testTable', ['id', 'name']);
        const _query2 = query2.insert([1, 'john'])
        expect(_query2.returning(['id', 'name']).query).toBe('INSERT INTO testTable (id,name) VALUES ($1,$2) RETURNING id,name');
    })
})