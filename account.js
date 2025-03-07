document.addEventListener("DOMContentLoaded", function() {
    // --- Typewriter Effect ---
    function typewriterEffect(element, text, speed = 50, callback) {
        let i = 0;
        element.innerHTML = "";

        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else if (callback) {
                callback();
            }
        }
        typing();
    }

    // Initialize Welcome Message
    let welcomeMessage = document.getElementById("welcome-message");
    let welcomeHeader = welcomeMessage.querySelector("h2");
    typewriterEffect(welcomeHeader, "Welcome to Smart Business Assistance", 75, function() {
        setTimeout(() => {
            welcomeMessage.style.transition = "opacity 1s ease-out";
            welcomeMessage.style.opacity = "0";
            setTimeout(() => {
                welcomeMessage.style.display = "none";
                document.getElementById("program-info").style.display = "flex";
            }, 1000);
        }, 3000);
    });

    // --- Side Navigation Toggle ---
    let navToggle = document.querySelector(".nav-toggle");
    let sideNav = document.querySelector(".side-nav");
    let closeNav = document.querySelector(".close-nav");
    navToggle.addEventListener("click", function() {
        sideNav.style.display = "block";
    });
    closeNav.addEventListener("click", function() {
        sideNav.style.display = "none";
    });

    // --- Main Menu Buttons ---
    let calcSections = document.querySelectorAll(".calc-section");
    calcSections.forEach(sec => sec.style.display = "none");
    let programInfo = document.getElementById("program-info");
    let calcButtons = document.querySelectorAll(".calc-btn");
    calcButtons.forEach(button => {
        button.addEventListener("click", function() {
            programInfo.style.display = "none";
            calcSections.forEach(sec => sec.style.display = "none");
            let calcType = button.getAttribute("data-calc");
            let section = document.getElementById(`${calcType}-section`);
            if (section) {
                section.style.display = "block";
                let today = new Date().toLocaleDateString();
                if (calcType === "trading-account") {
                    document.getElementById("trading-date").textContent = "Date: " + today;
                }
                if (calcType === "cash-book") {
                    document.getElementById("cashbook-date").textContent = "Date: " + today;
                }
                if (calcType === "profit-loss") {
                    document.getElementById("pl-date").textContent = "Date: " + today;
                }
            }
        });
    });

    // --- Trading Account Calculation ---
    document.getElementById("calculate-trading").addEventListener("click", function() {
        let transDate = document.getElementById("trading-date-input").value;
        if (!transDate) {
            alert("Please enter the transaction date.");
            return;
        }
        let openingStock = parseFloat(document.getElementById("opening-stock").value) || 0;
        let purchases = parseFloat(document.getElementById("purchases").value) || 0;
        let carriageInward = parseFloat(document.getElementById("carriage-inward").value) || 0;
        let returnOutward = parseFloat(document.getElementById("return-outward").value) || 0;
        let closingStock = parseFloat(document.getElementById("closing-stock").value) || 0;
        let sales = parseFloat(document.getElementById("sales").value) || 0;
        let returnInward = parseFloat(document.getElementById("return-inward").value) || 0;

        // Calculations
        let costOfGoodsAvailable = openingStock + purchases + carriageInward - returnOutward;
        let costOfGoodsSold = costOfGoodsAvailable - closingStock;
        let netSales = sales - returnInward;
        let grossProfit = netSales - costOfGoodsSold;

        // Build Debit Side Data (each row as an object)
        let debitData = [
            { label: "Opening Stock", value: openingStock },
            { label: "Add Purchase", value: purchases },
            { label: "Add Carriage Inward", value: carriageInward },
            { label: "Less Return Outward", value: returnOutward },
            { label: "Cost of Goods Available", value: costOfGoodsAvailable },
            { label: "Less Closing Stock", value: closingStock },
            { label: "Cost of Goods Sold", value: costOfGoodsSold }
        ];
        // Build Credit Side Data
        let creditData = [
            { label: "Sales", value: sales },
            { label: "Less Return Inward", value: returnInward },
            { label: "Net Sales", value: netSales },
            { label: "Gross Profit", value: grossProfit }
        ];

        // Populate Debit Table
        let debitTbody = document.getElementById("trading-debit-body");
        debitTbody.innerHTML = "";
        debitData.forEach(item => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${item.label}</td><td>₦${item.value.toFixed(2)}</td>`;
            debitTbody.appendChild(tr);
        });
        // Populate Credit Table
        let creditTbody = document.getElementById("trading-credit-body");
        creditTbody.innerHTML = "";
        creditData.forEach(item => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${item.label}</td><td>₦${item.value.toFixed(2)}</td>`;
            creditTbody.appendChild(tr);
        });

        // Show the Profit & Loss button within Trading Account section
        document.getElementById("calculate-pl-btn").style.display = "block";
        window.grossProfit = grossProfit; // Save for P&L calculation
    });

    // --- Profit & Loss Calculation ---
    // Triggered from the Trading Account section's button
    document.getElementById("calculate-pl-btn").addEventListener("click", function() {
        document.getElementById("trading-account-section").style.display = "none";
        document.getElementById("profit-loss-section").style.display = "block";
        let today = new Date().toLocaleDateString();
        document.getElementById("pl-date").textContent = "Date: " + today;
    });

    document.getElementById("calculate-pl").addEventListener("click", function() {
        if (typeof window.grossProfit === "undefined") {
            alert("Please calculate the Trading Account first.");
            return;
        }
        let operatingExp = parseFloat(document.getElementById("operating-expenses").value) || 0;
        let adminExp = parseFloat(document.getElementById("admin-expenses").value) || 0;
        let financeCosts = parseFloat(document.getElementById("finance-costs").value) || 0;
        let otherIncome = parseFloat(document.getElementById("other-income-pl").value) || 0;

        let totalExpenses = operatingExp + adminExp + financeCosts;
        let netProfit = window.grossProfit + otherIncome - totalExpenses;
        let advice = netProfit > 0 ? "Profit achieved. Consider saving 10% of your profit." : "Loss incurred. Consider revising your pricing using Price Prediction.";

        let resultDiv = document.getElementById("pl-result");
        resultDiv.innerHTML = `
      <p><strong>Gross Profit:</strong> ₦${window.grossProfit.toFixed(2)}</p>
      <p><strong>Other Income:</strong> ₦${otherIncome.toFixed(2)}</p>
      <p><strong>Total Expenses:</strong> ₦${totalExpenses.toFixed(2)}</p>
      <p><strong>Net Profit:</strong> ₦${netProfit.toFixed(2)}</p>
      <p>${advice}</p>
    `;
    });

    const transactionForm = document.getElementById("transactionForm");
    const cashBookBody = document.querySelector("#cashBook tbody");
    const summaryFoot = document.getElementById("summary");
    const calculateButton = document.getElementById("calculateButton");

    // Add transaction event
    transactionForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Retrieve form values
        const date = document.getElementById("date").value;
        const particulars = document.getElementById("particulars").value;
        const amount = parseFloat(document.getElementById("amount").value) || 0;
        const type = document.querySelector('input[name="type"]:checked').value;

        // Create a new table row for the transaction
        const row = document.createElement("tr");
        row.innerHTML = `<td>${date}</td>
                       <td>${particulars}</td>`;

        // Place the amount in the appropriate column based on the type
        if (type === "debit") {
            row.innerHTML += `<td>${amount.toFixed(2)}</td><td></td>`;
        } else {
            row.innerHTML += `<td></td><td>${amount.toFixed(2)}</td>`;
        }

        cashBookBody.appendChild(row);

        // Clear the form for next entry
        transactionForm.reset();
    });

    // Calculate balances event
    calculateButton.addEventListener("click", function() {
        let totalDebit = 0;
        let totalCredit = 0;

        // Loop through each transaction row to sum amounts
        const rows = cashBookBody.querySelectorAll("tr");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            totalDebit += parseFloat(cells[2].innerText) || 0;
            totalCredit += parseFloat(cells[3].innerText) || 0;
        });

        // Clear previous summary rows
        summaryFoot.innerHTML = "";

        // Row 1: Total
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `<td></td>
                            <td>Total</td>
                            <td>${totalDebit.toFixed(2)}</td>
                            <td>${totalCredit.toFixed(2)}</td>`;
        summaryFoot.appendChild(totalRow);

        // Determine which side is higher and set BBD and BCD accordingly
        if (totalDebit > totalCredit) {
            const net = totalDebit - totalCredit;
            // For debit higher: Debit gets Balance Brought Down, Credit gets Balance Carried Down
            const bbdRow = document.createElement("tr");
            bbdRow.innerHTML = `<td></td>
                            <td>Balance Brought Down (BBD)</td>
                            <td>${net.toFixed(2)}</td>
                            <td></td>`;
            summaryFoot.appendChild(bbdRow);
            const bcdRow = document.createElement("tr");
            bcdRow.innerHTML = `<td></td>
                            <td>Balance Carried Down (BCD)</td>
                            <td></td>
                            <td>${net.toFixed(2)}</td>`;
            summaryFoot.appendChild(bcdRow);
        } else if (totalCredit > totalDebit) {
            const net = totalCredit - totalDebit;
            // For credit higher: Credit gets Balance Brought Down, Debit gets Balance Carried Down
            const bbdRow = document.createElement("tr");
            bbdRow.innerHTML = `<td></td>
                            <td>Balance Brought Down (BBD)</td>
                            <td></td>
                            <td>${net.toFixed(2)}</td>`;
            summaryFoot.appendChild(bbdRow);
            const bcdRow = document.createElement("tr");
            bcdRow.innerHTML = `<td></td>
                            <td>Balance Carried Down (BCD)</td>
                            <td>${net.toFixed(2)}</td>
                            <td></td>`;
            summaryFoot.appendChild(bcdRow);
        } else {
            // When both totals are equal
            const bbdRow = document.createElement("tr");
            bbdRow.innerHTML = `<td></td>
                            <td>Balance Brought Down (BBD)</td>
                            <td>0.00</td>
                            <td></td>`;
            summaryFoot.appendChild(bbdRow);
            const bcdRow = document.createElement("tr");
            bcdRow.innerHTML = `<td></td>
                            <td>Balance Carried Down (BCD)</td>
                            <td></td>
                            <td>0.00</td>`;
            summaryFoot.appendChild(bcdRow);
        }
    });
    // --- Petty Cash Book Functionality ---
    document.getElementById("add-petty-row").addEventListener("click", function() {
        let container = document.getElementById("petty-entries");
        let row = document.createElement("div");
        row.className = "petty-row";
        row.innerHTML = `
      <input type="date" class="petty-date" required>
      <input type="text" class="petty-desc" placeholder="Enter description" required>
      <input type="number" class="petty-amount" placeholder="Amount (₦)" required>
      <select class="petty-type" required>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
      <button type="button" class="remove-petty-row">Remove</button>
    `;
        container.appendChild(row);
    });
    document.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("remove-petty-row")) {
            e.target.parentElement.remove();
        }
    });

    document.getElementById("calculate-petty").addEventListener("click", function() {
        let initialPetty = parseFloat(document.getElementById("petty-initial").value) || 0;
        let reimbursement = parseFloat(document.getElementById("petty-reimbursement").value) || 0;
        let rows = document.querySelectorAll(".petty-row");
        let tbody = document.querySelector("#pettycash-table tbody");
        tbody.innerHTML = "";
        let totalDebit = 0,
            totalCredit = 0;
        rows.forEach(row => {
            let date = row.querySelector(".petty-date").value;
            let desc = row.querySelector(".petty-desc").value;
            let amount = parseFloat(row.querySelector(".petty-amount").value) || 0;
            let type = row.querySelector(".petty-type").value;
            let tr = document.createElement("tr");
            if (type === "debit") {
                totalDebit += amount;
            } else {
                totalCredit += amount;
            }
            tr.innerHTML = `<td>${date}</td><td>${desc}</td><td>${type==="debit" ? "₦" + amount.toFixed(2) : ""}</td><td>${type==="credit" ? "₦" + amount.toFixed(2) : ""}</td>`;
            tbody.appendChild(tr);
        });
        let finalPettyBalance = initialPetty + totalCredit - totalDebit + reimbursement;
        document.getElementById("petty-bbd").textContent = "₦" + initialPetty.toFixed(2);
        if (finalPettyBalance >= 0) {
            document.getElementById("petty-bcd").textContent = "₦" + finalPettyBalance.toFixed(2);
            document.getElementById("petty-bbd-credit").textContent = "";
            document.getElementById("petty-bcd-credit").textContent = "";
        } else {
            document.getElementById("petty-bcd-credit").textContent = "₦" + Math.abs(finalPettyBalance).toFixed(2);
            document.getElementById("petty-bcd").textContent = "";
        }
    });

    // --- Price Prediction Calculation ---
    document.getElementById("calculate-pp").addEventListener("click", function() {
        let totalSpent = parseFloat(document.getElementById("pp-total-spent").value) || 0;
        let totalQuantity = parseFloat(document.getElementById("pp-total-quantity").value) || 1;
        let expectedProfit = parseFloat(document.getElementById("pp-expected-profit").value) || 0;
        let demandRating = parseFloat(document.getElementById("pp-demand-rating").value) || 5;
        let competitorPrice = parseFloat(document.getElementById("pp-competitor-price").value) || 0;

        let unitCost = totalSpent / totalQuantity;
        let goodPrice = unitCost * (1 + expectedProfit / 100) * (1 + (demandRating / 10));
        let perfectPrice = competitorPrice > 0 ? (goodPrice + competitorPrice) / 2 : goodPrice;

        let desc = document.getElementById("pp-description");
        if (desc) {
            desc.textContent = "Calculated Unit Cost: ₦" + unitCost.toFixed(2) +
                ". Recommended Good Price: ₦" + goodPrice.toFixed(2) +
                ". Perfect Price: ₦" + perfectPrice.toFixed(2) + ".";
        }
        displayResults([], [
            { name: "Unit Cost", amount: unitCost },
            { name: "Good Price", amount: goodPrice },
            { name: "Perfect Price", amount: perfectPrice }
        ]);
    });

    // --- General Results Display Function ---
    function displayResults(debitItems, creditItems) {
        let resultsTable = document.getElementById("results-table");
        let resultsSection = document.getElementById("results-section");
        let tbody = resultsTable.querySelector("tbody");
        tbody.innerHTML = "";
        let maxRows = Math.max(debitItems.length, creditItems.length);
        for (let i = 0; i < maxRows; i++) {
            let dItem = debitItems[i] ? `<strong>${debitItems[i].name}</strong>: ₦${debitItems[i].amount.toFixed(2)}` : "";
            let cItem = creditItems[i] ? `<strong>${creditItems[i].name}</strong>: ₦${creditItems[i].amount.toFixed(2)}` : "";
            let row = document.createElement("tr");
            row.innerHTML = `<td>${dItem}</td><td>${cItem}</td>`;
            tbody.appendChild(row);
        }
        resultsSection.style.display = "block";
    }

    // --- Back to Home ---
    document.getElementById("back-home").addEventListener("click", function() {
        calcSections.forEach(sec => sec.style.display = "none");
        document.getElementById("results-section").style.display = "none";
        programInfo.style.display = "block";
    });
});