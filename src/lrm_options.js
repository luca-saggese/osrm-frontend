'use strict';

var mapView = require('./leaflet_options');
var createGeocoder = require('./geocoder');

module.exports = {
  lrm: {
    lineOptions: {
      styles: [
        {color: '#022bb1', opacity: 0.8, weight: 8},
        {color: 'white', opacity: 0.3, weight: 6}
      ]
    },
    altLineOptions: {
      styles: [
        {color: '#40007d', opacity: 0.4, weight: 8},
        {color: 'black', opacity: 0.5, weight: 2, dashArray: '2,4' },
        {color: 'white', opacity: 0.3, weight: 6}
      ]
    },
    dragStyles: [
      {color: 'black', opacity: 0.35, weight: 9},
      {color: 'white', opacity: 0.8, weight: 7}
    ],
    routeWhileDragging: true,
    summaryTemplate: function (data) {
      var template = '<div class="osrm-directions-summary"><h2>{name}</h2><h3>Distanza: {distance}, {time}</h3><h3>Costo: {cost}</h3></div>';
      console.log('summaryTemplate', data)
      var gasCost = Math.round(data.summary.totalDistance / 1000 / 2.5 * 1.9);
      var tollCost =  Math.round(data.summary.toll.cost[4]) 
      var total =  Math.round(data.summary.totalDistance / 1000 / 2.5 * 1.9 + data.summary.toll.cost[4]);
      data.cost = gasCost + '€ (gas) + ' + tollCost + '€ (toll) = ' + total + '€'
      return L.Util.template(template, data)
    },
    postProcess: function (route, responseRoute) {
      var tollSteps = [];
      var tollDistance = 0;
      for (var i = 0; i < responseRoute.legs.length; i++) {
        var leg = responseRoute.legs[i];
        for (var j = 0; j < leg.steps.length; j++) {
          var step = leg.steps[j];
          var toll = false;
          for (var k = 0; k < step.intersections.length; k++) {
            var intersection = step.intersections[k];
            if(intersection.classes && intersection.classes.indexOf('toll')>-1) {
              toll = true
            }
          }
          if(toll) {
            tollSteps.push({ref: step.ref, distance: step.distance, name:step.name, intersections:step.intersections})
            tollDistance += step.distance;
          }
        }
      }
      route.summary.toll={
        distance: tollDistance,
        cost:[
          (tollDistance / 1000) * 0.07231,
          (tollDistance / 1000) * 0.07401, 
          (tollDistance / 1000) * 0.09862, 
          (tollDistance / 1000) * 0.14864, 
          (tollDistance / 1000) * 0.17530 
        ]
      }
      console.log('postProcess', route, responseRoute)
      return route
    },
    containerClassName: 'dark pad2',
    alternativeClassName: 'osrm-directions-instructions',
    stepClassName: 'osrm-directions-step',
    geocodersClassName: 'osrm-directions-inputs',
    createGeocoder: createGeocoder,
    showAlternatives: true,
    useZoomParameter: false,
    routeDragInterval: 200,
    collapsible: true
  },
  popup: {
    removeButtonClass: 'osrm-directions-icon osrm-close-light-icon',
    uturnButtonClass: 'osrm-directions-icon osrm-u-turn-icon'
  },
  tools: {
    popupWindowClass: 'fill-osrm dark',
    popupCloseButtonClass: 'osrm-directions-icon osrm-close-icon',
    editorButtonClass: 'osrm-directions-icon osrm-editor-icon',
    josmButtonClass: 'osrm-directions-icon osrm-josm-icon',
    debugButtonClass: 'osrm-directions-icon osrm-debug-icon',
    mapillaryButtonClass: 'osrm-directions-icon osrm-mapillary-icon',
    gpxButtonClass: 'osrm-directions-icon osrm-gpx-icon',
    localizationChooserClass: 'osrm-localization-chooser',
    printButtonClass: 'osrm-directions-icon osrm-printer-icon',
    toolsContainerClass: 'fill-osrm dark',
    position: 'bottomleft'
  }
};
