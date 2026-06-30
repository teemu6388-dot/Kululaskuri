// Autojen globaali taulukko (mahdollistaa useamman auton lisäämisen)
let cars = [];

function calculateFuelCost(dist, cons, fuel) {
    if (isNaN(dist) || isNaN(cons) || isNaN(fuel)) return 0;
    // Kaava polttoainekululle: (matka * (kulutus / 100)) * litrahinta
    return (dist * (cons / 100)) * fuel;
}

function handleAddCar() {
    const name = document.getElementById('carName').value.trim();
    const dist = parseFloat(document.getElementById('carDist').value);
    const cons = parseFloat(document.getElementById('carCons').value);
    const fuel = parseFloat(document.getElementById('carFuel').value);

    if (!name || isNaN(dist) || isNaN(cons) || isNaN(fuel)) {
        alert("Täytä kaikki auton tiedot kuluja varten!");
        return;
    }

    const totalCost = calculateFuelCost(dist, cons, fuel);

    cars.push({
        id: 'car_' + Date.now(),
        name: name,
        totalCost: totalCost,
        dist: dist
    });

    // Tyhjennetään kentät
    document.getElementById('carName').value = '';
    document.getElementById('carDist').value = '';
    document.getElementById('carCons').value = '';
    document.getElementById('carFuel').value = '';

    // Päivitetään pääsovelluksen käyttöliittymä
    updateUI();
}