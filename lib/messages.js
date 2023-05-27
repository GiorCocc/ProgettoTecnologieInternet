/**
 * This file contains the definition of the MessageBuilder object.
 * This object is used to create messages and serialize/deserialize them. 
 */

(function(global) {

  // regular expression to convert underlined names to camel case
  var UNDERLINED_RX = /(^\w|_\w)/g;

  var MessageBuilder = {
    
    init: function() {
      this.typeProps = {};
      this.ctors = {};
    },



    // Register a message type with its properties 
    registerMessageType: function(messageType, messagePropNames) {
      // Register message fields structure
      this.typeProps[messageType] = messagePropNames;

      // Create message prototype
      var messageProto = {};

      for (var pi = 0; pi < messagePropNames.length; pi++) {
        var propName = messagePropNames[pi];
        var propCamelCase = camelCase(propName);

        // Add getter and setter for each property
        messageProto['get' + propCamelCase] = getter(propName);
        messageProto['set' + propCamelCase] = setter(propName);
      }

      var ctr = function() {
        this.type = messageType;
      };

      ctr.prototype = messageProto;
      
      this.ctors[messageType] = ctr;
    },



    // Serialize a message to an array buffer
    serialize: function(message) {
      var type = message.getType();

      if (!this.typeProps[type]) {
        throw new Error('Unknown message. Type =' + type);
      }

      // Create an array buffer
      var messageProps = this.typeProps[type];
      var arrayBuffer = new ArrayBuffer(messageProps.length * 2);
      var bufferView = new Int16Array(arrayBuffer);

      // For every prop: write it at proper place to array view
      for (var i = 0; i < messageProps.length; i++) {
        var prop = messageProps[i];
        bufferView[i] = message[prop];
      }

      return arrayBuffer;
    },


    
    // Deserialize an array buffer to a message
    deserialize: function(arrayBuffer) {
      var bufferView = new Int16Array(arrayBuffer);
      var type = bufferView[0];
      var message = new this.ctors[type]();
      var messageProps = this.typeProps[type];

      for (var i = 0; i < messageProps.length; i++) {
        var prop = messageProps[i];
        message[prop] = bufferView[i];
      }

      return message;
    },



    // Create a message of a given type
    createMessage: function(type) {
      if (!this.typeProps[type]) {
        throw new Error('Unknown message. Type =' + type);
      }

      return new this.ctors[type]();
    }
  };



  MessageBuilder.init();

  // Definition of getter functions
  function getter(propName) {
    return function() {
      return this[propName];
    };
  }



  // Definition of setter functions
  function setter(propName) {
    return function(value) {
      this[propName] = value;
      return this;
    };
  }



  // Convert an underlined name to camel case
  function camelCase(name) {
    return name.replace(UNDERLINED_RX, function($1) {
      return $1.replace('_', '').toUpperCase();
    });
  }



  global.MessageBuilder = MessageBuilder;



})(window);
