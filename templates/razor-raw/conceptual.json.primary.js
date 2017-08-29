// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.

var common = require('./common.js');
var extension = require('./conceptual.extension.js')
var util = require('./statictoc.util.js');

exports.transform = function (model) {
    if (extension && extension.preTransform) {
        model = extension.preTransform(model);
    }

    model._disableToc = model._disableToc || !model._tocPath || (model._navPath === model._tocPath);
    model.docurl = model.docurl || common.getImproveTheDocHref(model, model._gitContribute, model._gitUrlPattern);
    model = util.setToc(model);

    if (extension && extension.postTransform) {
        model = extension.postTransform(model);
    }

    // AF: Super-hacky, but it works.
    // The TOC is actually a DynamicExpandoObject from DocFX managed code; it contains cycles and so JSON.stringify(model) fails; but not anymore (muhahaha!)
    if (model._toc)
        model._toc = JSON.parse(JSON.stringify(model._toc));
    if (model._nav)
        model._nav = JSON.parse(JSON.stringify(model._nav));

    model.rawJson = JSON.stringify(model, null, '    ');

    return model;
}