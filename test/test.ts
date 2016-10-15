/// <reference path="../defs/tsd.d.ts" />

var grunt: IGrunt = require('grunt');
import fs = require('fs');
import path = require('path');
import utils = require('../tasks/modules/utils');
import _ = require('lodash');
import * as nodeunit from 'nodeunit';

function testFile(test, path: string, whitespaceDifferencesOK = false) {
    var actualFileName = 'test/' + path,
        expectedFileName = 'test/expected/' + path;

    var actual = grunt.file.read(actualFileName);
    var expected = grunt.file.read(expectedFileName);

    if (whitespaceDifferencesOK) {
      actual = actual.replace(/\s/g,'');
      expected = expected.replace(/\s/g,'');
    }

    test.equal(expected, actual, `Actual did not match expected.  Run this to compare:` +
      `${grunt.util.linefeed}kdiff3 "${actualFileName}" "${expectedFileName}"`);
}

function assertFileDoesNotExist(test, path: string) {
    var exists = grunt.file.exists(path);
    test.equal(false, exists, 'Expected this file to not exist: ' + path);
}

export function testExpectedFile(test, path: string, whitespaceDifferencesOK = false) {
    let actualFileName = path.replace('\\expected', '').replace('/expected', '')
      .replace('.expected.', '.');
    let expectedFileName = path;

    var actual = grunt.file.read(actualFileName);
    var expected = grunt.file.read(expectedFileName);

    if (whitespaceDifferencesOK) {
      actual = actual.replace(/\s/g,'');
      expected = expected.replace(/\s/g,'');
    }

    test.equal(expected, actual, `Actual did not match expected.  Run this to compare:` +
      `${grunt.util.linefeed}kdiff3 "${actualFileName}" "${expectedFileName}"`);
}


function testDirectory(test, folder, whitespaceDifferencesOK = false) {
    var files = utils.getFiles(('test/expected/' + folder));
    _.forEach(files, (expected: string) => {
        testExpectedFile(test, expected, whitespaceDifferencesOK);
    });
}

export var tests : nodeunit.ITestGroup = {
    setUp: (callback) => {
       callback();
    },
	  tearDown: (callback) => {
       callback();
    },
    simple: function (test) {
        testFile(test, 'simple/js/zoo.js', true);
        testFile(test, 'simple/js/zoo.d.ts');
        test.done();
    },
    abtest: function (test) {
        testFile(test, 'abtest/reference.ts');
        testFile(test, 'abtest/out.js', true);
        test.done();
    },
    allowJs: function (test) {
        testDirectory(test, 'allowJs');
        test.done();
    },
    amdloader: function (test) {
        testDirectory(test, 'amdloader');
        test.done();
    },
    templateCache: function (test) {
        testDirectory(test, 'templateCache');
        test.done();
    },
    html2ts: function (test) {
        testDirectory(test, 'html');
        testDirectory(test, 'htmlTemplate');
        testDirectory(test, 'htmlSnakeModuleName');
        test.done();
    },
    index: function (test) {
        testDirectory(test, 'index');
        test.done();
    },
    transform: function (test) {
        testDirectory(test, 'transform', true);
        test.done();
    },
    referencesTransform: function (test) {
        testDirectory(test, 'references-transform');
        test.done();
    },
    customcompiler: function (test) {
        testDirectory(test, 'customcompiler');
        test.done();
    },
    fail: function (test) {
        testDirectory(test, 'fail'); // tested to make sure transformers still run for failing task
        test.done();
    },
    es6: function (test) {
        testDirectory(test, 'es6');
        test.done();
    },
    noEmitOnError: function (test) {
        testDirectory(test, 'noEmitOnError');
        assertFileDoesNotExist(test, 'test/noEmitOnError/testNoEmitOnError_true.js');
        test.done();
    },
    preserveConstEnums: function (test) {
        testDirectory(test, 'preserveConstEnums');
        test.done();
    },
    suppressImplicitAnyIndexErrors: function (test) {
        testDirectory(test, 'suppressImplicitAnyIndexErrors');
        assertFileDoesNotExist(test, 'test/suppressImplicitAnyIndexErrors/test_suppressImplicitAnyIndexError_false.js');
        test.done();
    },
    varReplacedTest: function (test) {
        testDirectory(test, 'varreplacedtest');
        test.done();
    },
    vsproj_test_ignoreSettings: function (test) {
        testDirectory(test, 'vsproj/ignoreSettings');
        test.done();
    },
    files_ObjectFormat: function (test) {
        testDirectory(test, 'files_ObjectFormat', true);
        test.done();
    },
    out_and_outdir_with_spaces: function (test) {
        testDirectory(test, 'out with spaces');
        test.done();
    },
    htmlExternal: function (test) {
        testDirectory(test, 'htmlExternal');
        test.done();
    },
    nestedSources: function (test) {
        testDirectory(test, 'nestedSources');
        test.done();
    }
}
