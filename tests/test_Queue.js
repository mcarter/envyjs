jsio('import ..envy as green');
green.wrapLogger(logger);

var output = []

function p1(q, k) {
    // necessary to get ordering right. Otherwise p2 (1) calls get twice before 
    // blocking and p2 (2) never gets to run.
    green.sleep(10); 
    for (var i = 1; i <k; ++i) {
        var handle = Math.random()
        q.put(i);
    }
}

function p2(q, k, m) {
//    logger.info('ENTER p2', m);
    for (var i = 1; i <= k; ++i) {
//        logger.info('** + p2 calls get, i =', i +',', ' k =', k);
        var val = q.get();
        output.push([m, val]);
//        logger.info('p2 get returns', val);
//        logger.info('p2 ok..');
//        logger.info('** - ', val, '(' + m + ')');
    }
//    logger.info('p2(' + m + ') complete');
}

function checker() {
    green.sleep(1000)
    while (true) {
        green.sleep(10);
        if (output.length < 19) { continue; }
        break;
    }
    var last = null;
    for (var i = 0, val; val = output[i]; ++i) {
        if (val[1] != i+1) { logger.warn('INVALID result queue order returned at position', i, output); return;}
        if (val[0] == last) { logger.warn('INVALID getter ordering at position', i, output); return;}
        last = val[0];
    }
    logger.info('TEST PASSED');
}
q = new green.Queue(0);
green.spawn(p1, q, 20);
green.spawn(p2, q, 10, 1);
green.spawn(p2, q, 10, 2);
green.spawn(checker);
//green.spawn(p3, q);
//green.sleep(10000);
//coroutine.yield();
logger.info('start sleeping');


/*setTimeout(function() {
logger.info('done sleeping');
}, 10000);
*/