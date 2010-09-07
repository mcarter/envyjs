jsio('import .envy.internal');
jsio('import .envy.Queue, .envy.Semaphore');

exports.spawn = envy.internal.spawn;
exports.sleep = envy.internal.sleep;
exports.Queue = envy.Queue;
exports.Semaphore = envy.Semaphore;
exports.wrapLogger = envy.internal.wrapLogger


/*
var _spawn = [];

function spawner() {
    var errs = [];
    while (_spawn.length) {
        var fullArgs = _spawn.shift()
        var coro = coroutine.create.apply(coroutine, fullArgs);
        switchTo(coro);
    }
}

function switchTo(coro) {
    var yieldReason;
    if (yieldReason = coroutine.resume(coro)) {
        yieldReason.action();
    }
}


var YieldReason= Class(function() {

    this.action = function() {

    }

})

var YieldWait = Class(function() {
    this.init = function(ms) {
        this._waitTime = ms;
    }

    this.action = function() {
        
    }
});



green.spawn(lopy);

function loopy() {
    while(true) {
        green.sleep(0);
    }
}


exports.spawn = function(target) {
    if (typeof(target) != "function") {
        throw new Error("First argument must be a function");
    }
    _spawn.push(arguments);
    if (_spawn.length == 1) {
        setTimeout(spawner, 0);
    }
}



green = {}


green.spawn(...)
green.wait(...)
green.listen(interface, port)
green.connect(hostname, port)


green.Event
    put
    get

green.Queue
    put
    get

green.Semaphore



 
var Hub = 



Socket {
    read(...)
    send(...)
}

*/