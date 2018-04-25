var app = angular.module("search-strategy");
app.directive("home", ['$http', function($http) {
    return {
        restrict : "A",
        templateUrl: 'home.html',
        scope: false,
        link: function(scope) {
            scope.start = function() {
              var text = '';

              console.log('>>>>>', document.getElementById("textA").value);
              var json = get_title_abstract(document.getElementById("textA").value);
              // var json = get_title_abstract(scope.text.selected);
              for(var ind in json)
              {
                var arrElem = json[ind];
                for(var jInd in arrElem)
                {
                  text+=arrElem[jInd];
                }
              }

              console.log('get_title_abstract>>>', text);

              scope.extractKeywordsFromText(text);
              scope.view.selected = "strategy";
              scope.calculateSearchHits(
                scope.textareaText.selected,
                function(err, search_counter){
                  scope.hits.push(search_counter);
                }
              );
            }
        }
    };
}]);
