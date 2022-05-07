const { Column } = require('../dist/index.js');


describe('Column Class', () => {
    it('should create a column with correct properties', () => {
        const col = new Column('id', 'id serial primary key');
        expect(col.name).toBe('id');
        expect(col.dataType).toBe('serial');
        expect(col.sql).toBe('id serial primary key');
        col.name = 'uuid'
        expect(col.name).toBe('uuid');
    });

    it('should replace name in sql with column name', () => {
        const col = new Column('id', '@name serial primary key');
        expect(col.sql).toBe('id serial primary key');
        expect(col.nameInTable).toBe('id');
    })

    it('should run validations and throw error', () => {
        const col = new Column('id', '@name serial primary key', [(val) => { throw new Error(val) }]);
        expect(() => { col.runValidations('test') }).toThrow('test');
    })

    it('should run formatter and change value', () => {
        const col = new Column('id', '@name serial primary key', [], (val) => { return val + 1 });
        expect(col.format(1)).toBe(2);
    })
})