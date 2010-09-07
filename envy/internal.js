var _top = coroutine.running();

exports.isTop = function() {
    return coroutine.running() ==- _top;
}

exports.wrapLogger = function(logger) {
    origInfo = logger.info
    logger.info = function() {
        var args = [].slice.call(arguments, 0)
        args.splice(0,0, coroutine.running() + "")
        origInfo.apply(logger, args);
    }
    return logger;
}

exports.wrapLogger(logger);


var _resumes = [];
var scheduleResume = exports.scheduleResume = function scheduleResume(coro, arg) {
    var handle = Math.random();
    if (typeof(coro) != 'object') {
        logger.info('setting timeout for', typeof(coro));
        throw new Error('invalid type for coro', typeof(coro));
    }
//    logger.info('_resumes CURRENTLY', _resumes.length);
    _resumes.push([coro, arg]);
    if (_resumes.length == 1) {
        setTimeout(_doResumes, 0);
    }
}

function _doResumes() {
    while(_resumes.length) {
        var r = _resumes.shift();
        var coro = r[0];
        var arg = r[1];
        coroutine.resume(coro, arg);
    }
}

//var _sleep = [];
exports.sleep = function(ms) {
    var coro = coroutine.running();
    setTimeout(function() {
        coroutine.resume(coro);
    }, ms);
    coroutine.yield();
}


function wrapper(opts) {
    opts.f.apply(null, opts.args);
}

_id = 0;
exports.spawn = function(f) {
    if (typeof(f) != "function") {
        throw new Error("First argument must be a function");
    }

    var args = [].slice.call(arguments, 1);
    var coro = coroutine.create(wrapper);
    coro.id = ++_id;
    coro.toString = function() { return "[Coro " + this.id + "]" }
    scheduleResume(coro, {f: f, args: args});

}


