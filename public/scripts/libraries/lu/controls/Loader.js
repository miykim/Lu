/**
 * Representation of a Loader
 * @class Loader
 * @constructor
 * @extends Abstract
 * @requires ptclass
 * @param {HTMLElement} element The HTML element containing this component
 * @param {Object} settings Configuration properties for this instance  
 */ 
var Class = require( 'class' ),
  Abstract = require( 'lu/Abstract' ),
  Loader;

//TODO: Loader should take a $jquery object, a selector, a string, or a uri;

Loader = Class.create( Abstract, ( function () {

  // GLOBAL STATICS

  var LOADED_EVENT = 'LOADED',
    LOADING_EVENT = 'LOADING',
    LOADING_FLAG = 'lu-loading';

  // RETURN METHODS OBJECT
  return {
    /**
     * PTClass constructor 
     * @method initialize
     * @public
     * @param {Object} $super Pointer to superclass constructor
     * @param {Object} $element JQuery object for the element wrapped by the component
     * @param {Object} settings Configuration settings
     */    
    initialize: function ( $super, $element, settings ){
      // PRIVATE INSTANCE PROPERTIES
      /**
       * Instance of Button
       * @property Button
       * @type Object
       * @private
       */
      var Loader = this,
        /**
         * Default configuration values for all instances
         * @property defaults
         * @type Object
         * @private
         * @final
         */
        defaults = {
          /**
           * Method to be used when populating target nodes content. Expects: replace || append || prepend
           * @property method 
           * @type {String}
           */
          method: 'append'
        },
        /**
         * The node that the content is put into
         * @property content
         * @type Object
         * @private
         */
        $node;

      // MIX THE DEFAULTS INTO THE SETTINGS VALUES
      _.defaults( settings, defaults );

      $node = ( settings.node ) ? $( settings.node ) : $element;

      // CALL THE PARENT'S CONSTRUCTOR
      $super( $element, settings );

      /**
       * Loads the content into the specified node
       * @method load
       * @public
       * @param {String} url an Indicator for the content to load. This can be a hash (#id), a remote url or a url with a hash.
       * @return {Object} The Loader instance
       */
      Loader.load = function ( uri ) {
        var explodedURL = _.explodeURL( uri ),
          content,
          $content;

        Loader.trigger( LOADING_EVENT );
        $element.addClass( LOADING_FLAG );

        function inject( content ) {
          switch( settings.method ) {
            case 'prepend':
              $node.prepend( content );
              break;
            case 'append':
              $node.append( content );
              console.log( $node );
              break;
            default:
              $node.html( content );
              break;
          }
          $element.removeClass( LOADING_FLAG );
          Loader.trigger( LOADED_EVENT );
        }

        if ( explodedURL.path === '' ) {
          $content = $( uri );
          if( $content.length > 0 ) {
            content = $content.html();
          } else {
           content = $( '#' + explodedURL.fragment ).html(); 
          }
          inject( content );
        } else {
          $.ajax( {
            url: uri,
            success: function ( data, textStatus, jXHR ) {
              if( explodedURL.fragment ) {
                content = $( data ).find( '#' + explodedURL.fragment );
                inject( content );
              } else {
                content = data;
                inject( content );
              }
            }
          } );
        }
        return Loader;
      };

      //Event Bindings
      Loader.on( 'load', function( event, uri ) {
        if( uri === undefined ) {
          if( settings.uri ) {
            uri = settings.uri;
          } else {
            uri = $( event.target ).attr( 'href' ); 
          }
        }
        event.stopPropagation();
        event.preventDefault();
        Loader.load( uri );
      } );

    }
  };

}() ));

//Export to Common JS Loader
if( module ) {
  if( typeof module.setExports === 'function' ) {
    module.setExports( Loader );
  } else if( module.exports ) {
   module.exports = Loader; 
  }
}
