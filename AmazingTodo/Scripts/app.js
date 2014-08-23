﻿var TodoApp = angular.module("TodoApp", ["ngRoute", "ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'detail.html' }).
            when('/edit/:itemId', { controller: EditCtrl, templateUrl: 'detail.html' }).
            otherwise({ redirectTo: '/' });
    })
    .directive('sorted', function () {
        return {
            scope: true,
            transclude: true,
            template: '<a ng-click="do_sort()" ng-transclude></a>' +
        '<span ng-show="do_show(true)"><i class="glyphicon glyphicon-arrow-down"></i></span>' +
        '<span ng-show="do_show(false)"><i class="glyphicon glyphicon-arrow-up"></i></span>',
            controller: function($scope, $element, $attrs) {
                $scope.sort = $attrs.sorted;

                $scope.do_sort = function() { $scope.sort_by($scope.sort); };

                $scope.do_show = function(asc) {
                    return (asc != $scope.is_desc) && ($scope.sort_order == $scope.sort);
                };
            }
        }
    });

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({ q: $scope.query, sort: $scope.sort_order, desc: $scope.is_desc, limit: $scope.limit, offset: $scope.offset },
            function (items) {
                var cnt = items.length;
                $scope.no_more = cnt < 20;
                $scope.items = $scope.items.concat(items);
            }
        );
    };

    $scope.sort_by = function (ord) {
        if ($scope.sort_order == ord) { $scope.is_desc = !$scope.is_desc; }
        else { $scope.is_desc = false; }
        $scope.sort_order = ord;
        $scope.reset();
    };

    $scope.sort_order = 'Priority';
    $scope.is_desc = false;

    $scope.reset = function () {
        $scope.offset = 0;
        $scope.items = [];
        $scope.search();
    };

    $scope.show_more = function () { return !$scope.no_more; };

    $scope.do_show = function (asc, col) {
        return (asc != $scope.is_desc) && ($scope.sort_order == col);
    };

    $scope.delete = function () {
        var itemId = this.item.TodoItemId;
        Todo.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    };

    $scope.limit = 20;

    $scope.reset();
};

var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
};

var EditCtrl = function ($scope, $routeParams, $location, Todo) {
    $scope.action = "Update";
    $scope.item = Todo.get({ id: $routeParams.itemId });

    $scope.save = function () {
        Todo.update({ id: $scope.item.TodoItemId }, $scope.item, function () {
            $location.path('/');
        });
    };
};
