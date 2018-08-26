$(document).ready(function ($) {

    $('.alert').delay(3000).fadeOut();
    $('.delete').on('click', function (e) {
        e.preventDefault();
        var url = ($(this).attr('href'));
        var site = ($(this).attr('id'));
        $('#body').html('You are about to delete ' + site);
        $('#confirm').modal()
            .one('click', '#delete', function (e) {
                e.preventDefault();
                document.location.href = url;
            });
    });
});