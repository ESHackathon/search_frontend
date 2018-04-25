var app = angular.module("search-strategy");
app.directive("uploader", ['$http', function($http) {
    return {
        restrict : "A",
        templateUrl: 'uploader.html',
        scope: false,
        link: function(scope) {
            scope.uploadFile = function(input_file) {


              var fileToLoad = input_file.files[0];
              var fileReader = new FileReader();
              fileReader.onload = function(fileLoadedEvent){
                  var textFromFileLoaded = fileLoadedEvent.target.result;

                  document.getElementById("textA").value = textFromFileLoaded;
                  console.log('textFromFileLoaded>>>>>', textFromFileLoaded);
                  scope.text.selected = textFromFileLoaded;
              };

              fileReader.readAsText(fileToLoad, "UTF-8");
            }


        }
    };
}]);
