// Osallistujien tietokanta
let participants = [];

// Haetaan kaikki tiedot muistista heti kun sivu latautuu
window.onload = function() {
    if (localStorage.getItem('tripNotes')) {
        document.getElementById('notes').value = localStorage.getItem('tripNotes');
    }
    if (localStorage.getItem('tripParticipants')) {
        participants = JSON.parse(localStorage.getItem('tripParticipants'));
    }
    if (localStorage.getItem('tripActivities')) {
        activities = JSON.parse(localStorage.getItem('tripActivities'));
    }
    if (localStorage.getItem('tripCars')) {
        cars = JSON.parse(localStorage.getItem('tripCars'));
    }
    updateUI();
};

function saveAllData() {
    localStorage.setItem('tripParticipants', JSON.stringify(participants));
    localStorage.setItem('tripActivities', JSON.stringify(activities));
    localStorage.setItem('tripCars', JSON.stringify(cars));
}

function saveNotes() {
    localStorage.setItem('tripNotes', document.getElementById('notes').value);
}

function addParticipant() {
    const nameInput = document.getElementById('partName');
    const name = nameInput.value.trim();
    if (!name) return alert("Anna nimi!");
    
    participants.push({
        id: 'part_' + Date.now(),
        name: name,
        selectedActivities: [],
        selectedCars: [],
        isFreeFromPayments: false
    });
    
    nameInput.value = '';
    saveAllData();
    updateUI();
}

function deleteItem(type, id) {
    if (type === 'part') {
        participants = participants.filter(p => p.id !== id);
    } else if (type === 'act') {
        activities = activities.filter(a => a.id !== id);
        participants.forEach(p => p.selectedActivities = p.selectedActivities.filter(aid => aid !== id));
    } else if (type === 'car') {
        cars = cars.filter(c => c.id !== id);
        participants.forEach(p => p.selectedCars = p.selectedCars.filter(cid => cid !== id));
    }
    saveAllData();
    updateUI();
}

function toggleSelection(partId, type, itemId) {
    const part = participants.find(p => p.id === partId);
    if (!part) return;

    if (type === 'act') {
        if (part.selectedActivities.includes(itemId)) {
            part.selectedActivities = part.selectedActivities.filter(id => id !== itemId);
        } else {
            part.selectedActivities.push(itemId);
        }
    } else if (type === 'car') {
        if (part.selectedCars.includes(itemId)) {
            part.selectedCars = part.selectedCars.filter(id => id !== itemId);
        } else {
            part.selectedCars.push(itemId);
        }
    }
    saveAllData();
    updateUI();
}

function toggleFreeStatus(partId) {
    const part = participants.find(p => p.id === partId);
    if (!part) return;
    
    part.isFreeFromPayments = !part.isFreeFromPayments;
    saveAllData();
    updateUI();
}

// UPDATE-FUNKTIO (Näyttää nyt sekä osallistujat että maksajat erikseen)
function updateUI() {
    // 1. Syötetyt aktiviteetit listaukseen
    const actListDiv = document.getElementById('activitiesList');
    actListDiv.innerHTML = activities.map(a => `
        <div class="list-item">
            <strong>${a.name}</strong><br>
            Yhteensä: ${a.totalCost.toFixed(2)} € <span style="font-size:11px; color:#64748b;">(${a.basePrice.toFixed(2)}€/pää, ${a.count} kpl)</span>
            <button class="delete-btn" onclick="deleteItem('act', '${a.id}')">X</button>
        </div>
    `).join('');

    // 2. Syötetyt autot listaukseen
    const carListDiv = document.getElementById('carsList');
    carListDiv.innerHTML = cars.map(c => `
        <div class="list-item">
            <strong>${c.name}</strong> (${c.dist} km)<br>
            Polttoainekulu: ${c.totalCost.toFixed(2)} €
            <button class="delete-btn" onclick="deleteItem('car', '${c.id}')">X</button>
        </div>
    `).join('');

    // 3. Lasketaan erikseen kokonaisosallistujat ja maksavat osallistujat
    const actTotalCounts = {}; // Kaikki ruksanneet
    const actPayerCounts = {}; // Vain maksavat ruksanneet
    const carTotalCounts = {}; 
    const carPayerCounts = {}; 

    activities.forEach(a => { actTotalCounts[a.id] = 0; actPayerCounts[a.id] = 0; });
    cars.forEach(c => { carTotalCounts[c.id] = 0; carPayerCounts[c.id] = 0; });

    participants.forEach(p => {
        p.selectedActivities.forEach(aid => {
            if (actTotalCounts[aid] !== undefined) actTotalCounts[aid]++;
            if (actPayerCounts[aid] !== undefined && !p.isFreeFromPayments) actPayerCounts[aid]++;
        });
        p.selectedCars.forEach(cid => {
            if (carTotalCounts[cid] !== undefined) carTotalCounts[cid]++;
            if (carPayerCounts[cid] !== undefined && !p.isFreeFromPayments) carPayerCounts[cid]++;
        });
    });

    // 4. Tulostetaan osallistujakortit rasteilla
    const partListDiv = document.getElementById('participantsList');
    if (participants.length === 0) {
        partListDiv.innerHTML = '<p class="instruction">Ei vielä osallistujia. Lisää henkilöitä kohdasta 1.</p>';
        return;
    }

    let html = '';
    participants.forEach(p => {
        let totalToPay = 0;

        // Aktiviteettien valintaruudut
        let actCheckboxes = activities.map(a => {
            const isChecked = p.selectedActivities.includes(a.id) ? 'checked' : '';
            const totalIn = actTotalCounts[a.id] || 0;
            const payersIn = actPayerCounts[a.id] || 0;
            
            const costPerPerson = payersIn > 0 ? (a.totalCost / payersIn) : 0;
            if (isChecked && !p.isFreeFromPayments) totalToPay += costPerPerson;

            return `
                <label class="checkbox-label">
                    <input type="checkbox" ${isChecked} onchange="toggleSelection('${p.id}', 'act', '${a.id}')">
                    ${a.name} (+${costPerPerson.toFixed(2)}€)
                    <span style="font-size:11px; color:#94a3b8; margin-left:2px;">[Mukana: ${totalIn} hlö, joista ${payersIn} maksajaa]</span>
                </label>
            `;
        }).join('');

        // Autojen valintaruudut
        let carCheckboxes = cars.map(c => {
            const isChecked = p.selectedCars.includes(c.id) ? 'checked' : '';
            const totalIn = carTotalCounts[c.id] || 0;
            const payersIn = carPayerCounts[c.id] || 0;
            
            const costPerPerson = payersIn > 0 ? (c.totalCost / payersIn) : 0;
            if (isChecked && !p.isFreeFromPayments) totalToPay += costPerPerson;

            return `
                <label class="checkbox-label">
                    <input type="checkbox" ${isChecked} onchange="toggleSelection('${p.id}', 'car', '${c.id}')">
                    🚌 ${c.name} (+${costPerPerson.toFixed(2)}€)
                    <span style="font-size:11px; color:#94a3b8; margin-left:2px;">[Kyydissä: ${totalIn} hlö, joista ${payersIn} maksajaa]</span>
                </label>
            `;
        }).join('');

        const isFreeChecked = p.isFreeFromPayments ? 'checked' : '';
        const cardStyle = p.isFreeFromPayments ? 'background: #f1f5f9; opacity: 0.85;' : '';

        html += `
            <div class="participant-card" style="${cardStyle}">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <strong>👤 ${p.name}</strong>
                        ${p.isFreeFromPayments ? '<span style="color:#ef4444; font-size:12px; font-weight:bold; margin-left:10px;">(Vapaamatkustaja 🎁)</span>' : ''}
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:15px;">
                        <label class="checkbox-label" style="font-size:12px; color:#475569; font-weight:600;">
                            <input type="checkbox" ${isFreeChecked} onchange="toggleFreeStatus('${p.id}')">
                            Vapauta maksuista
                        </label>
                        <button class="btn-danger" style="width:auto; margin:0; padding:4px 10px; font-size:12px;" onclick="deleteItem('part', '${p.id}')">Poista</button>
                    </div>
                </div>
                
                <div style="margin-top:10px;">
                    <span style="font-size:12px; font-weight:bold; color:#475569;">Aktiviteetit:</span>
                    <div class="checkbox-group">${actCheckboxes || '<span class="instruction">Ei aktiviteetteja</span>'}</div>
                </div>

                <div style="margin-top:10px;">
                    <span style="font-size:12px; font-weight:bold; color:#475569;">Autokyydit:</span>
                    <div class="checkbox-group">${carCheckboxes || '<span class="instruction">Ei autoja</span>'}</div>
                </div>

                <div class="summary-box" style="${p.isFreeFromPayments ? 'border-color:#cbd5e1; background:#f8fafc;' : ''}">
                    Henkilön <strong>${p.name}</strong> maksuosuus: <span class="total-price" style="${p.isFreeFromPayments ? 'color:#64748b;' : ''}">${totalToPay.toFixed(2)} €</span>
                </div>
            </div>
        `;
    });

    partListDiv.innerHTML = html;
}