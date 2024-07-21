//Script to dynamically load community and admin posts based on their tab


$(document).ready(function() {
    const adminPostsUrl = $('#myTab').data('admin-url');
    const communityPostsUrl = $('#myTab').data('community-url');

    function loadContent(tabId, url) {
        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                $(tabId).html(data);
            },
            error: function(xhr, status, error) {
                console.error('Failed to load content:', error);
            }
        });
    }

    loadContent('#admin-posts-content', adminPostsUrl);

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        if (target == '#admin-posts') {
            loadContent('#admin-posts-content', adminPostsUrl);
        } else if (target == '#community-posts') {
            loadContent('#community-posts-content', communityPostsUrl);
        }
    });
});


function toggleContent(button) {
    var postId = button.getAttribute('data-post-id');
    var previewContent = document.getElementById('previewContent' + postId);
    var fullContent = document.getElementById('fullContent' + postId);
    var card = document.getElementById('card' + postId);

    if (fullContent.classList.contains('d-none')) {
        previewContent.classList.add('d-none');
        fullContent.classList.remove('d-none');
        card.style.maxHeight = 'none';
        button.textContent = 'Read Less';
    } else {
        previewContent.classList.remove('d-none');
        fullContent.classList.add('d-none');
        card.style.maxHeight = '200px';
        button.textContent = 'Read More';
    }
}