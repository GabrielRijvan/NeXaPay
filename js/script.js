"use strict";

/* =========================================================
   NEXAPAY — GLOBAL SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const data = window.NexaPayData || {};

    const transactions = data.transactions || [];
    const customers = data.customers || [];
    const invoices = data.invoices || [];
    const paymentLinks = data.paymentLinks || [];

    /* =====================================================
       THEME
    ===================================================== */

    const themeToggle = document.getElementById("themeToggle");

    function getSavedTheme() {
        return localStorage.getItem("nexapay-theme");
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        localStorage.setItem("nexapay-theme", theme);

        if (themeToggle) {
            themeToggle.textContent = theme === "dark" ? "☀" : "◐";
        }
    }

    const savedTheme = getSavedTheme();

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.documentElement.dataset.theme || "light";

            applyTheme(current === "dark" ? "light" : "dark");
        });
    }

    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    const sidebar = document.getElementById("sidebar");

    const menuToggle = document.getElementById("menuToggle");

    if (sidebar && menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", event => {
            if (
                window.innerWidth <= 800 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                sidebar.classList.remove("open");
            }
        });
    }

    /* =====================================================
       GENERAL HELPERS
    ===================================================== */

    function formatMoney(amount, currency = "EUR") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency
        }).format(Number(amount || 0));
    }

    function formatNumber(number) {
        return new Intl.NumberFormat("en-US").format(Number(number || 0));
    }

    function formatDate(date) {
        if (!date) return "—";

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(date));
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =====================================================
       CURRENT PAGE
    ===================================================== */

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();

    /* =====================================================
       OVERVIEW
    ===================================================== */

    if (currentPage === "" || currentPage === "index.html") {
        initializeOverview();
    }

    function initializeOverview() {
        updateOverviewStats();

        renderRecentTransactions();

        renderRevenueChart();

        renderPaymentMethods();
    }

    /* =====================================================
       OVERVIEW — STATS
    ===================================================== */

    function updateOverviewStats() {
        const successful = transactions.filter(
            transaction => transaction.status === "succeeded"
        );

        const pending = transactions.filter(
            transaction => transaction.status === "pending"
        );

        const totalVolume = transactions.reduce(
            (sum, transaction) => sum + Number(transaction.amount || 0),
            0
        );

        const pendingVolume = pending.reduce(
            (sum, transaction) => sum + Number(transaction.amount || 0),
            0
        );

        /*
         * Les sélecteurs sont volontairement souples
         * pour fonctionner avec différentes versions
         * de la page Overview.
         */

        const statCards = document.querySelectorAll(".stat-card");

        if (statCards.length >= 4) {
            const values = [
                formatMoney(48250),

                formatMoney(totalVolume),

                formatNumber(successful.length),

                formatMoney(pendingVolume)
            ];

            statCards.forEach((card, index) => {
                const value = card.querySelector(".stat-value");

                if (value) {
                    value.textContent = values[index];
                }
            });
        }
    }

    /* =====================================================
       OVERVIEW — RECENT TRANSACTIONS
    ===================================================== */

    function renderRecentTransactions() {
        const tableBody = document.querySelector("#recentTransactionsBody");

        if (!tableBody) return;

        const recent = [...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        tableBody.innerHTML = recent
            .map(transaction => {
                const status = transaction.status;

                const statusText =
                    {
                        succeeded: "Succeeded",
                        pending: "Pending",
                        failed: "Failed",
                        refunded: "Refunded"
                    }[status] || status;

                return `

                        <tr>

                            <td>

                                <div class="transaction-id">

                                    <strong>
                                        ${escapeHTML(transaction.id)}
                                    </strong>

                                    <span>
                                        ${escapeHTML(transaction.description)}
                                    </span>

                                </div>

                            </td>


                            <td>

                                <div class="customer-cell">

                                    <div class="customer-avatar">

                                        ${escapeHTML(
                                            transaction.customerName
                                                .charAt(0)
                                                .toUpperCase()
                                        )}

                                    </div>

                                    <div>

                                        <strong>
                                            ${escapeHTML(
                                                transaction.customerName
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <strong>
                                    ${formatMoney(
                                        transaction.amount,
                                        transaction.currency
                                    )}
                                </strong>

                            </td>


                            <td>

                                <span
                                    class="status status-${escapeHTML(status)}"
                                >

                                    <span class="status-dot"></span>

                                    ${statusText}

                                </span>

                            </td>


                            <td>

                                ${formatDate(transaction.date)}

                            </td>

                        </tr>

                    `;
            })
            .join("");
    }

    /* =====================================================
       OVERVIEW — REVENUE CHART
    ===================================================== */

    function renderRevenueChart() {
        const chart = document.querySelector(".chart-placeholder");

        if (!chart) return;

        const monthlyRevenue = data.monthlyRevenue || [];

        if (!monthlyRevenue.length) return;

        const values = monthlyRevenue.map(item => Number(item.revenue || 0));

        const max = Math.max(...values, 1);

        const width = 900;

        const height = 230;

        const paddingX = 35;

        const paddingY = 25;

        const usableWidth = width - paddingX * 2;

        const usableHeight = height - paddingY * 2;

        const points = values
            .map((value, index) => {
                const x =
                    paddingX +
                    (index / Math.max(values.length - 1, 1)) * usableWidth;

                const y = height - paddingY - (value / max) * usableHeight;

                return `${x},${y}`;
            })
            .join(" ");

        const circles = values
            .map((value, index) => {
                const x =
                    paddingX +
                    (index / Math.max(values.length - 1, 1)) * usableWidth;

                const y = height - paddingY - (value / max) * usableHeight;

                return `

                        <circle
                            cx="${x}"
                            cy="${y}"
                            r="4"
                            fill="var(--primary)"
                        />

                    `;
            })
            .join("");

        const labels = monthlyRevenue
            .map((item, index) => {
                const x =
                    paddingX +
                    (index / Math.max(values.length - 1, 1)) * usableWidth;

                return `

                        <text
                            x="${x}"
                            y="${height - 3}"
                            text-anchor="middle"
                            fill="var(--text-tertiary)"
                            font-size="10"
                            font-family="Manrope, sans-serif"
                        >
                            ${escapeHTML(item.month)}
                        </text>

                    `;
            })
            .join("");

        chart.innerHTML = `

            <svg
                viewBox="0 0 ${width} ${height}"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
            >

                <line
                    x1="${paddingX}"
                    y1="${paddingY}"
                    x2="${width - paddingX}"
                    y2="${paddingY}"
                    stroke="var(--border)"
                />

                <line
                    x1="${paddingX}"
                    y1="${height / 2}"
                    x2="${width - paddingX}"
                    y2="${height / 2}"
                    stroke="var(--border)"
                />

                <line
                    x1="${paddingX}"
                    y1="${height - paddingY}"
                    x2="${width - paddingX}"
                    y2="${height - paddingY}"
                    stroke="var(--border)"
                />


                <polyline
                    points="${points}"
                    fill="none"
                    stroke="var(--primary)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />


                ${circles}

                ${labels}

            </svg>

        `;
    }

    /* =====================================================
       OVERVIEW — PAYMENT METHODS
    ===================================================== */

    function renderPaymentMethods() {
        const percentages = data.paymentMethodPercentages;

        if (!percentages) return;

        const legend = document.querySelector(".donut-container .legend");

        if (!legend) return;

        const entries = Object.entries(percentages);

        const colors = ["var(--primary)", "#8b86ff", "#a9a5ff", "#d7d5ff"];

        legend.innerHTML = entries
            .map(([method, percentage], index) => {
                return `

                        <div class="legend-item">

                            <div class="legend-left">

                                <span
                                    class="legend-dot"
                                    style="
                                        background:
                                        ${colors[index % colors.length]};
                                    "
                                ></span>

                                <span>
                                    ${escapeHTML(method)}
                                </span>

                            </div>

                            <strong>
                                ${percentage}%
                            </strong>

                        </div>

                    `;
            })
            .join("");
    }

    /* =====================================================
       GLOBAL EXPORT BUTTONS
    ===================================================== */

    document.querySelectorAll("[data-export]").forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.export;

            if (type === "transactions") {
                exportCSV(transactions, "nexapay-transactions.csv");
            }

            if (type === "customers") {
                exportCSV(customers, "nexapay-customers.csv");
            }

            if (type === "invoices") {
                exportCSV(invoices, "nexapay-invoices.csv");
            }

            if (type === "payment-links") {
                exportCSV(paymentLinks, "nexapay-payment-links.csv");
            }
        });
    });

    /* =====================================================
       GENERIC CSV EXPORT
    ===================================================== */

    function exportCSV(rows, filename) {
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);

        const csvRows = [
            headers,

            ...rows.map(row => headers.map(header => row[header]))
        ];

        const csv = csvRows
            .map(row =>
                row
                    .map(
                        value => `"${String(value ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    }

    /* =====================================================
       ESCAPE MODALS WITH ESC
    ===================================================== */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        document.querySelectorAll(".modal-overlay.open").forEach(modal => {
            modal.classList.remove("open");
        });
    });

    /* =====================================================
       CLOSE MODALS WHEN CLICKING OUTSIDE
    ===================================================== */

    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("open");
            }
        });
    });

    /* =====================================================
       GENERIC DEMO BUTTON FEEDBACK
    ===================================================== */

    document.querySelectorAll("[data-demo-action]").forEach(button => {
        button.addEventListener("click", () => {
            const original = button.textContent;

            button.textContent = "Done ✓";

            button.disabled = true;

            setTimeout(() => {
                button.textContent = original;

                button.disabled = false;
            }, 1200);
        });
    });

    /* =====================================================
       LOG
    ===================================================== */

    console.log("%cNexaPay Dashboard", "font-size:16px;font-weight:800;");

    console.log(
        `Loaded:
        ${transactions.length} transactions
        ${customers.length} customers
        ${invoices.length} invoices
        ${paymentLinks.length} payment links`
    );
});
