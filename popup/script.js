function addEntries() {
  const dollars = document.getElementById('amount').value;
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const tab = tabs[0];
    browser.scripting.executeScript({target: {tabId: tab.id}, func: autoClickGreaterThan, args: [parseInt(dollars, 10)]});
  });
}

function autoClickGreaterThan(dollars) {
  const table = document.getElementById('geeklist');
  const tbody = table.getElementsByTagName('tbody')[0];
  const rows = tbody.getElementsByTagName("tr");
  const rowsWithValues = [...rows].map(row => ({ row, value: parseInt(row.innerText.match(/\$(\d+)/)[1], 10) }));
  const desiredRows = rowsWithValues.filter(({ value }) => value >= dollars);
  const buttons = desiredRows.map(({ row }) => row.firstChild.querySelector('[title="1-click add"]'))
  buttons.forEach(b => b && b.click());
}

function addValuesOnTab() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const tab = tabs[0];
    browser.scripting.executeScript({target: {tabId: tab.id}, func: addValues});
  });
}

function addValues() {
  const rows = document.getElementsByTagName('td');
  const rowsWithValues = [...rows].filter(row => row.innerText.match(/\$\d+/));
  rowsWithValues.forEach(row => {
    const value = parseInt(row.innerText.match(/\$(\d+)/)[1], 10);
    row.lastChild.querySelector('input').value = value;
  });
}

document.getElementById('addEntries').addEventListener('click', addEntries);
document.getElementById('addValues').addEventListener('click', addValuesOnTab);

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  const tab = tabs[0];
  if (tab.url.includes('viewpp=1')) {
    document.getElementById('addEntriesForm').classList.remove('hidden');
    return;
  }
  if (tab.url.includes('mywants.cgi')) {
    document.getElementById('addValuesForm').classList.remove('hidden');
    return;
  }

  document.getElementById('blank-state').classList.remove('hidden');
});
