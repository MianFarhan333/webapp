let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let monthlyIncome = parseFloat(localStorage.getItem('monthlyIncome')) || 0;

let editingIndex = -1;

window.onload = () => {
  document.getElementById('income').value = monthlyIncome || "";
  showExpenses();
  showIncomeInfo();
};

function addExpense() {
  let category = document.getElementById('category').value;
  let amount = parseFloat(document.getElementById('amount').value);
  let date = document.getElementById('date').value;

  if (!amount || amount <= 0 || !date || !category) {
    alert("Please enter a valid amount,category and date.");
    return;
  }

  if (editingIndex === -1) {
    expenses.push({ category, amount, date });
  } else {
    expenses[editingIndex] = { category, amount, date };
    editingIndex = -1;
    document.getElementById('add-btn').textContent = "Add Expense";
  }

  saveExpenses();  
  showExpenses();     
  clearForm();        
}

function showExpenses() {
  let table = document.getElementById('expense-table');
  table.innerHTML = ""; 

  let total = 0;

  expenses.forEach((exp, i) => {
    total += exp.amount;

    table.innerHTML += `
      <tr>
        <td>${exp.category}</td>
        <td>${exp.amount.toFixed(2)}</td>
        <td>${exp.date}</td>
        <td>
          <button onclick="editExpense(${i})">Edit</button>
          <button onclick="deleteExpense(${i})">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById('total-amount').textContent = total.toFixed(2);
  document.getElementById('remaining-balance').textContent = (monthlyIncome - total).toFixed(2);
}

function editExpense(index) {
  let exp = expenses[index];
  document.getElementById('category').value = exp.category;
  document.getElementById('amount').value = exp.amount;
  document.getElementById('date').value = exp.date;

  editingIndex = index;
  document.getElementById('add-btn').textContent = "Update Expense";
}

function deleteExpense(index) {
  expenses.splice(index, 1);     
  saveExpenses();                  
  showExpenses();                  
}

function setIncome() {
  let income = parseFloat(document.getElementById('income').value);

  if (!income || income < 0) {
    alert("Please enter valid income");
    return;
  }

  monthlyIncome = income;
  localStorage.setItem('monthlyIncome', monthlyIncome);
  showIncomeInfo();
  showExpenses();  
}

function showIncomeInfo() {
  document.getElementById('monthly-income').textContent = monthlyIncome.toFixed(2);
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function clearForm() {
  document.getElementById('category').value = "";
  document.getElementById('amount').value = "";
  document.getElementById('date').value = "";
}
