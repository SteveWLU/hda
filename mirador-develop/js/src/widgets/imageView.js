(function($) {

  $.ImageView = function(options) {

    jQuery.extend(this, {
      currentImg:       null,
      windowId:         null,
      currentImgIndex:  0,
      canvasID:         null,
      canvases:         null,
      imagesList:       [],
      imagesListRtl:    [],
      element:          null,
      elemOsd:          null,
      manifest:         null,
      osd:              null,
      osdOptions: {
        osdBounds:        null,
        zoomLevel:        null
      },
      osdCls: 'mirador-osd',
      elemAnno:         null,
      annoCls:          'annotation-canvas',
      annotationsLayer: null,
      forceShowControls: false,
      eventEmitter:     null,
      vDirectionStatus: ''
    }, options);

    this.init();
  };

  $.ImageView.prototype = {

    init: function() {
      var _this = this;
      this.horizontallyFlipped = false;
      this.originalDragHandler = null;
      if(this.vDirectionStatus == 'rtl'){
          this.imagesList =  this.imagesListRtl.concat();
       }
      // check (for thumbnail view) if the canvasID is set.
      // If not, make it page/item 1.
      if (this.canvasID !== null) {
        this.currentImgIndex = $.getImageIndexById(this.imagesList, this.canvasID);
      }

      if (!this.osdOptions) {
        this.osdOptions = {
          osdBounds:        null,
          zoomLevel:        null
        };
      }
      this.currentImg = this.imagesList[this.currentImgIndex];
      this.element = jQuery(this.template()).appendTo(this.appendTo);
      this.elemAnno = jQuery('<div/>')
        .addClass(this.annoCls)
        .appendTo(this.element);


      _this.eventEmitter.publish('UPDATE_FOCUS_IMAGES.' + this.windowId, {array: [this.canvasID]});

      var allTools = $.getTools(this.state.getStateProperty('drawingToolsSettings'));
      this.availableAnnotationTools = [];
      for ( var i = 0; i < this.state.getStateProperty('availableAnnotationDrawingTools').length; i++) {
        for ( var j = 0; j < allTools.length; j++) {
          if (this.state.getStateProperty('availableAnnotationDrawingTools')[i] == allTools[j].name) {
            var values = {};
            values.logoClass = allTools[j].logoClass;
            values.tooltip = allTools[j].tooltip;
            this.availableAnnotationTools.push(values);
          }
        }
      }
      // The hud controls are consistent
      // throughout any updates to the osd canvas.
      this.hud = new $.Hud({
        appendTo: this.element,
        qtipElement: this.qtipElement,
        bottomPanelAvailable: this.bottomPanelAvailable,
        windowId: this.windowId,
        canvasControls: this.canvasControls,
        annoEndpointAvailable: this.annoEndpointAvailable,
        showNextPrev : this.imagesList.length !== 1,
        availableAnnotationStylePickers: this.state.getStateProperty('availableAnnotationStylePickers'),
        availableAnnotationTools: this.availableAnnotationTools,
        state: this.state,
        eventEmitter: this.eventEmitter
      });

      this.initialiseImageCanvas();
      this.bindEvents();
      this.listenForActions();

      if (typeof this.bottomPanelAvailable !== 'undefined' && !this.bottomPanelAvailable) {
        _this.eventEmitter.publish('SET_BOTTOM_PANEL_VISIBILITY.' + this.windowId, false);
      } else {
        _this.eventEmitter.publish('SET_BOTTOM_PANEL_VISIBILITY.' + this.windowId, null);
      }
    },

    template: $.Handlebars.compile([
       '<div class="image-view">',
       '</div>'

    ].join('')),

    listenForActions: function() {
      var _this = this;

      _this.eventEmitter.subscribe('bottomPanelSet.' + _this.windowId, function(event, visible) {
        var dodgers = _this.element.find('.mirador-osd-toggle-bottom-panel, .mirador-pan-zoom-controls');
        var arrows = _this.element.find('.mirador-osd-next, .mirador-osd-previous');
        if (visible === true) {
          dodgers.addClass('bottom-panel-open');
          arrows.addClass('bottom-panel-open');
        } else {
          dodgers.removeClass('bottom-panel-open');
          arrows.removeClass('bottom-panel-open');
        }
      });

      _this.eventEmitter.subscribe('fitBounds.' + _this.windowId, function(event, bounds) {
        var rect = new OpenSeadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        _this.osd.viewport.fitBoundsWithConstraints(rect, false);
      });

      _this.eventEmitter.subscribe('currentCanvasIDUpdated.' + _this.windowId, _this.currentCanvasIDUpdated.bind(_this));
      _this.eventEmitter.subscribe('image-needed' + _this.windowId, _this.loadImage.bind(_this));
      _this.eventEmitter.subscribe('image-show' + _this.windowId, _this.showImage.bind(_this));
      _this.eventEmitter.subscribe('image-hide' + _this.windowId, _this.hideImage.bind(_this));
      _this.eventEmitter.subscribe('image-removed' + _this.windowId, _this.removeImage.bind(_this));
      _this.eventEmitter.subscribe('image-opacity-updated' + _this.windowId, _this.updateImageOpacity.bind(_this));
      // These will come soon.
      // _this.eventEmitter.subscribe('image-layering-index-updated');
      // _this.eventEmitter.subscribe('image-position-updated');
      // _this.eventEmitter.subscribe('image-rotation-updated');
      // _this.eventEmitter.subscribe('image-scale-updated');
      // _this.eventEmitter.subscribe('canvas-position-updated');

      //Related to Annotations HUD
      _this.eventEmitter.subscribe('HUD_REMOVE_CLASS.' + _this.windowId, function(event, elementSelector, className) {
        _this.element.find(elementSelector).removeClass(className);
      });

      _this.eventEmitter.subscribe('HUD_ADD_CLASS.' + _this.windowId, function(event, elementSelector, className) {
        _this.element.find(elementSelector).addClass(className);
      });

      _this.eventEmitter.subscribe('HUD_FADE_IN.' + _this.windowId, function(event, elementSelector, duration) {
        _this.element.find(elementSelector).fadeIn(duration);
      });

      _this.eventEmitter.subscribe('HUD_FADE_OUT.' + _this.windowId, function(event, elementSelector, duration, complete) {
        _this.element.find(elementSelector).fadeOut(duration, complete);
      });

      _this.eventEmitter.subscribe('DEFAULT_CURSOR.' + _this.windowId, function(event) {
        jQuery(_this.osd.canvas).css("cursor", "default");
      });
      _this.eventEmitter.subscribe('CROSSHAIR_CURSOR.' + _this.windowId, function(event) {
        jQuery(_this.osd.canvas).css("cursor", "crosshair");
      });
      _this.eventEmitter.subscribe('POINTER_CURSOR.' + _this.windowId, function(event) {
        jQuery(_this.osd.canvas).css("cursor", "pointer");
      });
      //Related to Annotations HUD
    },

    bindEvents: function() {
      var _this = this;

      this.element.find('.mirador-osd-next').on('click', function() {
        _this.next();
      });

      this.element.find('.mirador-osd-previous').on('click', function() {
        _this.previous();
      });

      this.element.find('.mirador-osd-annotations-layer').on('click', function() {
        if (_this.hud.annoState.current === 'none') {
          _this.hud.annoState.startup(this);
        }
        if (_this.hud.annoState.current === 'off') {
          _this.hud.annoState.displayOn(this);
          _this.annotationState = 'on';
        } else {
          //make sure to force the controls back to auto fade
          _this.forceShowControls = false;
          _this.hud.annoState.displayOff(this);
          _this.annotationState = 'off';
        }
      });

      this.element.find('.mirador-manipulation-toggle').on('click', function() {
        if (_this.hud.manipulationState.current === 'none') {
          _this.hud.manipulationState.startup(this);
        }
        if (_this.hud.manipulationState.current === 'manipulationOff') {
          _this.hud.manipulationState.displayOn(this);
        } else {
          _this.hud.manipulationState.displayOff(this);
        }
      });

      this.element.find('.mirador-osd-go-home').on('click', function() {
        _this.osd.viewport.goHome();
      });

      this.element.find('.mirador-osd-up').on('click', function() {
        var panBy = _this.getPanByValue();
        _this.osd.viewport.panBy(new OpenSeadragon.Point(0, -panBy.y));
        _this.osd.viewport.applyConstraints();
      });
      this.element.find('.mirador-osd-right').on('click', function() {
        var panBy = _this.getPanByValue();
        if (_this.horizontallyFlipped) {
          _this.osd.viewport.panBy(new OpenSeadragon.Point(-panBy.x, 0));
        } else {
          _this.osd.viewport.panBy(new OpenSeadragon.Point(panBy.x, 0));
        }
        _this.osd.viewport.applyConstraints();
      });
      this.element.find('.mirador-osd-down').on('click', function() {
        var panBy = _this.getPanByValue();
        _this.osd.viewport.panBy(new OpenSeadragon.Point(0, panBy.y));
        _this.osd.viewport.applyConstraints();
      });
      this.element.find('.mirador-osd-left').on('click', function() {
        var panBy = _this.getPanByValue();
        if (_this.horizontallyFlipped) {
          _this.osd.viewport.panBy(new OpenSeadragon.Point(panBy.x, 0));
        } else {
          _this.osd.viewport.panBy(new OpenSeadragon.Point(-panBy.x, 0));
        }
        _this.osd.viewport.applyConstraints();
      });

      this.element.find('.mirador-osd-zoom-in').on('click', function() {
        var osd = _this.osd;
        if ( osd.viewport ) {
          osd.viewport.zoomBy(
            osd.zoomPerClick / 1.0
          );
          osd.viewport.applyConstraints();
        }
      });
      this.element.find('.mirador-osd-zoom-out').on('click', function() {
        var osd = _this.osd;
        if ( osd.viewport ) {
          osd.viewport.zoomBy(
            1.0 / osd.zoomPerClick
          );
          osd.viewport.applyConstraints();
        }
      });

      this.element.find('.mirador-osd-toggle-bottom-panel').on('click', function() {
        _this.eventEmitter.publish('TOGGLE_BOTTOM_PANEL_VISIBILITY.' + _this.windowId);
      });

      // Annotation specific controls
      this.element.find('.mirador-osd-edit-mode').on('click', function() {
        var shape = jQuery(this).find('.material-icons').html();
        if (_this.hud.annoState.current === 'pointer') {
          _this.hud.annoState.chooseShape(shape);
        } else {
          _this.hud.annoState.changeShape(shape);
        }
        //when a user is in Create mode, don't let the controls auto fade as it could be distracting to the user
        _this.forceShowControls = true;
        _this.element.find(".hud-control").stop(true, true).removeClass('hidden', _this.state.getStateProperty('fadeDuration'));
      });

      this.element.find('.mirador-osd-pointer-mode').on('click', function() {
        // go back to pointer mode
        if (_this.hud.annoState.current === 'shape') {
          _this.hud.annoState.choosePointer();
          //go back to allowing the controls to auto fade
          _this.forceShowControls = false;
        }
      });

      this.element.find('.mirador-osd-refresh-mode').on('click', function() {
        //update annotation list from endpoint
        _this.eventEmitter.publish('updateAnnotationList.' + _this.windowId);
      });
      //Annotation specific controls

      //Image manipulation controls
      //set the original values for all of the CSS filter options
      var filterValues = {
        "brightness" : "brightness(100%)",
        "contrast" : "contrast(100%)",
        "saturate" : "saturate(100%)",
        "grayscale" : "grayscale(0%)",
        "invert" : "invert(0%)"
      };

      function setFilterCSS() {
        var filterCSS = jQuery.map(filterValues, function(value, key) { return value; }).join(" "),
            osdCanvas = jQuery(_this.osd.drawer.canvas);
        osdCanvas.css({
          'filter'         : filterCSS,
          '-webkit-filter' : filterCSS,
          '-moz-filter'    : filterCSS,
          '-o-filter'      : filterCSS,
          '-ms-filter'     : filterCSS
        });
      }

      function resetImageManipulationControls() {
        //reset rotation
        if (_this.osd) {
          _this.osd.viewport.setRotation(0);
        }

        //reset brightness
        filterValues.brightness = "brightness(100%)";
        _this.element.find('.mirador-osd-brightness-slider').slider('option','value',100);
        _this.element.find('.mirador-osd-brightness-slider').find('.percent').text(100 + '%');

        //reset contrast
        filterValues.contrast = "contrast(100%)";
        _this.element.find('.mirador-osd-contrast-slider').slider('option','value',100);
        _this.element.find('.mirador-osd-contrast-slider').find('.percent').text(100 + '%');

        //reset saturation
        filterValues.saturate = "saturate(100%)";
        _this.element.find('.mirador-osd-saturation-slider').slider('option','value',100);
        _this.element.find('.mirador-osd-saturation-slider').find('.percent').text(100 + '%');

        //reset grayscale
        filterValues.grayscale = "grayscale(0%)";
        _this.element.find('.mirador-osd-grayscale').removeClass('selected');

        //reset color inversion
        filterValues.invert = "invert(0%)";
        _this.element.find('.mirador-osd-invert').removeClass('selected');

        //reset mirror
        jQuery(_this.osd.canvas).removeClass('mirador-mirror');
        if (_this.originalDragHandler) {
          _this.osd.viewport.viewer.innerTracker.dragHandler = _this.originalDragHandler;
        }

        setFilterCSS();
      }

      this.element.find('.mirador-osd-rotate-right').on('click', function() {
        if (_this.osd) {
          var currentRotation = _this.osd.viewport.getRotation();
          _this.osd.viewport.setRotation(currentRotation + 90);
        }
      });

      this.element.find('.mirador-osd-rotate-left').on('click', function() {
        if (_this.osd) {
          var currentRotation = _this.osd.viewport.getRotation();
          _this.osd.viewport.setRotation(currentRotation - 90);
        }
      });

      this.element.find('.mirador-osd-brightness-slider').slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 200,
        value: 100,
        create: function(event, ui) {
          var v = jQuery(this).slider('value'),
              span = jQuery('<span class="percent">').text(v + '%');

          jQuery(this).find('.ui-slider-handle').append(span);
        },
        slide: function(event, ui) {
          filterValues.brightness = "brightness("+ui.value+"%)";
          setFilterCSS();
          jQuery(this).find('.percent').text(ui.value + '%');
        }
      }).hide();

      this.element.find('.mirador-osd-brightness').on('mouseenter',
                                                      function() {
                                                        _this.element.find('.mirador-osd-brightness-slider').stop(true, true).show();
                                                      }).on('mouseleave',
                                                            function() {
                                                              _this.element.find('.mirador-osd-brightness-slider').stop(true, true).hide();
                                                            });

      this.element.find('.mirador-osd-contrast-slider').slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 200,
        value: 100,
        create: function(event, ui) {
          var v = jQuery(this).slider('value'),
              span = jQuery('<span class="percent">').text(v + '%');

          jQuery(this).find('.ui-slider-handle').append(span);
        },
        slide: function(event, ui) {
          filterValues.contrast = "contrast("+ui.value+"%)";
          setFilterCSS();
          jQuery(this).find('.percent').text(ui.value + '%');
        }
      }).hide();

      this.element.find('.mirador-osd-contrast').on('mouseenter',
                                                    function() {
                                                      _this.element.find('.mirador-osd-contrast-slider').stop(true, true).show();
                                                    }).on('mouseleave',
                                                          function() {
                                                            _this.element.find('.mirador-osd-contrast-slider').stop(true, true).hide();
                                                          });

      this.element.find('.mirador-osd-saturation-slider').slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 200,
        value: 100,
        create: function(event, ui) {
          var v = jQuery(this).slider('value'),
              span = jQuery('<span class="percent">').text(v + '%');

          jQuery(this).find('.ui-slider-handle').append(span);
        },
        slide: function(event, ui) {
          filterValues.saturate = "saturate("+ui.value+"%)";
          setFilterCSS();
          jQuery(this).find('.percent').text(ui.value + '%');
        }
      }).hide();

      this.element.find('.mirador-osd-saturation').on('mouseenter',
                                                      function() {
                                                        _this.element.find('.mirador-osd-saturation-slider').stop(true, true).show();
                                                      }).on('mouseleave',
                                                            function() {
                                                              _this.element.find('.mirador-osd-saturation-slider').stop(true, true).hide();
                                                            });

      this.element.find('.mirador-osd-grayscale').on('click', function() {
        if (jQuery(this).hasClass('selected')) {
          filterValues.grayscale = "grayscale(0%)";
          jQuery(this).removeClass('selected');
        } else {
          filterValues.grayscale = "grayscale(100%)";
          jQuery(this).addClass('selected');
        }
        setFilterCSS();
      });

      this.element.find('.mirador-osd-invert').on('click', function() {
        if (jQuery(this).hasClass('selected')) {
          filterValues.invert = "invert(0%)";
          jQuery(this).removeClass('selected');
        } else {
          filterValues.invert = "invert(100%)";
          jQuery(this).addClass('selected');
        }
        setFilterCSS();
      });

      this.element.find('.mirador-osd-mirror').on('click', function() {
        if (!_this.originalDragHandler) {
          _this.originalDragHandler = _this.osd.viewport && _this.osd.viewport.viewer.innerTracker.dragHandler;
        }
        if (jQuery(this).hasClass('selected')) {
          jQuery(_this.osd.canvas).removeClass('mirador-mirror');
          jQuery(this).removeClass('selected');
          _this.eventEmitter.publish('disableManipulation', 'mirror');
          if (_this.osd.viewport) {
            _this.osd.viewport.viewer.innerTracker.dragHandler = _this.originalDragHandler;
          }
          _this.horizontallyFlipped = false;
        } else {
          jQuery(_this.osd.canvas).addClass('mirador-mirror');
          jQuery(this).addClass('selected');
          _this.eventEmitter.publish('enableManipulation', 'mirror');
          if (_this.osd.viewport) {
            var viewer = _this.osd.viewport.viewer;
            viewer.innerTracker.dragHandler = OpenSeadragon.delegate(viewer, function(event) {
              event.delta.x = -event.delta.x;
              _this.originalDragHandler(event);
            });
          }
          _this.horizontallyFlipped = true;
        }
    });

      this.element.find('.mirador-osd-reset').on('click', function() {
        resetImageManipulationControls();
      });

      this.eventEmitter.subscribe('resetImageManipulationControls.'+this.windowId, function() {
        resetImageManipulationControls();
      });
      //Image manipulation controls
    },

    currentCanvasIDUpdated: function(event, canvasId) {
      var _this = this,
          firstCanvasId = _this.imagesList[0]['@id'],
          lastCanvasId = _this.imagesList[_this.imagesList.length-1]['@id'];

      // If it is the first canvas, hide the "go to previous" button, otherwise show it.
      if (canvasId === firstCanvasId) {
        _this.element.find('.mirador-osd-previous').hide();
        _this.element.find('.mirador-osd-next').show();
      } else if (canvasId === lastCanvasId) {
        _this.element.find('.mirador-osd-next').hide();
        _this.element.find('.mirador-osd-previous').show();
      } else {
        _this.element.find('.mirador-osd-next').show();
        _this.element.find('.mirador-osd-previous').show();
      }
      // If it is the last canvas, hide the "go to previous" button, otherwise show it.
    },

    loadImage: function(event, imageResource) {
      var _this = this;

      // We've already loaded this tilesource
      if(imageResource.status === 'drawn') {
        return;
      }

      imageResource.setStatus('requested');
      var bounds = imageResource.getGlobalBounds();

      _this.osd.addTiledImage({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        tileSource: imageResource.tileSource,
        opacity: imageResource.opacity,
        clip: imageResource.clipRegion,
        index: imageResource.zIndex,

        success: function(event) {
          var tiledImage = event.item;

          imageResource.osdTiledImage = tiledImage;
          imageResource.setStatus('loaded');
          _this.syncAllImageResourceProperties(imageResource);

          var tileDrawnHandler = function(event) {
            if (event.tiledImage === tiledImage) {
              imageResource.setStatus('drawn');
              _this.osd.removeHandler('tile-drawn', tileDrawnHandler);
            }
          };
          _this.osd.addHandler('tile-drawn', tileDrawnHandler);
        },

        error: function(event) {
          // Add any auth information here.
          //
          // var errorInfo = {
          //   id: imageResource.osdTileSource,
          //   message: event.message,
          //   source: event.source
          // };
          imageResource.setStatus('failed');
        }
      });
    },
    showImage: function(event, imageResource) {
      // Check whether or not this item has been drawn.
      // This implies that the request has been issued already
      // and the opacity can be updated.
      if (imageResource.getStatus() === 'drawn') {
        this.updateImageOpacity(null, imageResource);
      }
    },
    hideImage: function(event, imageResource) {
      if (imageResource.getStatus() === 'drawn') {
        imageResource.osdTiledImage.setOpacity(0);
      }
    },
    removeImage: function() {
    },
    updateImageOpacity: function(event, imageResource) {
      if(imageResource.osdTiledImage) {
        imageResource.osdTiledImage.setOpacity(imageResource.opacity * imageResource.parent.getOpacity());
      }
    },
    syncAllImageResourceProperties: function(imageResource) {
      if(imageResource.osdTiledImage) {
        var bounds = imageResource.getGlobalBounds();
        // If ever the clipRegion parameter becomes
        // writable, add it here.
        imageResource.osdTiledImage.setPosition({
          x:bounds.x,
          y:bounds.y
        }, true);
        imageResource.osdTiledImage.setWidth(bounds.width, true);
        imageResource.osdTiledImage.setOpacity(
          imageResource.getOpacity() * imageResource.parent.getOpacity()
        );
        // This will be for the drag and drop functionality.
        // _this.updateImageLayeringIndex(imageResource);
      }
    },

    getPanByValue: function() {
      var bounds = this.osd.viewport.getBounds(true);
      //for now, let's keep 50% of the image on the screen
      var panBy = {
        "x" : bounds.width * 0.5,
        "y" : bounds.height * 0.5
      };
      return panBy;
    },

    setBounds: function() {
      var _this = this;

      this.osdOptions.osdBounds = this.osd.viewport.getBounds(true);
      _this.eventEmitter.publish("imageBoundsUpdated", {
        id: _this.windowId,
        osdBounds: {
          x: _this.osdOptions.osdBounds.x,
          y: _this.osdOptions.osdBounds.y,
          width: _this.osdOptions.osdBounds.width,
          height: _this.osdOptions.osdBounds.height
        }
      });
      var rectangle = this.osdOptions.osdBounds; // In ImageView, viewport coordinates are in the same as Canvas Coordinates.
      _this.eventEmitter.publish("imageRectangleUpdated", {
        id: _this.windowId,
        osdBounds: {
          x: Math.round(rectangle.x),
          y: Math.round(rectangle.y),
          width: Math.round(rectangle.width),
          height: Math.round(rectangle.height)
        },
        warning: 'Warning, image rectangle now based on canvas dimensions, not the constituent images.'
      });
    },

    toggle: function(stateValue) {
      if (stateValue) {
        this.show();
      } else {
        this.hide();
      }
    },

    hide: function() {
      jQuery(this.element).hide({effect: "fade", duration: 300, easing: "easeOutCubic"});
    },

    show: function() {
      jQuery(this.element).show({
        effect: "fade", duration: 300, easing: "easeInCubic", complete: function () {
          // Under firefox $.show() used under display:none iframe does not change the display.
          // This is workaround for https://github.com/IIIF/mirador/issues/929
          jQuery(this).css('display', 'block');
        }
      });
    },

    adjustWidth: function(className, hasClass) {
      var _this = this;
      if (hasClass) {
        _this.eventEmitter.publish('REMOVE_CLASS.'+this.windowId, className);
      } else {
        _this.eventEmitter.publish('ADD_CLASS.'+this.windowId, className);
      }
    },

    adjustHeight: function(className, hasClass) {
      if (hasClass) {
        this.element.removeClass(className);
      } else {
        this.element.addClass(className);
      }
    },

    initialiseImageCanvas: function() {
      var _this = this,
          osdID = 'mirador-osd-' + $.genUUID(),
          canvasModel = _this.canvases[_this.canvasID];

      _this.elemOsd =
        jQuery('<div/>')
        .addClass(_this.osdCls)
        .attr('id', osdID)
        .appendTo(_this.element);

      _this.osd = $.OpenSeadragon({
        id: osdID,
        uniqueID: osdID,
        preserveViewport: true,
        blendTime: 0.1,
        alwaysBlend: false,
        showNavigationControl: false
      });

      var canvasBounds = canvasModel.getBounds();
      var rect = new OpenSeadragon.Rect(
        canvasBounds.x,
        canvasBounds.y,
        canvasBounds.width,
        canvasBounds.height
      );
      _this.osd.viewport.fitBounds(rect, true); // center viewport before image is placed.

      canvasModel.show();
      canvasModel.getVisibleImages().forEach(function(imageResource) {
        _this.loadImage(null, imageResource);
      });

      _this.osd.addHandler('zoom', $.debounce(function(){
        var point = {
          'x': -10000000,
          'y': -10000000
        };
        _this.eventEmitter.publish('updateTooltips.' + _this.windowId, [point, point]);
      }, 30));

      _this.osd.addHandler('pan', $.debounce(function(){
        var point = {
          'x': -10000000,
          'y': -10000000
        };
        _this.eventEmitter.publish('updateTooltips.' + _this.windowId, [point, point]);
      }, 30));

      // Maintain this as an external API.
      _this.eventEmitter.publish('osdOpen.'+_this.windowId);
      _this.addAnnotationsLayer(_this.elemAnno);

      if (_this.osdOptions.osdBounds) {
        var newBounds = new OpenSeadragon.Rect(_this.osdOptions.osdBounds.x, _this.osdOptions.osdBounds.y, _this.osdOptions.osdBounds.width, _this.osdOptions.osdBounds.height);
        _this.osd.viewport.fitBounds(newBounds, true);
      } else {
        // else reset bounds for this image
        _this.setBounds();
      }

      // get the state before resetting it so we can get back to that state
      var originalState = _this.hud.annoState.current;
      var selected = _this.element.find('.mirador-osd-edit-mode.selected');
      var shape = null;
      if (selected) {
        shape = selected.find('.material-icons').html();
      }
      if (originalState === 'none') {
        _this.hud.annoState.startup();
      } else if (originalState === 'off' || _this.annotationState === 'off') {
        //original state is off, so don't need to do anything
      } else {
        _this.hud.annoState.displayOff();
      }

      if (originalState === 'pointer' || _this.annotationState === 'on') {
        _this.hud.annoState.displayOn();
      } else if (originalState === 'shape') {
        _this.hud.annoState.displayOn();
        _this.hud.annoState.chooseShape(shape);
      } else {
        //original state is off, so don't need to do anything
      }

      _this.osd.addHandler('zoom', $.debounce(function() {
        _this.setBounds();
      }, 500));

      _this.osd.addHandler('pan', $.debounce(function(){
        _this.setBounds();
      }, 500));
    },

    //TODO reuse annotationsLayer with IIIFManifestLayouts
    addAnnotationsLayer: function(element) {
      var _this = this;
      _this.annotationsLayer = new $.AnnotationsLayer({
        state: _this.state,
        annotationsList: _this.state.getWindowAnnotationsList(_this.windowId) || [],
        viewer: _this.osd,
        windowId: _this.windowId,
        element: element,
        eventEmitter: _this.eventEmitter
      });
    },

    updateImage: function(canvasID) {
      var _this = this;
      if (this.canvasID !== canvasID) {
        this.canvases[_this.canvasID].getVisibleImages().forEach(function(imageResource){
          imageResource.hide();
        });
        this.canvasID = canvasID;
        this.currentImgIndex = $.getImageIndexById(this.imagesList, canvasID);
        this.currentImg = this.imagesList[this.currentImgIndex];

        var newCanvas = this.canvases[_this.canvasID];
        var canvasBounds = newCanvas.getBounds();
        var rect = new OpenSeadragon.Rect(
          canvasBounds.x,
          canvasBounds.y,
          canvasBounds.width,
          canvasBounds.height
        );
        _this.osd.viewport.fitBounds(rect, true); // center viewport before image is placed.
        newCanvas.show();

        this.osdOptions = {
          osdBounds:        null,
          zoomLevel:        null
        };
        this.eventEmitter.publish('resetImageManipulationControls.'+this.windowId);
      }
      _this.eventEmitter.publish('UPDATE_FOCUS_IMAGES.' + this.windowId, {array: [canvasID]});
      },

    next: function() {
      var _this = this;
      var next = this.currentImgIndex + 1;
      if (next < this.imagesList.length) {
        _this.eventEmitter.publish('SET_CURRENT_CANVAS_ID.' + this.windowId, this.imagesList[next]['@id']);
      }
    },

    previous: function() {
      var _this = this;
      var prev = this.currentImgIndex - 1;

      if (prev >= 0) {
        _this.eventEmitter.publish('SET_CURRENT_CANVAS_ID.' + this.windowId, this.imagesList[prev]['@id']);
      }
    }
  };

}(Mirador));
