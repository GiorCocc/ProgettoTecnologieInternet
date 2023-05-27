ig.module(
  'game.events'
)
  .defines(function () {

    EventEmitter = ig.Class.extend({
      lastToken: 0,
      subscribers: null,


      
      // Method to initialize the event emitter by creating a subscribers object
      init: function () { 
        this.subscribers = {}; 
      },

      
      
      // Method to destroy the event emitter by setting the subscribers object to null
      destroy: function () { 
        this.subscribers = null; 
      },

      
      
      // Method to emit an event
      emit: function (event) {
        var emitArgs = [].slice.call(arguments, 1);

        for (var k in this.subscribers) {
          sub = this.subscribers[k];

          // check if the event matches the event of the subscriber and if so, call the subscriber
          if (sub.event === event) {
            sub.subscriber.apply(sub.context, emitArgs);
          }
        }
      },

      
      
      // Method to subscribe to an event
      on: function (event, subscriber, context) {
        var token = ++this.lastToken; // increment the last token

        // create a subscriber and add it to the subscribers object
        this.subscribers[token] = {
          event: event,
          subscriber: subscriber,
          context: context
        };

        return token;
      },

      
      // remove a subscriber from the subscribers object
      off: function (token) { 
        delete this.subscribers[token]; 
      },



    });


    // Events module
    // This module is used to listen to events and emit events using the EventEmitter class
    Events = {

      Emitter: EventEmitter,

      listen: function () { this._listen('addEventListener', arguments); },
      unlisten: function () { this._unlisten('removeEventListener', arguments); },
      on: function () { this._listen('on', arguments); },
      off: function () { this._unlisten('off', arguments); },

      
      
      // Method to listen to an event
      _listen: function (method, argsObject) {
        var args = [].slice.apply(argsObject);

        // parse the arguments
        var object = args[0];
        var handlers = args[1];
        var context = args[2];
        var bindArgs = args.slice(2);

        for (var k in handlers) {
          var bound = context[k + '_bound'] = handlers[k].bind.apply(handlers[k], bindArgs);
          object[method](k, bound);
        }
      },

      
      
      // Method to unlisten to an event
      _unlisten: function (method, args) {
        // parse the arguments
        var object = args[0];
        var handlers = args[1];
        var context = args[2];

        for (var k in handlers) {
          object[method](k, context[k + '_bound']);
        }
      }



    };

  });
