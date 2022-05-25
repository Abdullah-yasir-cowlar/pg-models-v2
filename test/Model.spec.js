const { hasUncaughtExceptionCaptureCallback } = require('process')
const { Model, Table } = require('../dist/index.js')


describe('PG-MODELS', () => {
    it('should create instance of PG-MODELS', () => {
        const model = new Model('test', {})
        expect(model).toBeDefined()
    })

    it('should add timestamps columns', () => {
        const model = new Model('test', { timestamps: true })
        model.define({})
        expect(model.table.getColumnNames(true)).toEqual(['id', 'name', 'created_at', 'updated_at'])
    })

    it('should add deleted_at column', () => {
        expect(false).toBe(true)
    })

    it('should add prefix to table name', () => {
        expect(false).toBe(true)
    })

    it('should change pk type', () => {
        expect(false).toBe(true)
    })

    it('should add ', () => {
        expect(false).toBe(true)
    })

    it('should enable altering of the table', () => {
        expect(false).toBe(true)
    })

    it('should add timstamps to table', () => {
        expect(false).toBe(true)
    })

    it('should change names of timestmap columns', () => {
        expect(false).toBe(true)
    })

    it('should add deleted_at column only if timestamps are enabled', () => {
        expect(false).toBe(true)
    })

    it('should enable query logs', () => {
        expect(false).toBe(true)
    })

    it('should enable error logs ', () => {
        expect(false).toBe(true)
    })

    it('should set pgclient', () => {
        expect(false).toBe(true)
    })

    it('should get table name including prefix', () => {
        expect(false).toBe(true)
    })

    it('should get table instance', () => {
        const model = new Model('test', {})
        expect(model.table).toBeInstanceOf(Table)
    })

    it('should add beforeCreate hook', () => {
        expect(false).toBe(true)
    })

    it('should add beforeUpdate hook', () => {
        expect(false).toBe(true)
    })

    it('should add beforeDestroy hook', () => {
        expect(false).toBe(true)
    })

    it('should add afterCreate hook', () => {
        expect(false).toBe(true)
    })

    it('should add afterUpdate hook', () => {
        expect(false).toBe(true)
    })

    it('should add afterDestroy hook', () => {
        expect(false).toBe(true)
    })

    it('should add specfied hook', () => {
        expect(false).toBe(true)
    })

    it('should add foreign key', () => {
        expect(false).toBe(true)
    })

    it('should define new model with given columns', () => {
        //1. create table if not exists
        //2. modify table if exists
        expect(false).toBe(true)
    })

    it('should run given function with all hooks hooks', () => {
        //1. create hooks
        //2. update hooks
        //3. delete hooks
        expect(false).toBe(true)
    })

    it('should find all results from table', () => {
        //1. no params
        //2. limit
        //3. limit and offset
        //4. specified columns
        //5. where clause
        expect(false).toBe(true)
    })

    it('should find all results on the basis of where clause', () => {
        // findAllWhere
        expect(false).toBe(true)
    })

    it('should find first result matching key-value pairs of needle', () => {
        expect(false).toBe(true)
    })

    it('should find by pk or id', () => {
        expect(false).toBe(true)
    })

    it('should create new record', () => {
        //1. without timestamps
        //2. with timestamps
        expect(false).toBe(true)
    })

    it('should create multiple records', () => {
        //1. with timestamps
        //2. without timestamps
        expect(false).toBe(true)
    })

    it('should update record(s)', () => {
        //1. one record
        //2. multiple records
        //3. all records
        expect(false).toBe(true)
    })

    it('should update record by pk or id', () => {
        expect(false).toBe(true)
    })

    it('should partially update record(s)', () => {
        //1. one record
        //2. multiple records
        //3. all records
        expect(false).toBe(true)
    })

    it('should partially update record by pk or id', () => {
        expect(false).toBe(true)
    })

    it('should delete record(s)', () => {
        //1. record
        //2. multiple records
        //3. should not not not delete all records
        expect(false).toBe(true)
    })

    it('should delete records by pk or id', () => {
        expect(false).toBe(true)
    })


})