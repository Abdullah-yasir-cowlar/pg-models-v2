const { Table } = require('../dist/index.js');


describe('Table Class util methods with default config', () => {
    let cols, table;

    beforeEach(() => {
        cols = {
            name: {
                sql: '@name text not null',
                validations: [
                    (v) => {
                        if (v.length < 5) {
                            throw new Error('Name must be at least 5 characters long');
                        }
                    }
                ],
                formatter: (v) => v.toUpperCase()
            },
            age: {
                sql: '@name integer',
                validations: [
                    (v) => {
                        if (v < 0) {
                            throw new Error('Age must be positive');
                        }
                    }
                ]
            }
        }
        table = new Table('testTable', cols);
    })

    it('should create new table with columns', () => {
        let cols, table;
        cols = {
            name: {
                sql: '@name text not null',
                validations: [
                    (v) => {
                        if (v.length < 5) {
                            throw new Error('Name must be at least 5 characters long');
                        }
                    }
                ],
                formatter: (v) => v.toUpperCase()
            },
            age: {
                sql: '@name integer',
                validations: [
                    (v) => {
                        if (v < 0) {
                            throw new Error('Age must be positive');
                        }
                    }
                ]
            }
        }
        table = new Table('testTable', cols, {});
        expect(table.name).toBe('testTable');
        expect(table.options.config).toEqual({
            prefix: '',
            pkName: 'id',
            pkType: 'serial',
            alter: false,
            paranoid: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        });
        expect(table.columns.length).toBe(3);
    })

    it('should set new columns', () => {
        table.columns = {
            name: {
                sql: '@name text not null',
                validations: [
                    (v) => {
                        if (v.length < 5) {
                            throw new Error('Name must be at least 5 characters long');
                        }
                    }
                ],
                formatter: (v) => v.toUpperCase()
            },
            dob: {
                sql: '@name integer',
                validations: [
                    (v) => {
                        if (typeof v !== 'string') {
                            throw new Error('DOB must be a string');
                        }
                    }
                ]
            }
        }
        expect(table.columns.length).toBe(3); // 2 + id column
    })

    it('should get column', () => {
        expect(table.getColumn('name').name).toBe('name');
        expect(table.getColumn('age').name).toBe('age');
    })

    it('should add timestamp columns', () => {
        table.addTimestamps();
        expect(table.columns.length).toBe(5);
        expect(table.columns.map(col => col.name)).toStrictEqual(['id', 'name', 'age', 'created_at', 'updated_at']);
        expect(table.getColumn('created_at').sql).toBe('created_at timestamp default now()');
        expect(table.getColumn('updated_at').sql).toBe('updated_at timestamp default now()');
    })

    it('should add paranoid columns', () => {

        expect(() => { table.setParanoid() }).toThrow('NO_TIMESTAMPS: Please set timestamps before setting paranoid')

        table = new Table('testTable', cols, { timestamps: true })
        table.setParanoid()
        expect(table.getColumn('deleted_at').sql).toBe('deleted_at timestamp');
    })

    it('should get column names', () => {
        expect(table.getColumnNames()).toEqual(['id', 'name', 'age']);
    })

    it('should get column names with timestamps', () => {
        table.addTimestamps();
        expect(table.getColumnNames()).toEqual(['id', 'name', 'age']);
        expect(table.getColumnNames(true)).toEqual(['id', 'name', 'age', 'created_at', 'updated_at']);
    })

    it('should return valid inputs', () => {
        const input = {
            name: 'test',
            age: 10,
            gender: 'male',
            dob: '10-3-1990'
        }
        const result = {
            name: 'test',
            age: 10
        }
        expect(table.getValidInputs(input)).toEqual(result);
    })

    it('should return arranged inputs', () => {
        const input = {
            age: 10,
            name: 'test',
        }
        const result = ['test', 10]

        expect(table.getInputsArrangedAsColumns(input)).toEqual(result);
    })

    it('should run validations for all columns', () => {
        expect(() => { table.runValidations({ name: 'john doe', age: -10 }) }).toThrow('Age must be positive')

        expect(() => { table.runValidations({ name: 'john', age: 20 }) }).toThrow('Name must be at least 5 characters long')
    })
})
