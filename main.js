require(['./config'], function () {

var userToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAibGFicy10NDAyLmZ5cmUuY28iLCAiZXhwaXJlcyI6IDEzNjY0OTE0NjkuNjU0NjU4LCAidXNlcl9pZCI6ICJ1c2VyXzAifQ.MSGGgu67OrS2C2ENro5NR6YVF5f7wJeoKuR3IzNqHZ4';

// Create a Feed to display the StreamHub Collection
require([
	'fyre',
	'streamhub-backbone',
	'text!streamhub-backbone/templates/Content.html',
	'mustache',
	'jquery'],
function(fyre, Hub, ContentHtml, Mustache, $){
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
    fyre.conv.load({
        network: "labs-t402.fyre.co"
    }, [{app: 'sdk'}], loadApp);

    var contentTemplate = Mustache.compile(ContentHtml);
    /**
    StreamHub does not quite yet support attaching images
    via API. It will soon, but until then, Filepicker links
    will be submitted just as links, and this template will
    parse them out and turn them into attached Media. Sneaky.
    */
    function filePickerTemplate (data) {
    	var bodyHtml = data.bodyHtml,
    		$html = $(bodyHtml),
    		$anchors = $html.find('a'),
    		$filePickerAnchors = $anchors.filter('a[href*="filepicker"]'),
    		attachments = [];
    	if ($filePickerAnchors.length > 0) {
    		// Convert to attachments
    		$filePickerAnchors.each(function (index, element) {
    			attachments.push({
    				version: '1.0',
	                type: 'photo',
	                provider: 'filepicker',
	                url: element.innerText
	            });
    		});
    		data.attachments = attachments;
    		// Don't display them, they're attachments now
    		$filePickerAnchors.remove();
    		data.bodyHtml = outerHtml($html);
    	}
    	return contentTemplate(data);
    }
    // Returns the full HTML representation of an $element
    function outerHtml ($el) {
        return $("<p>").append($el.eq(0).clone()).html();
    }
});

// Wire up the Filepicking button
require([
	'filepicker',
	'jquery'],
function (filepicker, $) {
	var postUrl = 'http://quill.labs-t402.fyre.co/api/v3.0/collection/10667505/post/';

	filepicker.setKey('AYNlO8P2PT6qnCfo9eCw2z');

	$('.upload-button').click(function (e) {
		e.preventDefault();
		pickFile(postFile);
	});

	// Use Filepicker.io to choose a file
	function pickFile (cb) {
		filepicker.pick(
			{mimetype: 'image/*'},
			function filePickSuccess (fpFile) {
				cb(fpFile);
			},
			errorPicking
		);
	}
	function errorPicking (fpError) {
		console.log("Error picking", fpError);
	}
	
	// Post the File into StreamHub
	function postFile (fpFile) {
		if ( ! fpFile || ! fpFile.url ) {
			return console.log("There is no file to post");
		}
		var fileUrl = fpFile.url,
			jqxhr = $.post(postUrl, {
				lftoken: userToken,
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