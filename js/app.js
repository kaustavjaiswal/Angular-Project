angular.module('weather', [])

.factory('openweather', function($http) {
	var runRequest = function(city) {
		return $http({
			method: 'JSONP',
			url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city + '&mode=json&units=metric&cnt=5&callback=JSON_CALLBACK'
		});
	};
	return {
		event: function(city) {
			return runRequest(city);
		}
	};
})

.controller('WeatherForecastCtrl', function($scope, $timeout, openweather){
	var timeout;	
	$scope.resultsData = false;
	$scope.$watch('city', function(newCity) {
		if(newCity) {
			if(timeout) $timeout.cancel(timeout);
			timeout = $timeout(function() {
				openweather.event(newCity).success(function(data, status)	{					
					$scope.loc = data;
					$scope.forecast = data.list;
					$scope.resultsData=false;
				});
				openweather.event(newCity).error(function()	{
								$scope.resultsData=true;
				});
			},3000);
		}
	});
		$scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < 5 - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : 5 - 1;
        };
});