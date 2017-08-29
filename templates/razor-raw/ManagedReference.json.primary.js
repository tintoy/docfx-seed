// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.

var mrefCommon = require('./ManagedReference.common.js');
var extension = require('./ManagedReference.extension.js')
var util = require('./statictoc.util.js');

exports.transform = function (model) {
    if (extension && extension.preTransform) {
        model = extension.preTransform(model);
    }

    if (mrefCommon && mrefCommon.transform) {
        model = mrefCommon.transform(model);
    }
    if (model.type.toLowerCase() === "enum") {
        model.isClass = false;
        model.isEnum = true;
    }
    
    model._disableToc = model._disableToc || !model._tocPath || (model._navPath === model._tocPath);
    model = util.setToc(model);

    if (!model.docurl && !model.sourceurl)
        model._disableContribution = true;

    if (extension && extension.postTransform) {
        model = extension.postTransform(model);
    }

    // AF: Super-hacky, but it works.
    // The TOC is actually a DynamicExpandoObject from DocFX managed code; it contains cycles and so JSON.stringify(model) fails; but not anymore (muhahaha!)
    model._toc = JSON.parse(JSON.stringify(model._toc));
    model._nav = JSON.parse(JSON.stringify(model._nav));

    model.rawJson = JSON.stringify(model, null, '    ');

    return model;
}

exports.getOptions = function (model) {
    return {
        "bookmarks": mrefCommon.getBookmarks(model)
    };
}