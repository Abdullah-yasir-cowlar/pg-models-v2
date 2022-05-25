const { Table } = require('../dist/index.js');
const { pgClient } = require('./util');
const pg = require('pg')

let client = new pg.Client({
    database: 'pg-models-test',
    password: 'admin',
    user: 'postgres',
    port: 5432,
    host: 'localhost'
})

const connection = client.connect().catch(err => console.log('db connection err %s', err.message))

describe('Table Class CRUD', async () => {

    beforeEach(() => {

    })

    it('should run query', async () => {
        const table = new Table('test', {
            name: {
                sql: '@name text not null'
            }
        })

        Table.setClient(pgClient)

        const result = await table.query.insert(['john']).run()
        expect(result.rows).toEqual(['john'])
    })

    it('should create new table with columns in db', async () => {
        const table = new Table('test', {
            name: {
                sql: '@name text not null'
            },
            age: {
                sql: '@age int'
            }
        })

        Table.setClient(connection)

        await table.create()

        const result = await table.query.insert(['john', 24]).run()
        expect(result.rows).toEqual(['john'])
    })

    it('should insert new row in db', () => {
        expect(false).toBe(true);
    })

    it('should update row in db', () => {
        expect(false).toBe(true);
    })

    it('should delete row in db', () => {
        expect(false).toBe(true);
    })

    it('should get row in db', () => {
        expect(false).toBe(true);
    })

    it('should get all rows in db', () => {
        expect(false).toBe(true);
    })

    it('should insert many rows in db', () => {
        expect(false).toBe(true);
    })

    it('should check if table exists in db', () => {
        expect(false).toBe(true);
    })

    it('should drop table in db', () => {
        expect(false).toBe(true);
    })

    it('should check if column exists in table in db', () => {
        expect(false).toBe(true);
    })

    it('should create new columns in table in db', () => {
        expect(false).toBe(true);
    })

    it('should check if constraint exists in table in db', () => {
        expect(false).toBe(true);
    })

    it('should create foreign key in table in db', () => {
        expect(false).toBe(true);
    })

})