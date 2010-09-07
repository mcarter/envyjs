jsio('import ..envy');

var COUNT = 2;
var TOTAL = 10;
var s = new envy.Semaphore(COUNT);

var acquirers = [];
var count = 0;
var total = 0;
function foo(i) {
    acquirers.push(i);
    s.acquire();
    count++;
    if (count > COUNT) {
        logger.warn('To many coros were able to acquire the lock!');
        process.exit(1);
    }
    envy.sleep(10);
    s.release();
    count--;
    var k = acquirers.shift();
    if (i != k) {
        logger.warn('TEST FAILED ordering of acquirers', i, k, acquirers);
        process.exit(1)
    }
    if (++total == TOTAL) {
        logger.info('TEST PASSED!');
    }
}

for (var i = 0; i < TOTAL; ++i) {
    envy.spawn(foo, i);
}