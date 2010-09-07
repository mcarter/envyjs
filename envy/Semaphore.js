jsio('import .internal');
exports = Class(function() {
    this.init = function(size) {
        if (typeof(size) != 'number') { size= 1; }
        if (size < 1) { throw new Error("size must be at least 1"); }
        this._size = size;
        this._waiters = [];
        this._count = 0;
    }

    this.acquire = function() {
        if (this._count == this._size) {
            this._waiters.push(coroutine.running());
            try {
                coroutine.yield();
            } catch(e) {
                var i = this._waiters.indexOf(coroutine.running());
                if (i != -1) { this._waiters.splice(i,1); }
                throw e;
            }
        }
        this._count++;
    }

    this.release = function() {
        this._count--;
        if (this._waiters.length) {
            var coro = this._waiters.shift()
            internal.scheduleResume(coro);
        }
    }

});