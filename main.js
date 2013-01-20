// # Livefyre StreamHub + Filepicker.io
// StreamHub hosts Collections of Content.
// StreamHub-Backbone helps you render them nicely.
// Filepicker.io is a great source of Content.
// Now you can use them all together. Hooray!

// Load config, which tells RequireJS where dependencies are
require(['./config'], function () {

// Use the same Livefyre Auth Token for all uploads.
// This is just a demo user.
var userToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAibGFicy10NDAyLmZ5cmUuY28iLCAiZXhwaXJlcyI6IDEzNjY0OTE0NjkuNjU0NjU4LCAidXNlcl9pZCI6ICJ1c2VyXzAifQ.MSGGgu67OrS2C2ENro5NR6YVF5f7wJeoKuR3IzNqHZ4';

// ## Display the Collection of Content
// This is what the user will see

// First, get the required dependencies
require([
    'fyre',
    'streamhub-backbone',
    'text!streamhub-backbone/templates/Content.html',
    'mustache',
    'jquery'],
function(fyre, Hub, ContentHtml, Mustache, $){
    // Load a StreamHub SDK
    fyre.conv.load({
        network: "labs-t402.fyre.co"
    }, [{app: 'sdk'}], loadApp);
    // This will be passed the instantiated SDK object
    function loadApp (sdk) {
        var app = window.app = new Hub({
            sdk: sdk,
            collection: {
                siteId: "303827",
                articleId: "fp_demo_0"
            },
            contentViewOptions: {
                template: filePickerTemplate
            },
            el: document.getElementById("example-feed")
        });
    }

    // StreamHub does not quite yet support attaching images
    // via API. It will soon, but until then, Filepicker links
    // will be submitted just as links, and this template will
    // parse them out and turn them into attached Media. Sneaky.
    
    // Compile the default Content Mustache template.
    var contentTemplate = Mustache.compile(ContentHtml);
    // This is the custom template function. Template functions
    // take in Content JSON and output HTML
    function filePickerTemplate (data) {
        // Look in the bodyHtml for links that contain filepicker
        var bodyHtml = data.bodyHtml,
            $html = $(bodyHtml),
            $anchors = $html.find('a'),
            $filePickerAnchors = $anchors.filter('a[href*="filepicker"]'),
            attachments = [];
        if ($filePickerAnchors.length > 0) {
            // If there's filepicker links, add an attachment for each
            $filePickerAnchors.each(function (index, element) {
                // Attachments are oEmbed JSON Objects
                attachments.push({
                    version: '1.0',
                    type: 'photo',
                    provider: 'filepicker',
                    url: element.innerText
                });
            });
            data.attachments = attachments;
            // Remove the actual links from the bodyHtml
            // since they're now rich attachments
            $filePickerAnchors.remove();
            data.bodyHtml = outerHtml($html);
            // Change the display name to the heroic UploaderDude
            data.author.displayName = 'UploaderDude';
        }
        return contentTemplate(data);
    }
    // Returns the full HTML representation of an $element
    function outerHtml ($el) {
        return $("<p>").append($el.eq(0).clone()).html();
    }
});

// ## The Filepicking button
// When a user clicks the button, help them pick a file through
// Filepicker.io. Then post it to the StreamHub Collection

// First, load the dependencies
require([
    'filepicker',
    'jquery'],
function (filepicker, $) {
    var postUrl = 'http://quill.labs-t402.fyre.co/api/v3.0/collection/10667505/post/';

    // Filepicker.io needs to know what API Key to use
    filepicker.setKey('AYNlO8P2PT6qnCfo9eCw2z');

    // Bind a click handler to the upload button so that it
    // lets you pick a file when you click it
    $('.upload-button').click(function (e) {
        e.preventDefault();

        pickFile(postFile);
    });

    // ### Use Filepicker.io to choose a file
    function pickFile (cb) {
        filepicker.pick(
            // Only allow images
            {mimetype: 'image/*'},
            function filePickSuccess (fpFile) {
                // Pass the `fpFile` to the provided `cb`
                cb(fpFile);
            },
            errorPicking
        );
    }
    function errorPicking (fpError) {
        console.log("Error picking", fpError);
    }
    
    // ### Post the File into StreamHub

    // Posted Content will come down from the Collection's stream
    function postFile (fpFile) {
        if ( ! fpFile || ! fpFile.url ) {
            return console.log("There is no file to post");
        }
        var fileUrl = fpFile.url,
            jqxhr = $.post(postUrl, {
                lftoken: userToken,
                // The Content bodyHtml will just be a link
                // to the picked file. We'll parse it out on render
                body: fileUrl
            });

        jqxhr.success(function () {
            console.log("Successful posting to StreamHub");
        })
        jqxhr.error(function () {
            console.log("Error posting to StreamHub");
        })
    }
});

console.log('main loaded');
});