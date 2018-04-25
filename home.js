var app = angular.module("search-strategy");
app.directive("home", ['$http', function($http) {
    return {
        restrict : "A",
        templateUrl: 'home.html',
        scope: false,
        link: function(scope) {
            scope.start = function() {
              scope.extractKeywordsFromText(scope.text.selected);
              scope.textareaText = {"selected": scope.draftString};
              scope.view.selected = "strategy";
              scope.calculateSearchHits(
                scope.draftString.selected,
                function(err, search_counter){
                  scope.hits.push(search_counter);
                }
              );
            }
        }
    };
}]);

function loadFileAsText(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;

      console.log('textFromFileLoaded>>>>>', textFromFileLoaded);
      document.getElementById("textA").value = textFromFileLoaded;
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}
