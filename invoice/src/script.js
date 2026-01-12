let invoiceData = JSON.parse(localStorage.getItem('invoiceData')) || {
    company: { name: '', addr: '', contact: '', logo: '' },
    customer: { name: '', addr: '', contact: '' },
    tax: 0,
    discount: 0,
    items: []
};

window.onload = () => {
   
    document.getElementById('compName').value = invoiceData.company.name;
    document.getElementById('compAddr').value = invoiceData.company.addr;
    document.getElementById('compContact').value = invoiceData.company.contact;
    document.getElementById('custName').value = invoiceData.customer.name;
    document.getElementById('custAddr').value = invoiceData.customer.addr;
    document.getElementById('custContact').value = invoiceData.customer.contact;
    document.getElementById('taxInput').value = invoiceData.tax || 0;
    document.getElementById('discountInput').value = invoiceData.discount || 0;
    
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
    document.getElementById('logoInput').addEventListener('change', handleLogoUpload);

    renderAll();
};

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            invoiceData.company.logo = event.target.result;
            renderAll();
        };
        reader.readAsDataURL(file);
    }
}

function updateDetails() {
    invoiceData.company = {
        name: document.getElementById('compName').value,
        addr: document.getElementById('compAddr').value,
        contact: document.getElementById('compContact').value,
        logo: invoiceData.company.logo
    };
    invoiceData.customer = {
        name: document.getElementById('custName').value,
        addr: document.getElementById('custAddr').value,
        contact: document.getElementById('custContact').value
    };
    invoiceData.tax = parseFloat(document.getElementById('taxInput').value) || 0;
    invoiceData.discount = parseFloat(document.getElementById('discountInput').value) || 0;
    
    renderAll();
}

function addItem() {
    const desc = document.getElementById('itemDesc').value;
    const qty = parseFloat(document.getElementById('itemQty').value);
    const rate = parseFloat(document.getElementById('itemRate').value);

    if(!desc || qty <= 0) return alert("Enter valid item details");

    invoiceData.items.push({ desc, qty, rate });
    document.getElementById('itemDesc').value = '';
    renderAll();
}

function removeItem(index) {
    invoiceData.items.splice(index, 1);
    renderAll();
}

function renderAll() {
    
    const logoContainer = document.getElementById('logoContainer');
    if (invoiceData.company.logo) {
        document.getElementById('displayLogo').src = invoiceData.company.logo;
        logoContainer.classList.remove('hidden');
    }

    
    document.getElementById('displayCompName').innerText = invoiceData.company.name || "Your Company";
    document.getElementById('displayCompAddr').innerText = invoiceData.company.addr || "Address";
    document.getElementById('displayCompContact').innerText = invoiceData.company.contact || "Contact";
    document.getElementById('displayCustName').innerText = invoiceData.customer.name || "Customer Name";
    document.getElementById('displayCustAddr').innerText = invoiceData.customer.addr || "Address";
    document.getElementById('displayCustContact').innerText = invoiceData.customer.contact || "Contact";

    
    const tbody = document.getElementById('invoiceTableBody');
    tbody.innerHTML = '';
    let subtotal = 0;

    invoiceData.items.forEach((item, index) => {
        const lineTotal = item.qty * item.rate;
        subtotal += lineTotal;
        tbody.innerHTML += `
            <tr class="border-b border-gray-100">
                <td class="py-4 px-4 text-sm text-gray-700">${item.desc}</td>
                <td class="py-4 px-4 text-center text-sm">${item.qty}</td>
                <td class="py-4 px-4 text-right text-sm font-mono">NRP.${item.rate.toFixed(2)}</td>
                <td class="py-4 px-4 text-right text-sm font-bold">NRP.${lineTotal.toFixed(2)}</td>
                <td class="py-4 px-4 text-center print:hidden">
                    <button onclick="removeItem(${index})" class="text-red-400 font-bold">✕</button>
                </td>
            </tr>
        `;
    });

    
    const discAmt = subtotal * (invoiceData.discount / 100);
    const taxableAmnt = subtotal - discAmt;
    const taxAmnt = taxableAmnt * (invoiceData.tax / 100);
    const grandTotal = taxableAmnt + taxAmnt;

   
    document.getElementById('subtotal').innerText = `NRP.${subtotal.toFixed(2)}`;
    document.getElementById('discountRateDisplay').innerText = invoiceData.discount;
    document.getElementById('discountAmount').innerText = `-NRP.${discAmt.toFixed(2)}`;
    document.getElementById('taxRateDisplay').innerText = invoiceData.tax;
    document.getElementById('taxAmount').innerText = `NRP.${taxAmnt.toFixed(2)}`;
    document.getElementById('grandTotal').innerText = `NRP.${grandTotal.toFixed(2)}`;

    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
}

function downloadPDF() {
    const element = document.getElementById('invoice-preview');
    

    if(!element) return;

    const opt = {
        margin:       0.5,
        filename:     `Invoice_${invoiceData.customer.name || 'Export'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true,
            letterRendering: true
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };


    html2pdf().set(opt).from(element).save().catch(err => console.log(err));
}

function clearAll() {
    if(confirm("Wipe all data?")) {
        localStorage.removeItem('invoiceData');
        location.reload();
    }
}