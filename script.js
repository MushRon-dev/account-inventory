`let accountCount = 1;

// Load saved data from localStorage
window.onload = () => {
  const savedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
  if (savedAccounts.length > 0) {
    savedAccounts.forEach(account => {
      addRow(account.bucks, account.ageUps, account.accountNumber, account.status);
    });
    accountCount = savedAccounts.length + 1;
  } else {
    addRow();
  }
};

// Add a new row with a unique account number and optional status
function addRow(bucks = 0, ageUps = 0, accountNumber = `ACC-${accountCount++}`, status = 'available') {
  const tableBody = document.getElementById("account-table-body");
  const row = document.createElement("tr");
  row.classList.add(status); // Apply the status color class

  row.innerHTML = `
    <td>${accountNumber}</td>
    <td>
      <input type="text" value="${formatNumber(bucks)}"
        oninput="liveFormat(this)" onblur="formatDisplay(this)" onfocus="removeCommas(this)">
    </td>
    <td>
      <input type="number" min="0" value="${ageUps}" oninput="saveAndCalculate()">
    </td>
    <td class="row-total">₱0</td>
    <td>
      <button onclick="setStatus(this, 'available')">✅</button>
      <button onclick="setStatus(this, 'farming')">⏳</button>
      <button onclick="setStatus(this, 'sold')">❌</button>
    </td>
  `;

  tableBody.appendChild(row);
  saveAndCalculate();
}

// Set status and update row style
function setStatus(button, newStatus) {
  const row = button.closest('tr');
  row.classList.remove('available', 'farming', 'sold');
  row.classList.add(newStatus);
  saveAndCalculate(); // Save updated status to localStorage
}

// Format number with commas
function formatNumber(value) {
  return Number(value).toLocaleString('en-US');
}

// Format value while typing
function liveFormat(input) {
  let raw = input.value.replace(/,/g, '').replace(/[^\d]/g, '');
  if (raw === '') return;
  input.value = formatNumber(raw);
  saveAndCalculate();
}

// Remove commas on focus
function removeCommas(input) {
  input.value = input.value.replace(/,/g, '');
}

// Final format on blur
function formatDisplay(input) {
  const raw = input.value.replace(/,/g, '');
  if (raw && !isNaN(raw)) {
    input.value = formatNumber(raw);
  }
}

// Save all data and calculate totals and earnings
function saveAndCalculate() {
  const rows = document.querySelectorAll("#account-table-body tr");
  const accounts = [];
  let totalIncome = 0;
  let availableIncome = 0;
  let farmingIncome = 0;
  let soldIncome = 0;

  let availableCount = 0;
  let farmingCount = 0;
  let soldCount = 0;

  rows.forEach(row => {
    const accountNumber = row.children[0].textContent;
    const bucksInput = row.children[1].querySelector("input");
    const ageUpsInput = row.children[2].querySelector("input");
    const rowTotalCell = row.querySelector(".row-total");

    const bucks = parseInt(bucksInput.value.replace(/,/g, '')) || 0;
    const ageUps = parseInt(ageUpsInput.value) || 0;

    const bucksCost = Math.floor(bucks / 1000);
    const ageUpsCost = ageUps;
    const rowTotal = bucksCost + ageUpsCost;

    rowTotalCell.textContent = `₱${rowTotal}`;
    totalIncome += rowTotal;

    const status = row.classList.contains('sold')
      ? 'sold'
      : row.classList.contains('farming')
      ? 'farming'
      : 'available';

    if (status === 'available') {
      availableCount++;
      availableIncome += rowTotal;
    }
    if (status === 'farming') {
      farmingCount++;
      farmingIncome += rowTotal;
    }
    if (status === 'sold') {
      soldCount++;
      soldIncome += rowTotal;
    }

    accounts.push({ accountNumber, bucks, ageUps, status });
  });

  // Save to localStorage
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Update counters
  document.getElementById("available-count").textContent = `✅ Available: ${availableCount}`;
  document.getElementById("farming-count").textContent = `⏳ Farming: ${farmingCount}`;
  document.getElementById("sold-count").textContent = `❌ Sold: ${soldCount}`;

  // Update earnings
  document.getElementById("total-income").textContent = totalIncome;
  document.getElementById("available-income").textContent = availableIncome;
  document.getElementById("farming-income").textContent = farmingIncome;
  document.getElementById("sold-income").textContent = soldIncome;
}

// Clear all rows and reset
function clearAll() {
  localStorage.removeItem("accounts");
  document.getElementById("account-table-body").innerHTML = '';
  accountCount = 1;

  // Reset counts
  document.getElementById("available-count").textContent = `✅ Available: 0`;
  document.getElementById("farming-count").textContent = `⏳ Farming: 0`;
  document.getElementById("sold-count").textContent = `❌ Sold: 0`;

  document.getElementById("total-income").textContent = '0';
  document.getElementById("available-income").textContent = '0';
  document.getElementById("farming-income").textContent = '0';
  document.getElementById("sold-income").textContent = '0';

  addRow();
}
`
