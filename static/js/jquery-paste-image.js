(function($) {
    var defaults = {
        callback: $.noop,
        matchType: /image.*/,
    };

    $.fn.pasteImageReader = function(options) {
        if(typeof(options) == 'function') {
            options = {
                callback: options
            };
        }
        options = $.extend({}, defaults, options);

        this.each(function() {
            var element = this;
            $this = $(this);
            $this.bind('paste', function(event) {
                console.debug("ON paste");
                var found = false;
                var clipboardData = event.originalEvent.clipboardData;
                [].forEach.call(clipboardData.types, function(type, i) {
                    if(found) return false;

                    if(type.match(options.matchType) 
                        || clipboardData.items[i].type.match(options.matchType)) {
                        console.debug("Found an image");
                        var file = clipboardData.items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = function(evt) {
                            options.callback.call(element, {
                                dataURL: evt.target.result,
                                event: evt,
                                file: file,
                                name: file.name,
                            });
                        };
                        reader.readAsDataURL(file);
                        found = true;
                    }
                });
            });
        });
    };
})(jQuery);
