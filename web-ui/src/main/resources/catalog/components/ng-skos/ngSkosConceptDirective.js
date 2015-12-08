/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @description
 *
 * Display a [concept](http://gbv.github.io/jskos/jskos.html#concepts).
 * Changes on the concept object are reflected by changes in the scope
 * variables so the display is updated automatically.
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>note (object of array of strings)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * In addition the helper method `isEmptyObject` is provided
 * to check whether an object
 * is empty.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/
 * templates/skos-concept.html)
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [sourcecode]
 * (https://github.com/gbv/ng-skos/blob/master/src/directives/skosConcept.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](http://gbv.github.io/jskos/jskos.html#concepts) to bind to
 * @param {string} language Assignable angular expression with
 *      preferred language to be used as bounded `language` variable.
 * @param {string} skos-navigate-concept function to call when a connected
 *      concept is clicked
 * @param {string} skos-add-concept function to call when a connected
 *      concept is to be added to an applications list of selected concepts
 * @param {string} skos-top-concept function to call when the top concept
 *      is required (eg. when resetting the browser navigation)
 * @param {string} template-url URL of a template to display the concept
 *
 */
(function() {
  goog.provide('ngSkos_concept_directive');

  var module = angular.module('ngSkos_concept_directive', []);

  module.directive('skosConcept',
      ['$compile', '$translate',
       function($compile, $translate) {

         return {
           restrict: 'AE',
           scope: {
             concept: '=skosConcept',
             language: '=',
             navigateConcept: '=skosNavigateConcept',
             addConceptToList: '=skosAddConcept',
             topConcept: '=skosTopConcept'
           },
           templateUrl: '../../catalog/components/ng-skos/' +
           'templates/skos-concept.html',
           link: function link(scope, element, attr) {
              scope.mainLanguage = scope.language.split(',')[0];
             scope.isEmptyObject = function(object) {
                var keys = Object.keys;
                return !(keys && keys.length);
             };
             scope.addConcept = function(c) {
               var label = c.prefLabel[scope.mainLanguage] ||
                           c.prefLabel[Object.keys(c.prefLabel)[0]];
               scope.addConceptToList(c.uri, label);
             };
             scope.addConceptNavigationHelp = function(c,key) {
               var label = c.prefLabel[scope.mainLanguage] || 
                           c.prefLabel[Object.keys(c.prefLabel)[0]],
                   labelAncestor = c.ancestor.prefLabel[scope.mainLanguage] || 
                                   c.ancestor.prefLabel[Object.keys(c.ancestor.prefLabel)[0]];
               return label + $translate(key) + labelAncestor;
             };
             scope.$watch('concept', function(concept) {
                angular.forEach([
                 'uri', 'inScheme', 'ancestors', 'prefLabel',
                 'altLabel', 'note', 'notation', 'narrower',
                  'broader', 'related'
               ],
               function(field) {
                 scope[field] = concept ? concept[field] : null;
               }
                );
             },true);
           }
         };
       }]);

})();
