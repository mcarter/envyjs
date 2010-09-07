jsio('import .internal');
jsio('import .Semaphore');
jsio('import .Event');

exports = Class(function() {
    
    this.init = function(stream) {
        this._stream = stream;
        this._sendLock = new Semaphore();
        this._recvLock = new Semaphore();
        stream.on('close', this._on_close);
        stream.pause();
        this._closed = false;
    }
    
    this._on_close = function() {
        this._closed = true;
        logger.info('closed...');
        // TODO: probably throw an exception into any locked coros
        //       (so I guess we should hold on to those events)
        //       Though, perhaps locks should be able to throw exceptions
        //       into their related (and suspended) coros.
        //       -mcarter 9/7/10
    }

    this.send = function(data) {
        if (this._close) { throw new Error('Socket is closed'); }
        this._sendLock.acquire();
        this._stream.write(data);
        var ev = new Event();
        this._stream.on('drain', bind(ev, 'send'));
        try {
            ev.wait();
        } finally {
            this._sendLock.release();
        }
    }

    this.recv = function() {
        this._recvLock.acquire();
        var ev = new Event();
        this._stream.on('data', bind(ev, 'send'))
        try {
            return ev.wait()
        } finally {
            this._recvLock.release();
        }
    }

    this.close = function() {
        this._stream.close();
    }
});

