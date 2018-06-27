(function($) {

  $.MiradorLegacyStrategy = function(options) {
    jQuery.extend(this, {
      
    }, options);
    this.init();
  };
  
  $.MiradorLegacyStrategy.prototype = {
    init: function() {
      
    },
    
    // Check whether an annotation is supported under this formatting strategy
    isThisType: function(annotation) {
      if (annotation.on && typeof annotation.on === 'object' &&
          annotation.on.selector && typeof annotation.on.selector === 'object' &&
          annotation.on.selector.value && typeof annotation.on.selector.value === 'string' &&
          annotation.on.selector['@type'] === 'oa:FragmentSelector') {
        return annotation.on.selector.value.indexOf('xywh=') === 0;
      }
      return false;
    },
    
    // Build the selector into a bare annotation, given a Window and an OsdSvgOverlay
    buildAnnotation: function(options) {
      var oaAnno = options.annotation,
          win = options.window,
          overlay = options.overlay,
          bounds = overlay.draftPaths[0].bounds;
      oaAnno.on = {
        "@type": "oa:SpecificResource",
        "full": win.canvasID,
        "selector": {
          "@type": "oa:FragmentSelector",
          "value": "xywh=" + Math.round(bounds.x) + "," + Math.round(bounds.y) + "," + Math.round(bounds.width) + "," + Math.round(bounds.height)
        }
      };
      return oaAnno;
    },
    
    // Parse the annotation into the OsdRegionDrawTool instance (only if its format is supported by this strategy)
    parseRegion: function(annotation, osdRegionDrawTool) {
      if (this.isThisType(annotation)) {
        return osdRegionDrawTool.parseRectangle(annotation.on.full + "#" + annotation.on.selector.value, annotation);
      }
    },
  };
  
}(Mirador));