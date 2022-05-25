const { Table } = require('../dist/index');

describe('Table Class config', () => {
    let table
    beforeEach(() => {
        const cols = {
            name: {
                sql: '@name text not null',
            },
            age: {
                sql: '@name integer',
            }
        }

        table = new Table('test_table', cols, {
            prefix: 'tb_',
            pkName: 'ID',
            pkType: 'uuid',
            paranoid: false,
            timestamps: false,
        })
    })
    it('should change options', () => {
        expect(table.options.config).toEqual({
            prefix: 'tb_',
            pkName: 'ID',
            pkType: 'uuid',
            paranoid: false,
            alter: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        })
    })

    it('should change name of id column', () => {
        expect(table.getColumn('ID').name).toBe('ID');
        expect(table.getColumn('ID').sql).toBe('ID uuid NOT NULL PRIMARY KEY');
    })

    it('should prefix name of the table', () => {
        expect(table.name).toBe('tb_test_table');
    })

    it('should change type of pk', () => {
        expect(table.getColumn('ID').dataType).toBe('uuid');
    })
})