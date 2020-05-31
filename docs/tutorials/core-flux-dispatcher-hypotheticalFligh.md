# Hypothetical flight

For example, consider this hypothetical flight destination form, which selects a default city when a country is selected:

	// Keeps track of which country is selected
	var CountryStore = {country: null};
	
	// Keeps track of which city is selected
	var CityStore = {city: null};
	
	// Keeps track of the base flight price of the selected city
	var FlightPriceStore = {price: null};

When a user changes the selected city, we dispatch the payload:

	dispatcher.dispatch('/flight', {
	  actionType: 'city-update',
	  selectedCity: 'Shiraz'
	});

This payload is digested by CityStore:

	dispatcher.register('/flight', function(payload) {
	  if (payload.actionType === 'city-update') {
		CityStore.city = payload.selectedCity;
	  }
	});

When the user selects a country, we dispatch the payload:

	dispatcher.dispatch('/flight', {
	  actionType: 'country-update',
	  selectedCountry: 'Iran'
	});

This payload is digested by both stores:

	CountryStore.dispatchToken = dispatcher.register('/flight', function(payload) {
		if (payload.actionType === 'country-update') {
			CountryStore.country = payload.selectedCountry;
		}
	});

When the callback to update CountryStore is registered, we save a reference to the returned token. Using this token with waitFor(), we can guarantee that CountryStore is updated before the callback that updates CityStore needs to query its data.

	CityStore.dispatchToken = dispatcher.register('/flight',, function(payload) {
	  if (payload.actionType === 'country-update') {
		// `CountryStore.country` may not be updated.
		flightDispatcher.waitFor([CountryStore.dispatchToken]);
		// `CountryStore.country` is now guaranteed to be updated.
	
		// Select the default city for the new country
		CityStore.city = getDefaultCityForCountry(CountryStore.country);
	  }
	});

The usage of waitFor() can be chained, for example:

	FlightPriceStore.dispatchToken = dispatcher.register('/flight', function(payload) {
		switch (payload.actionType) {
		case 'country-update':
		case 'city-update':
			flightDispatcher.waitFor([CityStore.dispatchToken]);
			FlightPriceStore.price = getFlightPriceStore(CountryStore.country, CityStore.city);
			break;
		}
	});

The country-update payload will be guaranteed to invoke the stores' registered callbacks in order: CountryStore, CityStore, then FlightPriceStore.