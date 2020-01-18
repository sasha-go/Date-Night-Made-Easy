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
        count: 15,
        sort: "rating",
        order: "desc",
        cuisines: $('#js-cuisineList').val()
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

// Figure out mathrandom
// figure out cuisine 

function displayRestaurants(responseJson) {
    $('#results').empty();
    const budget = $('#js-budget').val();
    let randomNum = Math.floor(Math.random(responseJson.restaurants.length) * 5) + 1;
    console.log(randomNum);

    for (let i = randomNum; i < responseJson.restaurants.length; i++) {
        let  restaurantsJson = responseJson.restaurants[i].restaurant;
        if (restaurantsJson.average_cost_for_two <= budget && restaurantsJson.user_rating.aggregate_rating > 0) {
        $('#results').append(`<li>
        <img src="${restaurantsJson.featured_image}" id="featuredImg" alt="feature image for ${restaurantsJson.name}">
        <a href='${restaurantsJson.url}' target="_blank">${restaurantsJson.name}</a> 
        | <a href='${restaurantsJson.menu_url}' target="_blank">Menu</a>
        <p>${restaurantsJson.location.address}</p>
        <p>${restaurantsJson.location.locality_verbose}</p>
        <p>Average Cost for 2 $${restaurantsJson.average_cost_for_two}</p>
        <p>${restaurantsJson.user_rating.aggregate_rating}</p>
        <p>${restaurantsJson.cuisines}</p>
        </li>`)
        }
    };
    $('#results').removeClass("hidden");
}


function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const userCity = $('#js-city').val();
      const budget = $('#js-budget').val();
      let cuisine = $('#js-cuisineList').val();
      console.log(cuisine);
      console.log(userCity)
      getEntityID(userCity);
    })
  }

  $(watchForm);



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