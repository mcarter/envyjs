jsio('import .internal');
internal.wrapLogger(logger);

exports = Class(function() {
    
    this.init = function(size) {
        if (typeof(size) != 'number') { size = 0; }
        if (size < 0) { throw new Error("size must be at least 0"); }
        this._size = size;
        this._queue = [];
        this._overflow = [];
        this._putters = [];
        this._getters = [];
        this._rescheduling = false;
        this._isInfinite = false;
        this._infinitePayload = null;
    }


    this.get = function(block) {
        block = block === undefined || block;
        if (this._isInfinite) {
            return this._infinitePayload;
        }
        if (!this._queue.length || this._rescheduling) {
            //block until something is ready, then get it.
            this._getters.push(coroutine.running());
            coroutine.yield();
            this._rescheduling = false;
         }
         var item = this._queue.shift();
         if (this._putters) {
            var putter = this._putters.shift();
            internal.scheduleResume(putter);
        }
        this._maybeWakeupGetter();
//        logger.info('get returns', item);
        return item;
    }
        

    this.put = function(item, block) {
//        logger.info('put entry', item);
        block = block === undefined || block;
        if (this._queue.length >= this._size && !block) { 
            throw new Error("Queue is full");
        }
        this._queue.push(item);
        this._maybeWakeupGetter();
        if (this._queue.length >= this._size) {
            this._putters.push(coroutine.running());
//            logger.info('put yielding, item=', item);
            coroutine.yield();
        }
    }

    this.putInfinite = function(item) {
        this._isInfinite = true;
        this._infinitePayload = item;
        var count = this._putters.length + this._queue.length - this._getters.length;
        for (var i = 0; i < count; ++i) {
            this._queue.push(item);
        }
        this._maybeWakeupGetter();
    }

    this._maybeWakeupGetter = function() {
        if (this._getters.length && !this._rescheduling && this._queue.length) {
            var getter = this._getters.shift();
            internal.scheduleResume(getter);
            this._rescheduling = true;
        }

    }
/*
    this.put = function(item, block) {
//        var logger = logging.get('put');
        // By default wait=true
        block = block === undefined || block;
        if (this._queue.length >= this._size) {
            if (!block) { throw new Error("Queue is full"); }
            this._putters.push(coroutine.running());
            logger.info('BBB', item);
            this._queue.push(item)
            return coroutine.yield();
        }
        logger.info('AAA', item);
        this._queue.push(item);
        this._maybeWakeupGetter();
    }

    this._maybeWakeupGetter = function() {
        if (this._queue.length && this._getters.length && !this._rescheduling) {
            getter = this._getters.shift();
            logger.info('+++++++++', 'wake up getter', getter);
            internal.scheduleResume(getter);
            this._rescheduling = true;
        }
    }
    this.get = function(block) {
//        var logger = logging.get('get');
        logger.info('mMm enter get', coroutine.running());
        block = block === undefined || block;
        var item;
        if (!this._queue.length || this._rescheduling) {
            if (!block) { throw new Error("Queue is empty"); }
            this._getters.push(coroutine.running());
            coroutine.yield();
            logger.info('XXX', this._queue, coroutine.running());
            item = this._queue.shift();
            this._rescheduling = false;
            this._maybeWakeupGetter();
            if (this._putters.length) {
                var putter = this._putters.shift();
                internal.scheduleResume(putter);
            }

        } else {
            logger.info('YYY', this._queue, coroutine.running());
            item = this._queue.shift();
            if (this._putters.length) {
                var putter = this._putters.shift();
                internal.scheduleResume(putter);
            }
        }
        logger.info('rescheduling is', this._rescheduling, this._queue);
        return item;
    }
    */
})