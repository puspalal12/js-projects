const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const progressBar = document.getElementById('progress-bar-fill');
const ratioText = document.getElementById('ratio-text');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a description and amount');
  } else {
    const transaction = {
      id: Math.floor(Math.random() * 100000000),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}


function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}Rs. ${Math.abs(transaction.amount).toLocaleString('en-NP')}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}


function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `Rs. ${Number(total).toLocaleString('en-NP')}`;
  money_plus.innerText = `+Rs. ${Number(income).toLocaleString('en-NP')}`;
  money_minus.innerText = `-Rs. ${Number(expense).toLocaleString('en-NP')}`;

  updateVisualizer(income, expense);
}


function updateVisualizer(income, expense) {
  if (income > 0) {
    let percentage = (expense / income) * 100;
    if (percentage > 100) percentage = 100; 

    progressBar.style.width = `${percentage}%`;
    ratioText.innerText = `${Math.round(percentage)}% of income spent`;

   
    if (percentage > 80) {
      progressBar.style.backgroundColor = '#e74c3c'; 
    } else if (percentage > 50) {
      progressBar.style.backgroundColor = '#f1c40f'; 
    } else {
      progressBar.style.backgroundColor = '#2ecc71'; 
    }
  } else {
    progressBar.style.width = '0%';
    ratioText.innerText = '0% of income spent';
  }
}


function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}


function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener('submit', addTransaction);