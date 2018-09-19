$(document).ready(function ($) {
    $('[data-toggle="tooltip"]').tooltip()
    $('.alert').delay(5000).fadeOut();
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

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }


    $('.config_toggle').change(function () {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        var value = $(this).prop('checked')
        var id = 'proxy'
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        $.ajax({
            url: '/modify_settings/',
            type: "POST",
            data: {'value': value, 'id': id, csrfmiddlewaretoken: csrftoken},
            dataType: 'json'
        })
    })

    $('#change_email').click(function () {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        var value = $('#new_email').val()
        var id = 'email'
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        if (value) {
            $.ajax({
            url: '/modify_settings/',
            type: "POST",
            data: {'value': value,'id': id, csrfmiddlewaretoken: csrftoken},
            dataType: 'json'
        })
        }

    })

});