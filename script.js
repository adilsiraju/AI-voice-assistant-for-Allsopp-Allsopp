document.addEventListener('DOMContentLoaded', function() {
    fetch('property_listings.json')
        .then(response => response.json())
        .then(data => {
            displayProperties(data.properties);
        })
        .catch(error => {
            console.error('Error loading property listings:', error);
            document.getElementById('properties-container').innerHTML = '<p>Error loading data.</p>';
        });
});

function displayProperties(properties) {
    const container = document.getElementById('properties-container');
    container.innerHTML = '';

    properties.forEach(property => {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'property-card';

        propertyDiv.innerHTML = `
            <h2>${property.title}</h2>
            <p><strong>ID:</strong> ${property.id}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Price:</strong> ${property.price}</p>
            <p><strong>Payment Plan:</strong> ${property.paymentPlan}</p>
            <p><strong>Handover Date:</strong> ${property.handoverDate}</p>
            <p><strong>Description:</strong> ${property.description}</p>
            <p><strong>Amenities:</strong> ${property.amenities.join(', ')}</p>
            <p><strong>Places Nearby:</strong> ${property.placesNearby.join(' | ')}</p>
            <p><strong>Reference:</strong> ${property.reference}</p>
            <p><strong>Permit Number:</strong> ${property.permitNumber}</p>
            <p><a href="${property.url}" target="_blank">View on Website</a></p>
        `;

        container.appendChild(propertyDiv);
    });
}