/********************************************************************************
*   Stellar Ledger API
*   (c) 2017 LeNonDupe
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
********************************************************************************/
'use strict';

var Q = require('q');

var SledgerUtils = {}

SledgerUtils.splitPath = function(path) {
	var result = [];
	var components = path.split('/');
	components.forEach(function (element, index) {
		var number = parseInt(element, 10);
		if (isNaN(number)) {
			return;
		}
		if ((element.length > 1) && (element[element.length - 1] == "'")) {
			number += 0x80000000;
		}
		result.push(number);
	});
	return result;
}

SledgerUtils.foreach = function (arr, callback) {
	var deferred = Q.defer();
	var iterate = function (index, array, result) {
		if (index >= array.length) {
			deferred.resolve(result);
			return ;
		}
		callback(array[index], index).then(function (res) {
			result.push(res);
			iterate(index + 1, array, result);
		}).fail(function (ex) {
			deferred.reject(ex);
		}).done();
	};
	iterate(0, arr, []);
	return deferred.promise;
}

module.exports = SledgerUtils;
