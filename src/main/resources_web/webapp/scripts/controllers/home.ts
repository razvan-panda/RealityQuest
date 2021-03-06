/// <reference path="../../tsds/angular.d.ts" />
/// <reference path="../../tsds/moment.d.ts" />

'use strict';

declare var _: any;

angular
.module('app')
.controller('HomeCtrl', function ($scope, $http)
{
    $scope.chartSeries =
    [
        {
            name: "Today's activities",
            data: []
        }
    ];

    $scope.chartConfig =
    {
        options:
        {
            chart:
            {
                type: 'bar'
            },
            plotOptions:
            {
                series:
                {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        },
        series: $scope.chartSeries,
        title:
        {
            text: 'Hello'
        },
        credits:
        {
            enabled: false
        },
        loading: false,
        xAxis:
        {
            categories: []
        }
    };

    $http.get('api/reports/home', null)
        .success(function (response)
        {
            var groupCount = 10;

            var groups = _(response.LogItems)
                .groupBy('WindowTitle')
                .map(function (logItem, key)
                {
                    return {
                        label: key,
                        value: +(_(logItem)
                            .reduce(function(sum, logItem)
                            {
                                var beginDateTime = moment(logItem.BeginDateTime);
                                return sum + moment(logItem.EndDateTime).diff(beginDateTime, 'seconds', false);
                            }, 0)
                            .valueOf() / 60).toFixed(2)
                    }
                })
                .sortBy('value')
                .valueOf();

            var first10 = _
                .last(groups, groupCount)
                .reverse();

            $scope.chartConfig.xAxis.categories = _(first10)
                .map('label')
                .valueOf();

            $scope.chartSeries[0].data = _(first10)
                .map('value')
                .valueOf();
        });
});