var net = jsio.__env.require('net')
jsio('import .Queue');
jsio('import .Socket');

exports = Class(function() {
    this.init = function(opts) {
        this._interface = opts.interface;
        this._port = opts.port;
        this._server = net.createServer(bind(this, '_accept'))
        this._server.listen(this._port, this._interface);
        this._accept_queue = new Queue(64);
    }

    this.accept = function() {
        return this._accept_queue.get();
    }

    this._accept = function(stream) {
        this._accept_queue.put(new Socket(stream)); 
    }

    this.close = function() {
        this._server.close();
        this._accept_queue.putInfinite(new Error("ListeningSocket is closed"));
    }

});