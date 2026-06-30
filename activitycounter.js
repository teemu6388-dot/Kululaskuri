// Aktiviteettien globaali taulukko
let activities = [];

function calculateActivityCost(pricePerPerson, count, payers) {
    if (isNaN(pricePerPerson) || count <= 0 || payers <= 0) return 0;
    
    // UUSI LOGIIKKA: Hinta per pää * osallistujamäärä = Aktiviteetin todellinen kokonaishinta
    const totalCost = pricePerPerson * count;
    
    return totalCost;
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

    // Lasketaan aktiviteetin yhteishinta
    const calculatedTotal = calculateActivityCost(pricePerPerson, count, payers);

    activities.push({
        id: 'act_' + Date.now(),
        name: name,
        totalCost: calculatedTotal, // Tämä kokonaissumma jaetaan tasan ruksattujen kesken
        basePrice: pricePerPerson,
        count: count,
        payers: payers
    });

    // Tyhjennetään kentät
    document.getElementById('actName').value = '';
    document.getElementById('actPrice').value = '';
    document.getElementById('actCount').value = '1';
    document.getElementById('actPayers').value = '1';

    // Päivitetään ja tallennetaan
    saveAllData();
    updateUI();
}