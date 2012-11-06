require('shelljs/global');

var fs = require('fs');
var jsonParse = require('json-parse');
var _ = require('underscore');


var PACKAGE_DIRECTORY = 'packages';
var JSON_FILE_NAME = 'pine-package.json';

function getJsonList () {
  var jsonList = [];
  var packageList = ls(PACKAGE_DIRECTORY);

  packageList.forEach(function (packageDir) {
    var jsonPath = [PACKAGE_DIRECTORY, packageDir, JSON_FILE_NAME].join('/');

    // "-e" tests for path existence.
    if (test('-e', jsonPath)) {
      jsonList.push(jsonPath);
    }
  });

  return jsonList;
}


function getPackageData () {
  var jsonList = getJsonList();
  var packageData = {};

  jsonList.forEach(function (jsonPath) {
    try {
      packageData[jsonPath] = jsonParse.sync(jsonPath);
      _.extend(packageData[jsonPath], {
        'path': jsonPath.split('/').slice(0, -1).join('/')
      });
    } catch (ex) {
      console.log(ex);
    }
  });

  return packageData;
}


function getPackageList () {
  var packageData = getPackageData();
  var packageKeys = _.keys(packageData);
  var sortedKeys = packageKeys.sort();
  var packageList = [];

  sortedKeys.forEach(function (package) {
    packageList.push(packageData[package]);
  });

  return packageList;
}


exports.getPackageList = getPackageList;
