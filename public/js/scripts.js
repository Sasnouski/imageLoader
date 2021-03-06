

$(function(){
    $('#post-comment').hide();
    $('#btn-comment').on('click', function(event) {
        event.preventDefault();
        $('#post-comment').toggle('show');
    });

    $('#btn-like').on('click', function(event) {
        event.preventDefault();
        var imgId = $(this).data('id');
        $.post('/images/' + imgId + '/like').done(function(data) {
            $('.likes-count').text(data.likes);
        });
    });

    $('#btn-delete').on('click', function(event) {
        event.preventDefault();
        var $this = $(this);
        var remove = confirm('Are you sure you want to delete this image?');
        if (remove) {
            var imgId = $(this).data('id');
            $.ajax({
                url: '/images/' + imgId,
                type: 'DELETE'
            }).done(function(result) {
                console.log('result  ' + result);
                if (result) {
                    $this.removeClass('btn-danger').addClass('btnsuccess');
                    $this.find('i').removeClass('fa-times').addClass('facheck');
                    $this.append('<span> Deleted!</span>');
                    window.location.href='http://localhost:3300';
                }
            });
        }
    });



});
