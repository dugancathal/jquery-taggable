( function( $ ) {

  $.widget( 'ui.taggable', {

    options: {
      // Maps directly to the jQueryUI Autocompleter
      tagSource: [],
      // How to trigger tag completion
      triggerKeys: [ 'space', 'comma' ],
      // Whether or not to make a select for form submission
      renderSelect: true,
      // Only allow tags from the source
      allowNewTags: false,
      // Tags are, by default, case IN-sensitive
      caseSensitive: false,
      // Should not allow duplicate tags
      duplicateTagging: false,
      // Max number of tags allowed
      maxTags: undefined,
      // Shortest text length for source autocompletion
      minLength: 2,
      // Class name for themeing - defaults : 'taggable'
      // The plugin will create at least taggable-input, taggable-close and taggable-new
      // If renderSelect is chosen, it will also render a taggable-select
      themeNamespace: 'taggable'
    },

    _splitTagOn: {
      'space': / /g,
      'comma': /,/g
    },

    _keys: {
      backspace: [8],
      enter:     [13],
      space:     [32],
      comma:     [44, 188],
      tab:       [9]
    },
    
    _create: function() {
      var self = this;
      self.tagList = [];
      self.timer = null;
      var autocompleteOptions = {};
      autocompleteOptions.source = self.options.tagSource;
      autocompleteOptions.appendTo = self.element;
      autocompleteOptions.select = function(event, ui) {
        event.preventDefault();
        self.input.data('autoCompleteTag', true);
        self.input.val('');
        if(self.options.maxTags === undefined || self.tagList.length < self.options.maxTags) {
          self.addTag(ui.item);
        }
      }
      autocompleteOptions.autoFocus = !self.options.allowNewTags;

      var close_class = self.options.themeNamespace + "-close";
      var input_class = self.options.themeNamespace + "-input";

      // Themeable business
      self.element.addClass(self.options.themeNamespace);

      self.element.html("<div class='?-container'><li class='?-new'><input class='?-input' type='text'/></li></div>".
        replace(/\?/g, self.options.themeNamespace)
      );

      self.input = self.element.find("." + input_class);
      self.input.autocomplete(autocompleteOptions);
      
      $(self.element).click(function(e) {
        self.input.focus();
        self.input.autocomplete('search');
      });

      if(this.options.renderSelect) {
        var select_html = "<select class='?-select' name='?_select' multiple='multiple'></select>";
        this.select = $(select_html.replace(/\?/g, this.options.themeNamespace));
        this.select.hide();
        this.element.after(this.select);
      }
    },

    removeTag: function(tag) {
      if(tag === undefined)
        tag = self.tagList.pop();
      else
        self.tagList.splice(tag.index, 1);
    },

    addTag: function(uiItem) {
      if(this.options.duplicateTagging || !this._tagExists(uiItem)) {
        if(this.options.renderSelect) {
          var option_html = "<option value='" + uiItem.value + "' selected='selected'>" + uiItem.label + "</option>";
          this.select.append(option_html);
        }
        this.tagList.push(uiItem);
        var choice_html = "<li class='?-choice' data-value='" + uiItem.value + "'>" + uiItem.label + "<a href='#' class='?-close'>&times;</a></li>";
        this.input.parent().before(choice_html.replace(/\?/, this.options.themeNamespace));
      }
    },

    _tagExists: function(toFind) {
      var found = false
      for(i=0; i< this.tagList.length; i++) {
        if(this.tagList[i].value == toFind.value) {
          found = true;
          break;
        }
      }
      return found;
    },
    
    _setOption: function(key, value) {
      // Handle changing keys' values
      switch( key ) {

      }
    },

    _destroy: function() {

    }
  })
})( jQuery );