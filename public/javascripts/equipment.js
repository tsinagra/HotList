var app = angular.module('GolfHotList', ['ngResource', 'ngRoute', 'ngFileUpload']);

var ratings = [5, 4, 3, 2, 1];

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .when('/equipment/add', {
        templateUrl: 'partials/equipment-form.html',
        controller: 'AddCtrl'
    })
    .when('/equipment/edit/:id', {
        templateUrl: 'partials/equipment-form.html',
        controller: 'EditCtrl'
    })
    .when('/equipment/delete/:id', {
        templateUrl: 'partials/equipment-delete.html',
        controller: 'DeleteCtrl'
    });
    
}]);

app.controller('HomeCtrl', ['$scope', '$resource', function($scope, $resource) {
    var items = $resource('/api/equipment');
    var categories = $resource('/api/category');

    items.query(function(items) {
        categories.query(function(categories) {
            $scope.items = items;
            $scope.sortType = 'name';
            $scope.sortReverse = false;
            $scope.categories = categories;
        });
    });
}]);

app.controller('AddCtrl', ['$scope', '$resource', '$location', 'Upload',
    function($scope, $resource, $location, Upload) {
        var categories = $resource('/api/category');
        categories.query(function(categories) {
            $scope.title = 'Add Equipment';
            $scope.ratings = ratings;
            $scope.categories = categories;
        });

        $scope.save = function() {
            var items = $resource('/api/equipment');

            items.save($scope.item, function(item) {
                if ($scope.item.file) {
                    $scope.upload(item._id, $scope.item.file);
                } else {
                    $location.path('/');
                }
            });

            $scope.upload = function (id, file) {
                Upload.upload({
                    url: '/api/equipment/' + id + '/image',
                    data: {file: file}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $location.path('/');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };
        };
}]);

app.controller('EditCtrl', ['$scope', '$resource', '$location', '$routeParams', 'Upload',
    function($scope, $resource, $location, $routeParams, Upload) {
        var items = $resource('/api/equipment/:id', { id: '@_id' }, {
            update: { method: 'PUT'}
        });
        var settings = $resource('/api/category');
        
        items.get({ id: $routeParams.id }, function(item) {
            settings.query(function(categories) {    
                $scope.item = item;
                $scope.title = 'Edit Equipment';
                $scope.ratings = ratings;
                $scope.categories = categories;
            });
        });

        $scope.save = function() {
            items.update($scope.item, function() {
                if ($scope.item.file) {
                    $scope.upload($scope.item.file); 
                } else {
                    $location.path('/');
                }
            });
        };

        $scope.removePhoto = function() {
            console.log('remove photo');
            $scope.item.fileName = null;
        };

        $scope.upload = function (file) {
            Upload.upload({
                url: '/api/equipment/' + $routeParams.id + '/image',
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                $location.path('/');
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
}]);

app.controller('DeleteCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams) {
        var items = $resource('/api/equipment/:id');

        items.get({ id: $routeParams.id }, function(item) {
            $scope.item = item;
        });

        $scope.delete = function() {
            items.delete({ id: $routeParams.id }, function(item) {
               $location.path('/'); 
            });
        };
}]);
