var app = angular.module('GolfHotList', ['ngResource', 'ngRoute', 'ngFileUpload']);

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

    items.query(function(items) {
        $scope.items = items;
        $scope.sortType = 'name';
        $scope.sortReverse = false;
    });
}]);

app.controller('AddCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.title = 'Add Equipment';

        $scope.save = function() {
            var items = $resource('/api/equipment');
            items.save($scope.item, function(item) {
                if ($scope.item.file) {
                    var image = $resource('/api/equipment/' + item._id + '/image');
                    image.save({ id: item._id, fileName: $scope.item.file.name }, function() {
                        $location.path('/');
                    });
                } else {
                    $location.path('/');
                }
            });
        };
}]);

app.controller('EditCtrl', ['$scope', '$resource', '$location', '$routeParams', 'Upload',
    function($scope, $resource, $location, $routeParams, Upload) {
        var items = $resource('/api/equipment/:id', { id: '@_id' }, {
            update: { method: 'PUT'}
        });

        items.get({ id: $routeParams.id }, function(item) {
            $scope.item = item;
            $scope.title = 'Edit Equipment';
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
