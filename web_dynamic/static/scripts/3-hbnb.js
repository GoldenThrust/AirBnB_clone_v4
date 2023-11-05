$(document).ready(function (e) {
    let amenities = {};
    const host = '0.0.0.0';
    // Note: if you are testing on browser uncomment localhost and comment '0.0.0.0'
    // const host = 'localhost';

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

    $.post({
        url: `http://${host}:5001/api/v1/places_search/`,
        data: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json",
        },
        success: (data) => {
            data.forEach((place) => {
                $.getJSON(`http://${host}:5001/api/v1/users/${place.user_id}`, function (user) {
                    $("section.places").append(
                        `<article>
                                <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                                </div>
                                <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest <= 1 ? "" : "s"}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms <= 1 ? "" : "s"}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms <= 1 ? "" : "s"}</div>
                                </div>
                                <div class="user">
                            </div>
                            <div class="user">
                            <b>Owner:</b> ${user.first_name} ${user.last_name}
                          </div>
                                <div class="description">
                                ${place.description}
                    </div>
                    </article>`
                    )
                })
            }
            );
        },
    });
})