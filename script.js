let asteroids = [];
let filteredAsteroids = [];
let sortAscending = true;
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetchAsteroids();
    document.getElementById('sortButton').addEventListener('click', toggleSort);
    document.getElementById('filterInput').addEventListener('input', filterAsteroids);
});

function fetchAsteroids() {
    fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY')
        .then(response => response.json())
        .then(data => {
            asteroids = data.near_earth_objects;
            filteredAsteroids = asteroids;
            displayAsteroids();
            displayPagination();
        })
        .catch(error => console.error('Error fetching asteroids:', error));
}

function displayAsteroids() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedAsteroids = filteredAsteroids.slice(start, end);

    paginatedAsteroids.forEach(asteroid => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asteroid.name}</td>
            <td>${asteroid.close_approach_data[0].close_approach_date}</td>
            <td>${asteroid.absolute_magnitude_h}</td>
        `;
        tbody.appendChild(row);
    });
}

function toggleSort() {
    sortAscending = !sortAscending;
    filteredAsteroids.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return sortAscending ? -1 : 1;
        }
        if (nameA > nameB) {
            return sortAscending ? 1 : -1;
        }
        return 0;
    });
    displayAsteroids();
    displayPagination();
    document.getElementById('sortButton').textContent = sortAscending ? 'Sort Ascending' : 'Sort Descending';
}

function filterAsteroids(event) {
    const filterText = event.target.value.toUpperCase();
    filteredAsteroids = asteroids.filter(asteroid => asteroid.name.toUpperCase().includes(filterText));
    currentPage = 1;
    displayAsteroids();
    displayPagination();
}

function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredAsteroids.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = 'pagination-button';
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayAsteroids();
        });
        pagination.appendChild(button);
    }
}

