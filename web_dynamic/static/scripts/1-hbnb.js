$(document).ready(function(e) {
    let amenities = {}

    $('.amenities input[type="checkbox"]').on('change', function(e) {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            amenities[id] = name;
        } else {
            delete amenities[id];
        }

        $('.amenities h4').text(Object.values(amenities).join(', '))
    })
})