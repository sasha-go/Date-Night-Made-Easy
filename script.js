//"use strict";

// Zomato API Key
const zomatoApiKey = "bdf061b7ff13160c0b5ed3be06170ae7";

// Zomato API
const zomatoUrl = "https://developers.zomato.com/api/v2.1";


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

    console.log(`Finding location id for ${userCity}`);

    fetch(url, options)
        .then(response => {
        if (response.ok) {
            return response.json();
            }
            throw new Error(response.statusText);
            }) 
            .then(responseJson => {
                getRestaurants(responseJson.location_suggestions[0].entity_id)
                console.log(responseJson);
                console.log(responseJson.location_suggestions[0].entity_id);
            })
            .catch(err => {
                $('#js-error-message').text(`Uh oh, something broke: ${err.message}`);
                console.log(err);
    });    
}

// Generate restaurants based on the location the user entered using the entity_id generated from getEntityID()
// https://developers.zomato.com/api/v2.1/search?entity_id=305&entity_type=city

function getRestaurants(entity_id) {
    const options = {
        headers: new Headers({
            'user-key': zomatoApiKey
        })
    };

    const params = {
        entity_id: entity_id,
        entity_type: "city",
    };

    let queryString = $.param(params);
    const url = zomatoUrl + '/search?' + queryString;
    console.log(queryString);


    fetch(url, options).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>{
            displayRestaurants(responseJson)
            console.log(responseJson);
        }) 
        // .then(responseJson => {
        //     console.log(responseJson);
        //    resp displayRestaurants(responseJson))
        //})    
        .catch(err => {
            $('#js-error-message').text(`Something Failed ${err.message}`);
        })
}


// Display restaurants using response from restaurants for a user's given city 
// !!! Need to create field for budget and add it to conditional statement below
// Need to figure out how to pull more than the 20 restaurants shown 
function displayRestaurants(responseJson) {
    console.log(responseJson);
    $('#results').empty();
    const budget = $('#js-budget').val();
    for (let i = 0; i < responseJson.restaurants.length; i++) {
        if (responseJson.restaurants[i].restaurant.average_cost_for_two <= budget) {
        $('#results').append(
        `<li>
            <button class="accordion">
                ${responseJson.restaurants[i].restaurant.name}<br><span class="cuisine">${responseJson.restaurants[i].restaurant.cuisines}</span><i class="fas fa-plus"></i><i class="fas fa-minus"></i>
                <div class=panelLinksTablet>
                    <a id="webLink" href='${responseJson.restaurants[i].restaurant.url}' target="_blank">Website</a>
                    <a id="menuLink" href='${responseJson.restaurants[i].restaurant.menu_url}' target="_blank">Menu</a>
                </div>
            </button>

            <div class="panel hidden">
                <img id="featuredImg" src="${responseJson.restaurants[i].restaurant.featured_image}" alt="featured image for restaurant result">
                <div class=panelLinks>
                    <a id="webLink" href='${responseJson.restaurants[i].restaurant.url}' target="_blank">Website</a>
                    <a id="menuLink" href='${responseJson.restaurants[i].restaurant.menu_url}' target="_blank">Menu</a>
                </div>
                <p>Average Cost for 2: $${responseJson.restaurants[i].restaurant.average_cost_for_two}</p>
            </div>
        </li>`)
        }
    };

    $('#results').removeClass("hidden");
}

function clickAccordion() {
    $('body').on('click', '.accordion', function(e) {
        //console.log(e.target);
        const button = $(e.target);
        button.siblings('.panel').toggleClass('hidden');
    });
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const userCity = $('#js-city').val();
      const budget = $('#js-budget').val();
      console.log(userCity)
      getEntityID(userCity);
    })
  }

  function main() {
      watchForm();
      clickAccordion();
  }

  $(main);



// Function to generate restaurants 
// using city id variable


// Display Results 
// filter by "average_cost_for_two" <= budget
// return featured image 
// restaurant name (include link with name)
// address
// phone number
// average_cost_for_two
// menu url 
// aggregate rating 



// Watch form event listener 