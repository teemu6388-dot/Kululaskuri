// Aktiviteettien globaali taulukko (luodaan vain jos sitä ei ole vielä olemassa)
if (typeof activities === 'undefined') {
    var activities = [];
}

function calculateActivityCost(pricePerPerson, count, payers) {
    if (isNaN(pricePerPerson) || count <= 0 || payers <= 0) return 0;
    return pricePerPerson * count;
}

function handleAddActivity() {
    const name = document.getElementById('actName').value.trim();
    const pricePerPerson = parseFloat(document.getElementById('actPrice').value);
    const count = parseInt(document.getElementById('actCount').value);
    const payers = parseInt(document.getElementById('actPayers').value);

    if (!name || isNaN(pricePerPerson)) {
        alert("Täytä aktiviteetin nimi ja hinta per pää!");
        return;
    }

    const calculatedTotal = calculateActivityCost(pricePerPerson, count, payers);

    activities.push({
        id: 'act_' + Date.now(),
        name: name,
        totalCost: calculatedTotal,
        basePrice: pricePerPerson,
        count: count,
        payers: payers
    });

    // Tyhjennetään kentät
    document.getElementById('actName').value = '';
    document.getElementById('actPrice').value = '';
    document.getElementById('actCount').value = '1';
    document.getElementById('actPayers').value = '1';

    // Tallennetaan ja päivitetään (nämä funktiot löytyvät app.js-tiedostosta)
    if (typeof saveAllData === 'function') saveAllData();
    if (typeof updateUI === 'function') updateUI();
}
