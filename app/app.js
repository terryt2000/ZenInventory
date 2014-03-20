(function() {
    'use strict';

    var app = angular.module('app', ['firebase']);

    app.controller('localCtrl', ['$scope', function($scope) {
            var nextId = 5;
            $scope.products = [
                { id: 1, name: 'Router', description: 'An Router', quantity: 10 },
                { id: 2, name: 'Razor', description: 'An Razor', quantity: 220 },
                { id: 3, name: 'Rump Roast', description: 'Rump Roast', quantity: 22 },
                { id: 4, name: 'Roto-tiller', description: 'Roto-tiller', quantity: 66}
            ];

            $scope.newProduct = { id: nextId, name: '', description: '', quantity: 0 };

            $scope.addProduct = function () {
                $scope.products.push(angular.copy($scope.newProduct));
                nextId += 1;
                $scope.newProduct = { id: nextId, name: '', description: '', quantity: 0 };
            };

            $scope.deleteProduct = function(product) {
                $scope.products.remove(function(i) {
                    return i.id === product.id;
                });
            };
        }
    ]);

    app.controller('fbCtrl', ['$scope', 'productSvc', firebaseController]);

    function firebaseController($scope, productService) {
        $scope.newProduct = { name: '', description: '', quantity: 0 };

        $scope.products = productService.getProducts();

        $scope.addProduct = function () {
            productService.addProduct(angular.copy($scope.newProduct));
            $scope.newProduct = { name: '', description: '', quantity: 0 };
        };

        $scope.updateProduct = function (id) {
            productService.updateProduct(id);
        };

        $scope.removeProduct = function (id) {
            productService.removeProduct(id);
        };
    }

    app.factory('productSvc', ['$firebase', function ($firebase) {
        var productsUrl = 'https//zeninventory.firebaseio.com/products';
        var fbRef = new Firebase(productsUrl);
        var products = $firebase(fbRef);

        var getProducts = function () {
            return products;
        };

        var addProduct = function (item) {
            products.$add(item);
        };

        var updateProduct = function (id) {
            products.$save(id);
        };

        var deleteProduct = function (id) {
            products.$remove(id);
        };

        return {
            getProducts: getProducts,
            addProduct: addProduct,
            updateProduct: updateProduct,
            deleteProduct: deleteProduct
        };
    }]);

})();