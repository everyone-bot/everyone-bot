import test from 'ava';
const arg = require('./arg');

test('checkIfExists should throw if not supplied any args', t => {
    t.throws(() => {
        arg.checkIfExists();
    });
});

test('checkIfExists should throw if the supplied value is undefined', t => {
    t.throws(() => {
        arg.checkIfExists(undefined);
    });
});

test('checkIfExists should not throw if the supplied value is null', t => {
    t.notThrows(() => {
        arg.checkIfExists(null);
    });
});

test('checkIfNullOrEmpty should throw if not supplied any args', t => {
    t.throws(() => {
        arg.checkIfNullOrEmpty();
    });
});

test('checkIfNullOrEmpty should throw if the supplied value is undefined', t => {
    t.throws(() => {
        arg.checkIfNullOrEmpty(undefined);
    });
});

test('checkIfNullOrEmpty should throw if the supplied value is null', t => {
    t.throws(() => {
        arg.checkIfNullOrEmpty(null);
    });
});

test('checkIfNullOrEmpty should throw if the supplied value is an empty string', t => {
     t.throws(() => {
        arg.checkIfNullOrEmpty('');
     });
});

test('checkIfNullOrEmpty should not throw if the supplied value is a truthy string', t => {
    t.notThrows(() => {
        arg.checkIfNullOrEmpty('1');
    });
});

test('checkIfNullOrEmpty should not throw if the supplied value is a falsy string', t => {
    t.notThrows(() => {
        arg.checkIfNullOrEmpty('-1');
    });
});

test('checkIfNumber should throw if not supplied any args', t => {
    t.throws(() => {
        arg.checkIfNumber();
    });
});

test('checkIfNumber should throw if the supplied value is undefined', t => {
    t.throws(() => {
        arg.checkIfNumber(undefined);
    });
});

test('checkIfNumber should throw if the supplied value is null', t => {
    t.throws(() => {
        arg.checkIfNumber(null);
    });
});

test('should not throw if the supplied value is a positive number', t => {
   t.notThrows(() => {
        arg.checkIfNumber(1);
   });
});

test('should not throw if the supplied value is a zero', t => {
    t.notThrows(() => {
        arg.checkIfNumber(0);
   });
});

test('should not throw if the supplied value is a negative number', t => {
    t.notThrows(() => {
        arg.checkIfNumber(-1);
   });
});

test('should not throw if the supplied value is the number max value', t => {
    t.notThrows(() => {
        arg.checkIfNumber(Number.MAX_VALUE);
    });
});

test('should not throw if the supplied value is the number min value', t => {
    t.notThrows(() => {
        arg.checkIfNumber(Number.MIN_VALUE);
    });
});

test('checkIfNumber should not throw if the supplied value is NaN', t => {
    t.notThrows(() => {
        arg.checkIfNumber(NaN);
    });
});