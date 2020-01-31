//"use strict";

// Zomato API Key
const zomatoApiKey = "bdf061b7ff13160c0b5ed3be06170ae7";

// Zomato API
const zomatoUrl = "https://developers.zomato.com/api/v2.1";

// Function to generate types of cuisines on field dropdown
const cuisineOptions = {
    0: "Anything!",
    3: "Asian", //3
    159: "Brazilian", //159
    100: "Desserts", //100
    268: "Drinks", //268
    55: "Italian", //55
    45: "French", //45
    143: "Healthy Food", //143
    148: "Indian", //148
    70: "Mediterranean", //70
    73: "Mexican", //73
    996: "New American", //996
    471: "Southern", //471
    177: "Sushi", //177
    95: "Thai", //95
    308: "Vegetarian", //308
}

let cuisineList = $("#js-cuisineList");
$.each(cuisineOptions, function(val, text) {
    cuisineList.append(
        $('<option></option>').val(val).html(text)
    );
});

// Function to generate entity_id for the user's city using /locations? endpoint
function getEntityID(userCity) {
    const options = {
        headers: new Headers({
            'user-key': zomatoApiKey
        })
    };

    const params = {
        query: userCity
    };

    let queryString = $.param(params);
    const url = zomatoUrl + '/locations?' + queryString;

    fetch(url, options)
        .then(response => {
        if (response.ok) {
            return response.json();
            }
            throw new Error(response.statusText);
            }) 
            .then(responseJson => {
                getRestaurants(responseJson.location_suggestions[0].entity_id)
            })
            .catch(err => {
                $('#js-error-message').text(`Uh oh, something broke: ${err.message}`);
                console.log(err);
    });    
}

// Generate restaurants based on the location the user entered using the entity_id generated from getEntityID()
function getRestaurants(entity_id) {
    const options = {
        headers: new Headers({
            'user-key': zomatoApiKey
        })
    };

    const params = {
        entity_id: entity_id,
        entity_type: "city",
        count: 15,
        sort: "rating",
        order: "desc",
        cuisines: $('#js-cuisineList').val()
    };

    let queryString = $.param(params);
    const url = zomatoUrl + '/search?' + queryString;

    fetch(url, options).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>{
            displayRestaurants(responseJson)
        }) 
        .catch(err => {
            $('#js-error-message').text(`Something Failed ${err.message}`);
        })
}

function displayRestaurants(responseJson) {
    $('#results').empty();
    const budget = $('#js-budget').val();

    let randomNum = Math.floor(Math.random(responseJson.restaurants.length) * 5) + 1;

    for (let i = randomNum; i < responseJson.restaurants.length; i++) {
        let  restaurantsJson = responseJson.restaurants[i].restaurant;
        if (restaurantsJson.average_cost_for_two <= budget && restaurantsJson.user_rating.aggregate_rating > 0) {
        $('#results').append(
        `<li>
            <button class="accordion">
                ${responseJson.restaurants[i].restaurant.name}
                <i class="fas fa-star"></i>
                <span class="rating"><em>${restaurantsJson.user_rating.aggregate_rating}</em></span><br>
                <span class="cuisine">${responseJson.restaurants[i].restaurant.cuisines}</span><i class="fas fa-plus"></i>
                
                <div class="accordionLinks">
                    <a id="webLinkTablet" href='${responseJson.restaurants[i].restaurant.url}' target="_blank">Website</a>
                    <a id="menuLinkTablet" href='${responseJson.restaurants[i].restaurant.menu_url}' target="_blank">Menu</a>
                </div>
            </button>

            <div class="panel hidden">
                <img id="featuredImg" src="${restaurantsJson.featured_image}" alt="feature image for ${restaurantsJson.name}">
                <div class=panelLinks>
                    <a id="webLink" href="${restaurantsJson.url}" target="_blank">Website</a>
                    <a id="menuLink" href="${restaurantsJson.menu_url}" target="_blank">Menu</a>
                </div>
                <div class="restInfo">
                    <p class="address">${restaurantsJson.location.address}</p>
                    <p class="cost"><em>Average Cost for 2:</em> <span>$${restaurantsJson.average_cost_for_two}</span></p>
                </div>
            </div>
        </li>`)
        }
    };

    $('#results').removeClass("hidden");
}

function clickAccordion() {
    $('body').on('click', '.accordion', function(e) {
        const button = $(e.target);
        button.siblings('.panel').toggleClass('hidden');
        
    });
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const userCity = $('#js-city').val();
      const budget = $('#js-budget').val();
      let cuisine = $('#js-cuisineList').val();
      getEntityID(userCity);
    })
}

function main() {
    watchForm();
    clickAccordion();
}

$(main);

