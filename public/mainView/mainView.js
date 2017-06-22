angular.module('environments.mainViewDirective', [])
    .directive('mainViewDirective', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainView/mainView.html',
            scope: {},
            controller: function ($scope, $window, $timeout) {
                $scope.addEnvironment = function (name, name2, url, sfurl) {
                    var newEnvironment = { // e.g.
                        name: name, // aft2
                        name2: name2, // ma11
                        url: url, //cstu
                        login: 'https://' + url + '.farmers.com/login/', // https://csstu.farmers.com/login/
                        sfurl: sfurl, // cs40
                        dev: 'https://farmers--' + name + '.' + sfurl + '.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage', // https://farmers--aft2.cs40.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage
                        setup: 'https://farmers--' + name + '.' + sfurl + '.my.salesforce.com/setup/forcecomHomepage.apexp', // https://farmers--aft2.cs40.my.salesforce.com/setup/forcecomHomepage.apexp
                        version: 'https://' + name + '-farmers.' + sfurl + '.force.com/customerselfservice/CSSU#/versionindicator', // https://aft2-farmers.cs40.force.com/customerselfservice/CSSU#/versionindicator
                        payment: 'https://' + name + '-farmers.' + sfurl + '.force.com/customerselfservice/CSSPayment#/versionindicator' // https://pladev-farmers.cs24.force.com/customerselfservice/CSSPayment#/versionindicator
                    };
                    $scope.environments[name] = newEnvironment;
                };

                $scope.initEnvironments = function () {
                    $scope.environments = {};
                    $scope.addEnvironment('pladev', 'TSJ1', 'csstw', 'cs24');
                    $scope.addEnvironment('uat3', 'RA11', 'csstv', 'cs14');
                    $scope.addEnvironment('uat5', 'MI61', 'cssta', 'cs19');
                    $scope.addEnvironment('aft2', 'MA11', 'csstu', 'cs40');
                    $scope.addEnvironment('aft3', 'TL21', 'csstc', 'cs16');
                    $scope.addEnvironment('pet1', 'RS11', 'csstp', 'cs40');
                    $scope.addEnvironment('pet2', 'MI51', 'cssts', 'cs24');
                    // $scope.addEnvironment('perf', 'QS11', 'csstd', 'cs8');
                    $scope.addEnvironment('perf2', 'QS11', 'csstd', 'cs28');
                };
                $scope.initEnvironments();

                $scope.gotoEnvironment = function (env, state) {
                    if (state === 'dev' || state === 'setup' || state === 'login' || state === 'version' || state === 'payment')
                        $scope.goto(env[state]);
                };

                $scope.inputGoto = function () {
                    if (!$scope.inputQuery)
                        return 'bad query';
                    var splitQuery = $scope.inputQuery.split(' ');
                    if (splitQuery.length < 1)
                        return 'bad query';

                    var envName = splitQuery[0].toLowerCase();
                    var matchEnv = _.find($scope.environments, function (env) {
                        return envName === env.name.toLowerCase() || envName === env.name2.toLowerCase() || envName === env.url.toLowerCase();
                    });
                    if (!matchEnv)
                        return 'no such environment found';

                    var stateMap = {'l': 'login', 'd': 'dev', 's': 'setup', 'v': 'version', 'p': 'payment'};
                    var state = splitQuery[1] && stateMap[splitQuery[1][0]] ? stateMap[splitQuery[1][0]] : 'login';

                    $scope.gotoEnvironment(matchEnv, state);
                };

                $scope.inputEnter = function () {
                    $scope.errorMessage = (( err = $scope.inputGoto()) ? err : $scope.errorMessage);
                };

                $scope.gotoCoe = function () {
                    $scope.goto('https://farmerscoe.my.salesforce.com/?ec=302&startURL=%2Fhome%2Fhome.jsp');
                };

                $scope.gotoAllVersions = function () {
                    _.each($scope.environments, function (env) {
                        $scope.gotoEnvironment(env, 'version')
                    });
                };

                $scope.gotoProdVersion = function () {
                    $scope.goto('https://www.farmers.com/customerselfservice/CSSU#/versionindicator');
                };

                $scope.gotoAllPayments = function () {
                    _.each($scope.environments, function (env) {
                        $scope.gotoEnvironment(env, 'payment')
                    });
                };

                $scope.goto = function (where, code) {
                    $scope.errorMessage = "\n___  ___  ___   _   _ _   _ _   __  _____ _____    ___  _    _ _____ _____ _____ ________  ___ _____\n|  \\/  | / _ \\ | \\ | | | | | | / / |_   _/  ___|  / _ \\| |  | |  ___/  ___|  ___|  _  |  \\/  ||  ___|\n| .  . |/ /_\\ \\|  \\| | | | | |/ /    | | \\ `--.  / /_\\ \\ |  | | |__ \\ `--.| |__ | | | | .  . || |__\n| |\\/| ||  _  || . ` | | | |    \\    | |  `--. \\ |  _  | |/\\| |  __| `--. \\  __|| | | | |\\/| ||  __|\n| |  | || | | || |\\  | |_| | |\\  \\  _| |_/\\__/ / | | | \\  /\\  / |___/\\__/ / |___\\ \\_/ / |  | || |___\n\\_|  |_/\\_| |_/\\_| \\_/\\___/\\_| \\_/  \\___/\\____/  \\_| |_/\\/  \\/\\____/\\____/\\____/ \\___/\\_|  |_/\\____/";
                    $timeout(function () {
                        $scope.errorMessage = "";
                        $window.open(where, "_blank");
                    }, 100);
                };
            }
        };
    });