angular.module("naturelive", [])

.constant("CamerasList", {
    "viiru" : {
        "stream" : {
            "type" : "iframe",
            "src"  : "https://www.youtube-nocookie.com/embed/EYlV5GgKYLw?rel=0&amp;controls=0&amp;showinfo=0?ecver=1"
        }
    },
    "saaristosaaksi" : {
        "stream" : {
            "type" : "iframe",
            "src"  : "https://www.youtube-nocookie.com/embed/qR4O0JB1Qxw?rel=0&amp;controls=0&amp;showinfo=0?ecver=1"
        }
    },
    "janakkalasaaksi" : {
        "origin" : "https://www.metsamaailma.fi/fi/ForestInformation/Sivut/saaksi.aspx"
    },
    "iss" : {
        "origin" : "http://www.ustream.tv/channel/live-iss-stream",
        "stream" : {
            "type" : "iframe",
            "src"  : "http://www.ustream.tv/embed/9408562?html5ui"
        }
    },
    "jattiharmaapolloUSA" : {
        "stream" : {
            "type" : "iframe",
            "src"  : "https://www.youtube-nocookie.com/embed/CCx5UmygKRo?rel=0&amp;controls=0&amp;showinfo=0?ecver=1"
        }
    }
})

// SESSIONSERVICE
.service("session", [function(){
    this.selected = [ "viiru", "saaristosaaksi", "iss", "jattiharmaapolloUSA" ];
    this.screens_per_row = 4;

    this._onChangeFuncs = [];
    this.onChange = function( func ) {
        this._onChangeFuncs.push( func );
    }
    this.changed = function() {
        for(var i in this._onChangeFuncs) this._onChangeFuncs[i]( this );
    }
}])

// RUN
.run(["$rootScope", function($rootScope) {

}])

// CONFIG
.config([function(){

}])

// CONTROLSCONTROLLER
.controller("controlsController", ["$scope", "session", function($scope, session) {
    $scope.open = true;
    $scope.session = session;
}])


// CONTROLSCONTROLLER
.controller("screensController", ["$scope", "$timeout", "$sce", "session", "CamerasList", function($scope, $timeout, $sce, session, CamerasList) {

    $scope.screens = [];

    $scope.colscount = 0;
    $scope.width = 3;

    function refreshDOM() {
        $scope.colscount = 12 / session.screens_per_row;
        $timeout(function(){
            var screens = [];
            for(var i in session.selected) {
                if ( CamerasList[ session.selected[i] ] ) {
                    var camera = CamerasList[ session.selected[i] ], screen = camera;
                    screens.push( screen );
                } else console.error( "Camera '"+ session.selected[i] +"' not found from CamerasList" );
            }
            $scope.screens = screens;
        })
    }

    session.onChange(refreshDOM);
    refreshDOM();
}])

.component("screenComponentIframe", {
    "template"   : '<iframe frameborder="0" webkitallowfullscreen allowfullscreen scrolling="0" ng-src="{{$ctrl.src}}"></iframe>',
    "controller" : function($sce, $timeout, $element) {
        var ctrl = this;
        ctrl.src = null;
        $timeout(function(){
            ctrl.src = $sce.trustAsResourceUrl( ctrl.screen.stream.src );
            onResize();
        });
        function onResize() {
            console.log($element);
        }
    },
    "bindings" : {
        "screen" : "<"
    }
})

.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return val != null ? parseInt(val, 10) : null;
      });
      ngModel.$formatters.push(function(val) {
        return val != null ? '' + val : null;
      });
    }
  };
});
