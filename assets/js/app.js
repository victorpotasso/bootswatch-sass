/**
 * DOM Ready
 */
$(window).ready(function()
{
    getThemes("themes.json");
});

/**
 * Get themes
 */
var getThemes = function(file)
{
    $.getJSON( file, function(data) 
    {
        $.each( data, function( key, value ) 
        {            
            $("#content").find("#themes").append(
            '<div class="col-lg-4 col-sm-6" style="padding-left:1em; padding-right:1em;">' +                    
                
                '<div class="jumbotron" style="height:420px; text-align:center">' +                            '<img src="themes/' + key + '/thumbnail.png" style="width:100%;">' + 
                    '<h1>' + key + '</h1>' +
                    '<p>' + value.description + '</p>' +
                    '<div class="btn-group" style="padding:0.5em;"><a class="btn btn-info" href="themes/' + key + '">Preview</a></div>' +
                    '<div class="btn-group" style="padding:0.5em;">' +
                        '<a class="btn btn-info" target="_blank">Download</a>' +
                        '<a class="btn btn-info dropdown-toggle" data-toggle="dropdown" href="#" target="_blank">'+
                            '<span class="caret"></span>'+
                        '</a>' +
                        '<ul class="dropdown-menu">' +
                            '<li><a href="themes/' + key + '/bootstrap.css" target="_blank">bootstrap.css</a></li>' +
                             '<li class="divider"></li>' +
                             '<li><a href="themes/' + key + '/_variables.scss" target="_blank">variables.scss</a></li>'+
                             '<li><a href="themes/' + key + '/_bootswatch.scss" target="_blank">bootswatch.scss</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>'
            );

            console.log( key + ": " + value.description );
        });
    })
    .fail(function() {
        console.log( "error" );
    });
};
