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
  let grouped = {};

  expenses.forEach((exp, i) => {
    if (!grouped[exp.category]) {
      grouped[exp.category] = { amount: 0, latestDate: exp.date };
    }

    grouped[exp.category].amount += exp.amount;

    if (new Date(exp.date) > new Date(grouped[exp.category].latestDate)) {
      grouped[exp.category].latestDate = exp.date;
    }

    total += exp.amount;
  });

  Object.keys(grouped).forEach((cat) => {
    table.innerHTML += `
      <tr>
        <td>${cat}</td>
        <td>${grouped[cat].amount.toFixed(2)}</td>
        <td>${grouped[cat].latestDate}</td>
        <td>
          <!-- Optionally: remove or customize buttons -->
          <button onclick="deleteCategory('${cat}')">Delete</button>
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

function deleteCategory(category) {
  expenses = expenses.filter(exp => exp.category !== category);
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
