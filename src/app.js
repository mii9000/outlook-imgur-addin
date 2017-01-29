(function () {
    var auth;

    var loginDiv = $('#login-div'),
        loaderDiv = $('#loader-div'),
        loginBtn = $('#btnlogin'),
        albumsDiv = $('#albums-div'),
        albumsInsert = $('#albums-insert'),
        picsDiv = $('#pics-div'),
        picsInsert = $('#pics-insert'),
        backAlbums = $('#back-albums');

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function() {
            loginBtn.click(login);
            albumsInsert.on('click', '.album-row', albumClick);
            picsInsert.on('click', '.image-row', imageClick);
            backAlbums.click(backAlbumsClick);
        });
    };

    function login(){
        loginDiv.hide();
        loaderDiv.show();
        var authurl = 'https://api.imgur.com/oauth2/authorize?client_id=7ecc191278e108f&response_type=token';
        Office.context.ui.displayDialogAsync(authurl, 
            { height: 65, width: 50, requireHTTPS: true }, 
            function(asyncResult)
        {
            var dialog = asyncResult.value;
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, function(event){
                auth = JSON.parse(event.message);
                dialog.close();
                fetchAlbums();
            });
        });
    }

    function renderAlbum(img, id){
        return '<div data-id="'+ id +'" class="album-row col-lg-4 col-sm-6 col-xs-12">' +
                    '<a href="#">' +
                        '<img src="'+ img +'" class="thumbnail img-responsive">' +
                    '</a>' +
               '</div>'
    }

    function renderImage(image){
        return "<div data-image='"+ JSON.stringify(image) +"' class='image-row col-lg-4 col-sm-6 col-xs-12'>" +
                    '<a href="#">' +
                        '<img src="'+ image.link +'" class="thumbnail img-responsive">' +
                    '</a>' +
               '</div>'
    }

    function get(url){
        return $.ajax({
            url: url,
            headers: {
                "Authorization": "Bearer " + auth.access_token
            }
        });        
    }

    function fetchAlbums(){
        var getAlbumsUrl = 'https://api.imgur.com/3/account/'+ auth.account_username +'/albums';
        get(getAlbumsUrl).done(function(albums){
            for (var i = 0; i < albums.data.length; i++) {
                var album = albums.data[i], getCoverImg = 'https://api.imgur.com/3/album/'+ album.id +'/image/' + album.cover;
                if(album.cover){
                    (function(album){
                        get(getCoverImg).done(function(image){
                            var albumHtml = renderAlbum(image.data.link, album.id);
                            albumsInsert.append(albumHtml);
                            loaderDiv.hide();
                            albumsDiv.show();
                        });                        
                    })(album);
                }
            }
        });        
    }

    function albumClick(){
        var albumId = $(this).data('id'), getAlbumImagesUrl = 'https://api.imgur.com/3/album/'+ albumId +'/images';
        albumsDiv.hide();
        loaderDiv.show();
        picsInsert.empty();
        get(getAlbumImagesUrl).done(function(images){
            for (var i = 0; i < images.data.length; i++) {
                var image = images.data[i], imageHtml = renderImage(image);
                picsInsert.append(imageHtml);
                loaderDiv.hide();
                picsDiv.show();           
            }
        });
    }

    function imageClick(){
        var image = $(this).data('image'), setHtml = '<p><img src="'+ image.link +'" /></p>';
        Office.context.mailbox.item.body.setSelectedDataAsync(setHtml,{coercionType: Office.CoercionType.Html});
    }

    function backAlbumsClick(){
        picsDiv.hide();
        albumsDiv.show();
    }

})();