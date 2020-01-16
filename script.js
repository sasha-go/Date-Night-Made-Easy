//"use strict";

// Zomato API Key
const zomatoApiKey = "bdf061b7ff13160c0b5ed3be06170ae7";

// Zomato API
const zomatoUrl = "https://developers.zomato.com/api/v2.1";


// Function to generate city id getCity()
function getCity(userCity) {
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
                responseJson => getRestaurants(userCity, responseJson.location_suggestions[0].city_id)
                console.log(responseJson.location_suggestions[0].city_id);
                console.log(responseJson);
                //displayResults(responseJson, budget)
            })

            .catch(err => {
                $('#js-error-message').text(`Uh oh, something broke: ${err.message}`);
                console.log(err);
    });    
}

// Generate restaurants based on the location the user entered using the city_id generated from getCity()
function getRestaurants(userCity, city_id) {
    const options = {
        headers: new Headers({
            'user-key': zomatoApiKey
        })
    };

    const params = {
        entity_id: city_id,
        entity_type: "city",
        count: 5
    };

    let queryString = $.param(params);
    const url = zomatoUrl + '/search?' + queryString;

    console.log(`Finding restaurants for ${getCity(userCity)}`)

    fetch(url, options).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJson => displayRestaurants(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something Failed ${err.message}`);
        })
}


function displayRestaurants() {

}


function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const userCity = $('#js-city').val();
      // const budget = $('#js-max-results').val();
      console.log(userCity)
      getCity(userCity);
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