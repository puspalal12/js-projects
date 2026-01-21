document.getElementById('addSubjectBtn').addEventListener('click', function () {
    const container = document.getElementById('subjectsContainer');
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
        <input type="text" class="sub-name" placeholder="Subject Name">
        <select class="sub-grade">
            <option value="">-- Grade --</option>
            <option value="a+">A+</option><option value="a">A</option>
            <option value="b+">B+</option><option value="b">B</option>
            <option value="c+">C+</option><option value="c">C</option>
            <option value="d+">D+</option><option value="d">D</option>
            <option value="e">E</option>
        </select>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">X</button>
    `;
    container.appendChild(row);
});

function getLogoData(file) {
    return new Promise((resolve) => {
        if (!file) resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

document.getElementById('generateBtn').addEventListener('click', async function () {
    const schoolName = document.getElementById('schoolName').value;
    const schoolAddress = document.getElementById('schoolAddress').value;
    const name = document.getElementById('fullname').value;
    const sClass = document.getElementById('class').value;
    const roll = document.getElementById('roll').value;
    const logoFile = document.getElementById('schoolLogo').files[0];

    const subInputs = document.querySelectorAll('.sub-name');
    const gradeSelects = document.querySelectorAll('.sub-grade');

    if (!schoolName || !name || !sClass || !roll || !schoolAddress) {
        alert("Please fill in all student and institution details.");
        return;
    }

    const logoDataUrl = await getLogoData(logoFile);

    const gradePoints = { 'a+': 4.0, 'a': 3.6, 'b+': 3.2, 'b': 2.8, 'c+': 2.4, 'c': 2.0, 'd+': 1.6, 'd': 1.2, 'e': 0.0 };
    let totalPoints = 0, hasEGrade = false, tableRows = "";

    subInputs.forEach((input, i) => {
        const grade = gradeSelects[i].value;
        if (grade === 'e') hasEGrade = true;
        totalPoints += gradePoints[grade];
        tableRows += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${input.value}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase; font-weight: bold; ${grade === 'e' ? 'color: #e74c3c;' : ''}">${grade}</td>
            </tr>`;
    });

    const gpa = hasEGrade ? "0.00 (Fail)" : (totalPoints / subInputs.length).toFixed(2);

    document.getElementById('marksheetArea').innerHTML = `
        <div class="marksheet-container" style="padding: 30px; border: 2px solid #15224691; background: #fff;">
            <div class="marksheet-header" style="position: relative; padding: 20px 0; text-align: center; min-height: 120px; display: flex; flex-direction: column; justify-content: center;">
                
                ${logoDataUrl ? `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; opacity: 0.15;">
                        <img src="${logoDataUrl}" style="max-width: 300px; max-height: 180px; width: auto; height: auto;">
                    </div>
                ` : ''}

                <div style="position: relative; z-index: 1;">
                    <h1 style="margin: 0; text-transform: uppercase; font-size: 2.2rem; color: #2c3e50;">${schoolName}</h1>
                    <p style="margin: 0; text-transform: uppercase; font-weight: bold;">${schoolAddress}</p>
                    <p style="margin: 5px 0; color: #636e72;">Academic Marksheet</p>
                    <p style="margin: 0; font-size: 0.8rem;">Session: 2025-2026</p>
                </div>
            </div>
            
            <hr style="width: 100%; margin: 20px 0; border: 0.5px solid #2c3e50;">
            
            <div style="display: flex; width: 100%; justify-content: space-between; text-align: left; margin-bottom: 20px; line-height: 1.6;">
                <div>
                    <p><strong>Student Name:</strong> ${name}</p>
                    <p><strong>Class:</strong> ${sClass}</p>
                </div>
                <div>
                    <p><strong>Roll Number:</strong> ${roll}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <table class="marksheet-table" style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="background: #2c3e50; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Subject</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Grade</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
                <tfoot>
                    <tr style="background: #f1f2f6; font-weight: bold;">
                        <td style="padding: 10px; border: 1px solid #ddd;">CUMULATIVE GPA</td>
                        <td style="padding: 10px; border: 1px solid #ddd; color: ${hasEGrade ? '#e74c3c' : '#0984e3'};">${gpa}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="display: flex; width: 100%; justify-content: space-between; margin-top: 80px; font-weight: bold;">
                <div style="border-top: 1px solid #000; width: 150px; padding-top: 5px; text-align: center;">Principal</div>
                <div style="border-top: 1px solid #000; width: 150px; padding-top: 5px; text-align: center;">Issued By</div>
            </div>
        </div>
        <button class="print-btn" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Print Marksheet / Save PDF</button>
    `;
});