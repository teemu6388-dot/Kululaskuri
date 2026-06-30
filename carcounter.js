// Autojen globaali taulukko (luodaan vain jos sitä ei ole vielä olemassa)
if (typeof cars === 'undefined') {
    var cars = [];
}

function handleAddCar() {
    const name = document.getElementById('carName').value.trim();
    const dist = parseFloat(document.getElementById('carDist').value);
    const cons = parseFloat(document.getElementById('carCons').value);
    const fuel = parseFloat(document.getElementById('carFuel').value);
    const payers = parseInt(document.getElementById('carPayers').value);

    if (!name || isNaN(dist) || isNaN(cons) || isNaN(fuel) || isNaN(payers)) {
        alert("Täytä kaikki auton tiedot ja maksajamäärä kuluja varten!");
        return;
    }

    const totalCost = (dist * (cons / 100)) * fuel;

    cars.push({
        id: 'car_' + Date.now(),
        name: name,
        totalCost: totalCost,
        dist: dist,
        payers: payers
    });

    // Tyhjennetään kentät
    document.getElementById('carName').value = '';
    document.getElementById('carDist').value = '';
    document.getElementById('carCons').value = '';
    document.getElementById('carFuel').value = '';
    document.getElementById('carPayers').value = '1';

    // Tallennetaan ja päivitetään
    if (typeof saveAllData === 'function') saveAllData();
    if (typeof updateUI === 'function') updateUI();
}
