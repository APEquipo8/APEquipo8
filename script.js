document.getElementById('project-form').addEventListener('submit', addActivity);

let totalCost = 0;
let costHistory = [];
let schedule = {};

function addActivity(e) {
    e.preventDefault();

    const concepto = document.getElementById('concepto').value;
    const tiempo = parseFloat(document.getElementById('tiempo').value);
    const recurso = parseFloat(document.getElementById('recurso').value);
    const responsable = document.getElementById('responsable').value;
    const avance = parseFloat(document.getElementById('avance').value);
    const evidencia = document.getElementById('evidencia').value;

    const table = document.getElementById('activity-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${concepto}</td>
        <td>${tiempo}</td>
        <td>${recurso}</td>
        <td>${responsable}</td>
        <td>${avance}</td>
        <td>${evidencia}</td>
    `;

    totalCost += recurso;
    document.getElementById('total-cost').textContent = totalCost;

    costHistory.push(totalCost);
    updateCostHistory();

    if (!schedule[responsable]) {
        schedule[responsable] = [];
    }
    schedule[responsable].push(concepto);
    updateSchedule();

    document.getElementById('project-form').reset();
}

function updateCostHistory() {
    const historyList = document.getElementById('cost-history');
    historyList.innerHTML = '';

    costHistory.forEach((cost, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Costo total después de la actividad ${index + 1}: $${cost}`;
        historyList.appendChild(listItem);
    });
}

function updateSchedule() {
    const scheduleTable = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';

    for (const [responsable, actividades] of Object.entries(schedule)) {
        const newRow = scheduleTable.insertRow();
        newRow.innerHTML = `
            <td>${responsable}</td>
            <td>${actividades.join(', ')}</td>
        `;
    }
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    tablinks = document.getElementsByClassName('tablink');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

// Open the first tab by default
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tablink').click();
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const img = new Image();
    img.src = 'img/imagen.png'; // Reemplaza con la ruta a tu imagen PNG

    img.onload = function () {
        doc.addImage(img, 'PNG', 10, 10, 190, 30); // Ajusta las coordenadas y tamaño según tu imagen

        doc.setFontSize(12);
        doc.text('Gestión de Proyectos', 10, 50);

        const totalCost = document.getElementById('total-cost').textContent;
        doc.text(`Total Costos: $${totalCost}`, 10, 60);

        const activityTable = document.getElementById('activity-table');
        const rows = activityTable.getElementsByTagName('tr');
        const data = [];

        for (let i = 1; i < rows.length; i++) { // Saltamos la primera fila de encabezado
            const cols = rows[i].getElementsByTagName('td');
            const rowData = [];
            for (let j = 0; j < cols.length; j++) {
                rowData.push(cols[j].innerText);
            }
            data.push(rowData);
        }

        doc.autoTable({
            head: [['Actividad', 'Tiempo (horas)', 'Recurso ($)', 'Responsable', 'Avance (%)', 'Evidencia']],
            body: data,
            startY: 70,
        });

        doc.save('gestion_proyectos.pdf');
    };
}
