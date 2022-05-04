const { Options } = require('../dist/index.js');

describe('Options Class', () => {
    it('should be defined', () => {
        expect(Options).toBeDefined();
    });

    it('should have config property', () => {
        expect(new Options({}, {}).config).toBeDefined();
    });

    it('should return default options if no options are passed', () => {
        let defaultOptions = {
            prefix: '',
            pkName: 'id',
            pkType: 'serial',
            alter: false,
            paranoid: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        }

        expect(new Options({}, defaultOptions).config).toEqual(defaultOptions);
    })

    it('should return {} if one of params are undefined', () => {
        expect(new Options(undefined, {}).config).toEqual({});
        expect(new Options({}, undefined).config).toEqual({});
    })


    it('should overwrite options with default options', () => {
        let defaultOptions = {
            prefix: '',
            pkName: 'id',
            pkType: 'serial',
            alter: false,
            paranoid: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        }

        let options = {
            prefix: 'test_',
            pkName: 'test_id',
            pkType: 'test_serial',
        }

        let result = {
            prefix: 'test_',
            pkName: 'test_id',
            pkType: 'test_serial',
            alter: false,
            paranoid: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        }

        let optionsInstance = new Options(options, defaultOptions);
        expect(optionsInstance.config).toEqual(result);
    });


})
