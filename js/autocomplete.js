// AUTOCOMPLETE.JS
//
// Note:
// - Uses JQuery 3.4.1

// function which makes each Autocomplete element work
$.fn.AutoComplete = function() {
    // global variables
    var searchUrl = 'http://niche-recruiting-autocomplete.appspot.com/search/?query='
    var acFocus;

    // find the input and the list
    var $acinput = this.find('.ac-input');
    var $aclist = this.find('.ac-list');

    // add event listener to the input
    $acinput.on('input', function() {
        // clear previous results
        // console.clear(); // debugging
        $aclist.children().remove();

        // get new input
        var qString = $acinput.val();
        var exampleSearchUrl = searchUrl + qString;

        // show results
        JSONPUtil.LoadJSONP(exampleSearchUrl, (response) => {
            for(var i = 0; i < response.results.length; i ++) {
                // print results to console for debugging purposes
                // console.log(response.results[i].name);
                // console.log(" - " + response.results[i].location);

                // add results to list
                var $a = $('<a/>', {href: response.results[i].url, class: 'ac-item'});
                var $n = $('<p/>', {class: 'ac-name'}).text(response.results[i].name);
                var $l = $('<p/>', {class: 'ac-location'}).text(response.results[i].location);
                $a.append($n);
                $a.append($l);
                $aclist.append($a);
            }
        });

        // reset focus
        acFocus = -1;

    });

    // add keypress event
    $acinput.keydown(function(e) {
        var $key = e.keyCode;
        var $size = $aclist.children().length

        // down key pressed
        if($key == 40) {
            e.preventDefault();
            acFocus ++
            if(acFocus > $size - 1) {
                acFocus = 0;
            }
            $aclist.find('a').removeClass('active');
            $aclist.find('a').eq(acFocus).addClass('active');
            $acinput.val($aclist.find('a').eq(acFocus).children().first().text());

        // up key pressed
        } else if($key == 38) {
            e.preventDefault();
            acFocus --;
            if(acFocus < 0) {
                acFocus = $size - 1;
            }
            $aclist.find('a').removeClass('active');
            $aclist.find('a').eq(acFocus).addClass('active');
            $acinput.val($aclist.find('a').eq(acFocus).children().first().text());

        // enter key pressed
        } else if($key == 13) {
            e.preventDefault();
            if(acFocus > -1) {
                window.location = $aclist.find('a').eq(acFocus).attr('href');
            }
        }
    });

    // clears input and hides autocomplete when document is clicked on
    $(document).on('click', function() {
        $('.ac-list').children().remove();
        $acinput.val('');
    });
}

// adds the functionality to all autocomplete items
$(document).ready(function() {
    $('.ui-autocomplete').each(function() {
        $(this).AutoComplete();
    })
});