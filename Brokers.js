var Logger = require("pavlism-logger");

//Brokers are a set ob golbal static objects that can broker information between different objects.
var log = new Logger('Broker.js', CLL.warn);

Broker = class Broker {

    static addListener (connection, listenerArgs, callback) {
            if (Lib.JS.isUndefined(EventBroker.connections[connection])) {
                EventBroker.connections[connection] = [];
            }
            var eventObj = {connection: connection, listenerArgs: listenerArgs, callback: callback};
            EventBroker.connections[connection].push(eventObj);
            return eventObj;
    };
	/**
         * This will trigger a custom event and can be listened to from anywhere else in the program
         * 
         * @param events {string} event name (must be unique string) to trigger
         * @param triggerArgs {object} The object the will get passed to the listeners callback function as triggerArgs
         */
        //Used to remove a listeneter, used if you only want to listen to an event once
        static remove = (listener) {
            Lib.JS.remove(EventBroker.connection[listener.connection], listener);
        };
}

Broker.connections = [];


//The event broker is public static moderator object.  It allows any object to trigger and/or listen to custome events.
//Events must have unique string names.

EventBroker = class EventBroker extends Broker{
        var EBlog = new Logger('EventBroker.js', CLL.warn);

        /**
         * This will setup a function to fire when the event(s) is triggered
         * 
         * Example:
         * EventBroker.listen('event.name', {data:1}, function (listenerArgs, triggerArgs) {
         *    do stuff;
         * });
         * 
         * @param events {string/string array} event name (must be unique string) or array of unique strings
         * @param listenerArgs {object} The object the will get passed to the callback as  listenerArgs
         * @param callback {function} Function to call when event is triggered.
         */
        listen (events, listenerArgs, callback) {
            if (!Lib.JS.isString(events) && !$.isArray(events)) {
                EBlog.error("The first paramater (events) must be a string or array of strings that represents the event to listen too");
            }

            if (Lib.JS.isUndefined(listenerArgs)) {
                EBlog.error("The second paramater must be an object (listenerArgs) or the call back function")
            }

            if (!Lib.JS.isUndefined(callback) && !Lib.JS.isFunction(callback)) {
                EBlog.error("The third paramater must be an function");
            }

            if (Lib.JS.isFunction(listenerArgs)) {
                callback = listenerArgs;
                listenerArgs = {};
            }

            if ($.isArray(events)) {
                var listeners = [];
                var eventCounter = 0;
                for (eventCounter = 0; eventCounter < events.length; eventCounter++) {
                    listeners.push(this.addListener(events[eventCounter], listenerArgs, callback));
                }
            } else {
                return this.addListener(events, listenerArgs, callback);
            }
        };

        trigger (event, triggerArgs) {
            triggerArgs = Lib.JS.setDefaultParameter(triggerArgs, {});

            if (Lib.JS.isUndefined(EventBroker.connections[event]) || EventBroker.connections[event].length === 0) {
                EBlog.warn('the event ' + event + ' does not have any listeners');
                return false;
            }

            var listenerCounter = 0;

            for (listenerCounter = 0; listenerCounter < EventBroker.connections[event].length; listenerCounter++) {
                var listener = EventBroker.connections[event][listenerCounter];
                listener.callback(listener.listenerArgs, triggerArgs);
            }
        };
}

	
		

//The data broker is public static moderator object.  It allows any object to trigger and/or listen to custome data calls.
//DataCalls must have unique string names.
var DBlog = new Logger('DataBroker.js', CLL.warn);
DataBroker = class DataBroker extends Broker{
        var DBlog = new Logger('DataBroker.js', CLL.warn);

        /**
         * This will setup a function to fire when the event(s) is triggered
         * 
         * Example:
         * EventBroker.listen('event.name', {data:1}, function (listenerArgs, triggerArgs) {
         *    do stuff;
         * });
         * 
         * @param events {string/string array} event name (must be unique string) or array of unique strings
         * @param listenerArgs {object} The object the will get passed to the callback as  listenerArgs
         * @param callback {function} Function to call when event is triggered.
         */
        listen (events, listenerArgs, callback) {
            if (!Lib.JS.isString(dataCall) && !$.isArray(dataCall)) {
                DBlog.error("The first paramater (dataCalls) must be a string or array of strings that represents the dataCall to listen too");
            }

            if (Lib.JS.isUndefined(listenerArgs)) {
                DBlog.error("The second paramater must be an object (listenerArgs) or the call back function")
            }

            if (!Lib.JS.isUndefined(callback) && !Lib.JS.isFunction(callback)) {
                DBlog.error("The third paramater must be an function");
            }

            if (Lib.JS.isFunction(listenerArgs)) {
                callback = listenerArgs;
                listenerArgs = {};
            }

            if ($.isArray(dataCall)) {
                DBlog.error("dataCall listeners must be unique");
            } else {
                return this.addListener(dataCall, listenerArgs, callback);
            }
        };

        trigger (event, triggerArgs) {
            triggerArgs = Lib.JS.setDefaultParameter(triggerArgs, {});

            if (Lib.JS.isUndefined(DataBroker.connections[dataCall]) || DataBroker.connections[dataCall].length === 0) {
                DBlog.warn('the dataCall ' + dataCall + ' does not have any listeners');
                return false;
            }

            var listener = DataBroker.connections[dataCall][0];
            return listener.callback(listener.listenerArgs, triggerArgs);
        };
}
module.exports = {DataBroker, EventBroker};