var id = 'ui:Button:Select',
  Class = li.require( 'libraries/ptclass' ),
  Button = li.require( 'ui/Button' ),
  SelectButton;

/**
 * Representation of a button element
 * @class SelectButton
 * @constructor
 * @extends Abstract
 * @param {HTMLElement} element The HTML element surrounded by the control
 * @param {Object} settings Configuration properties for this instance
 */
SelectButton =  Class.create( Button, {
   initialize: function( $super, $element, settings ) {
    /**
     * Instance of SelectButton
     * @property Select
     * @type Object
     */
    var SelectButton = this,
      /**
       * Default configuration values
       * @property defaults
       * @type Object
       */
      defaults = {
        on: 'click',
        action: 'select'
      },
      item;

    settings = _.extend( settings, defaults );
    $super( $element, settings );

  }
} );

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = SelectButton;
}