$(document).ready(function (e) {
    let amenities = {};
    let host = '0.0.0.0';
    // Note: if you are testing on browser uncomment localhost and comment '0.0.0.0'
    // let host = 'localhost';

    $('.amenities input[type="checkbox"]').on('change', function (e) {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            amenities[id] = name;
        } else {
            delete amenities[id];
        }

        $('.amenities h4').text(Object.values(amenities).join(', '))
    })

    const api = `http://${host}:5001/api/v1/status/`;

    $.getJSON(api, function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
})