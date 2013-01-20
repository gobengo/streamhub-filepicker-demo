// Require.js Config
require.config({
    packages: [{
        name: 'streamhub-backbone',
        location: 'components/streamhub-backbone'
    }],
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        mustache: 'components/mustache/mustache',
        text: 'components/requirejs-text/text',
        fyre: 'http://zor.t402.livefyre.com/wjs/v3.0.sdk/javascripts/livefyre',
        filepicker: '//api.filepicker.io/v1/filepicker'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        fyre: {
            exports: 'fyre'
        },
        filepicker: {
            exports: 'filepicker'
        }
    }
});