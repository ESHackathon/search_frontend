var app = angular.module("search-strategy");
app.directive("uploader", ['$http', function($http) {
    return {
        restrict : "A",
        templateUrl: 'uploader.html',
        link: function(scope) {
            scope.uploadFile = function(input_file) {


                fd = new FormData();
                fd.append("upload", input_file.files[0]);
                $http.post('http://localhost:5000/upload-ris', fd, {
                  headers: {
                    'Content-Type': undefined
                  },
                  transformRequest: angular.identity
                }).then(function(data) {
                  console.log(data);
                }, function(data) {
                  return console.log(data);
                });

            }
        }
    };
}]);
