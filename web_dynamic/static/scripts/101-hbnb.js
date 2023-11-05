$(document).ready(function (e) {
    let amenities = {};
    let cities = {};
    let states = {};

    // let host = '0.0.0.0';
    // Note: if you are testing on browser uncomment localhost and comment '0.0.0.0'
    let host = 'localhost';

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

    $('.locations input[type="checkbox"]').on('change', function (e) {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');

        if (e.target.parentElement.tagName == 'H2') {
            if ($(this).is(':checked')) {
                states[id] = name;
            } else {
                delete states[id];
            }
        } else {
            if ($(this).is(':checked')) {
                cities[id] = name;
            } else {
                delete cities[id];
            }
        }

        $('.locations h4').text(Object.values(Object.assign({}, cities, states)).join(', '))
    })

    const api = `http://${host}:5001/api/v1/status/`;

    $.getJSON(api, function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    function searchPlace() {
        console.log()
        $.post({
            url: `http://${host}:5001/api/v1/places_search/`,
            data: JSON.stringify({ amenities: Object.keys(amenities), cities: Object.keys(cities), states: Object.keys(states) }),
            headers: {
                "Content-Type": "application/json",
            },
            success: (data) => {
                $("section.places").html('')
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
                        <div class="reviews" data-place="${place.id}">
                        <h2></h2>
                        <ul></ul>
                      </div>
                        </article>`
                        )
                        fetchReviews(place.id);
                    })
                }
                );
            },
        })
    }

    $(".filters button").on("click", searchPlace);
    searchPlace();

    function fetchReviews(place_id) {
        $.getJSON(
            `http://${host}:5001/api/v1/places/${place_id}/reviews`,
            (data) => {
                $(`.reviews[data-place="${place_id}"] h2`).html(`${data.length} Review${data.length <= 1 ? '' : 's'} <span class="toggle_review">show</span>`);

                data.forEach((review) => {
                    $.getJSON(
                        `http://${host}:5001/api/v1/users/${review.user_id}`,
                        (user) =>
                            $(`.reviews[data-place="${place_id}"] ul`).append(`
                  <li>
                    <h3>From ${user.first_name + " " + user.last_name} the ${parseDate(review.created_at)
                                }</h3>
                    <p>${review.text}</p>
                  </li>`)
                    );
                });

                const review = $(`.reviews[data-place="${place_id}"] ul`);
                review.css("display", "none");
                $(`.reviews[data-place="${place_id}"] h2 .toggle_review`).on(
                    "click", function (e) {
                        if (review.css("display") === "none") {
                            $(`.reviews[data-place="${place_id}"] h2 .toggle_review`).text('hide')
                            review.css("display", "block");
                        } else {
                            review.css("display", "none");
                            $(`.reviews[data-place="${place_id}"] h2 .toggle_review`).text('show')
                        }
                    }
                );
            }
        );
    }
})

// Note: all review date are the same
function parseDate(inputDateString) {
    let date = new Date(inputDateString);

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let dayWithSuffix = day + (
        (day === 1 || day === 21 || day === 31) ? "st" :
            (day === 2 || day === 22) ? "nd" :
                (day === 3 || day === 23) ? "rd" : "th"
    );

    let formattedDateString = dayWithSuffix + " " + monthNames[month] + " " + year;
    return (formattedDateString);
}
