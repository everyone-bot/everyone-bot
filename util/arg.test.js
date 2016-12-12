import test from 'ava';
const arg = require('./arg');

/////////////////////
// Check if exists //
/////////////////////

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

test('checkifExists should throw an error with a friendly message', t => {
    const apple = undefined;
    const error = t.throws(() => {
        arg.checkIfExists(apple, 'apple');
    });

    t.is(error.message, 'apple does not exist');
});

test('checkIfExists should not throw if the supplied value is null', t => {
    t.notThrows(() => {
        arg.checkIfExists(null);
    });
});

////////////////////////////
// Check if null or empty //
////////////////////////////

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

test('checkIfNullOrEmpty should throw an error with a friendly message', t => {
    const username = '';
    const error = t.throws(() => {
        arg.checkIfNullOrEmpty(username, 'username');
    });

    t.is(error.message, 'username was null or empty');
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

/////////////////////
// Check if number //
/////////////////////

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

test('checkIfNumber should throw an error with a friendly message', t => {
    const age = '22';
    const error = t.throws(() => {
        arg.checkIfNumber(age, 'age');
    });

    t.is(error.message, 'age was not a number');
});

test('checkIfNumber should not throw if the supplied value is a positive number', t => {
   t.notThrows(() => {
        arg.checkIfNumber(1);
   });
});

test('checkIfNumber should not throw if the supplied value is a zero', t => {
    t.notThrows(() => {
        arg.checkIfNumber(0);
   });
});

test('checkIfNumber should not throw if the supplied value is a negative number', t => {
    t.notThrows(() => {
        arg.checkIfNumber(-1);
   });
});

test('checkIfNumber should not throw if the supplied value is the number max value', t => {
    t.notThrows(() => {
        arg.checkIfNumber(Number.MAX_VALUE);
    });
});

test('checkIfNumber should not throw if the supplied value is the number min value', t => {
    t.notThrows(() => {
        arg.checkIfNumber(Number.MIN_VALUE);
    });
});

test('checkIfNumber should not throw if the supplied value is NaN', t => {
    t.notThrows(() => {
        arg.checkIfNumber(NaN);
    });
});

////////////////////
// Check if array //
////////////////////

test('checkIfArray should throw if the supplied value is not defined', t => {
    t.throws(() => {
        arg.checkIfArray();
    });
});

test('checkIfArray should throw if the supplied value is a string', t => {
    const notAnArray = 'clearly not an array';

    t.throws(() => {
        arg.checkIfArray(notAnArray, 'notAnArray');
    });
});

test('checkIfArray should not throw if supplied an array', t => {
    t.notThrows(() => {
        arg.checkIfArray([1, 2, 3], 'someArray');
    });
});

test('checkIfArray should not throw if supplied an array of undefines', t => {
    t.notThrows(() => {
        arg.checkIfArray(new Array(5), 'newArray');
    });
});

test('checkIfArray should throw a friendly error', t => {
    const someNumber = 10;

    const error = t.throws(() => {
        arg.checkIfArray(someNumber, 'someNumber');
    });

    t.is(error.constructor, SyntaxError);
    t.is(error.message, 'someNumber was not an array');
});