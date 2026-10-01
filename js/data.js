"use strict";

/*
|--------------------------------------------------------------------------
| NexaPay — DATA GENERATOR
|--------------------------------------------------------------------------
| Ce fichier ne gère PAS l'interface.
| Il génère uniquement les données fictives utilisées par la dashboard.
|--------------------------------------------------------------------------
*/

/* =========================================================
   CONFIGURATION
========================================================= */

const DATA_CONFIG = {
    customers: 250,
    transactions: 1000,
    invoices: 120,
    paymentLinks: 60
};

/* =========================================================
   RANDOM HELPERS
========================================================= */

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
    const value = Math.random() * (max - min) + min;

    return Number(value.toFixed(decimals));
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomBoolean(probability = 0.5) {
    return Math.random() < probability;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function randomDate(startDate, endDate) {
    const start = startDate.getTime();
    const end = endDate.getTime();

    const timestamp = start + Math.random() * (end - start);

    return new Date(timestamp);
}

function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    }).format(date);
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

/* =========================================================
   NAME DATABASE
========================================================= */

const FIRST_NAMES = [
    "James",
    "John",
    "Michael",
    "Robert",
    "David",
    "William",
    "Daniel",
    "Thomas",
    "Matthew",
    "Christopher",
    "Andrew",
    "Joseph",
    "Charles",
    "Anthony",
    "Benjamin",
    "Samuel",
    "Henry",
    "Lucas",
    "Alexander",
    "Gabriel",
    "Emma",
    "Olivia",
    "Sophia",
    "Ava",
    "Isabella",
    "Mia",
    "Charlotte",
    "Amelia",
    "Harper",
    "Evelyn",
    "Ella",
    "Grace",
    "Chloe",
    "Victoria",
    "Luna",
    "Camille",
    "Claire",
    "Sarah",
    "Marie"
];

const LAST_NAMES = [
    "Martin",
    "Johnson",
    "Williams",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "King",
    "Wright",
    "Scott",
    "Green"
];

const COMPANY_PREFIXES = [
    "Nova",
    "Blue",
    "Apex",
    "Vertex",
    "Atlas",
    "North",
    "Prime",
    "Bright",
    "Urban",
    "Horizon",
    "Summit",
    "Element",
    "Silver",
    "Cobalt",
    "Pioneer",
    "Quantum",
    "Digital",
    "Global",
    "Alpha"
];

const COMPANY_SUFFIXES = [
    "Studio",
    "Agency",
    "Labs",
    "Digital",
    "Group",
    "Solutions",
    "Systems",
    "Creative",
    "Media",
    "Technologies",
    "Partners",
    "Consulting"
];

const COUNTRIES = [
    {
        name: "France",
        code: "FR",
        currency: "EUR"
    },
    {
        name: "United Kingdom",
        code: "GB",
        currency: "GBP"
    },
    {
        name: "Germany",
        code: "DE",
        currency: "EUR"
    },
    {
        name: "Canada",
        code: "CA",
        currency: "CAD"
    },
    {
        name: "United States",
        code: "US",
        currency: "USD"
    },
    {
        name: "Belgium",
        code: "BE",
        currency: "EUR"
    },
    {
        name: "Switzerland",
        code: "CH",
        currency: "CHF"
    },
    {
        name: "Netherlands",
        code: "NL",
        currency: "EUR"
    },
    {
        name: "Australia",
        code: "AU",
        currency: "AUD"
    }
];

/* =========================================================
   BUSINESS DATA
========================================================= */

const DESCRIPTIONS = [
    "Branding project",
    "Website development",
    "Landing page",
    "Consulting",
    "Design services",
    "Marketing campaign",
    "Software subscription",
    "UI/UX design",
    "Photography services",
    "Business consulting",
    "SEO services",
    "Social media management",
    "Video production",
    "Development services"
];

const PAYMENT_METHODS = [
    "Visa",
    "Mastercard",
    "American Express",
    "Bank Transfer"
];

const PAYMENT_METHOD_CODES = {
    Visa: "visa",
    Mastercard: "mastercard",
    "American Express": "amex",
    "Bank Transfer": "bank"
};

/* =========================================================
   STATUS
========================================================= */

const TRANSACTION_STATUSES = [
    "succeeded",
    "succeeded",
    "succeeded",
    "succeeded",
    "succeeded",
    "pending",
    "failed",
    "refunded"
];

const INVOICE_STATUSES = [
    "paid",
    "paid",
    "paid",
    "paid",
    "pending",
    "overdue",
    "draft"
];

/* =========================================================
   CUSTOMER GENERATOR
========================================================= */

function generatePersonName() {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);

    return {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`
    };
}

function generateCompanyName() {
    const prefix = randomItem(COMPANY_PREFIXES);
    const suffix = randomItem(COMPANY_SUFFIXES);

    return `${prefix} ${suffix}`;
}

function generateEmail(name) {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ".")
            .replace(/^\.+|\.+$/g, "") + "@example.com"
    );
}

function generateCustomer(index) {
    const person = generatePersonName();

    const isCompany = randomBoolean(0.72);

    const country = randomItem(COUNTRIES);

    let name;

    if (isCompany) {
        name = generateCompanyName();
    } else {
        name = person.fullName;
    }

    const email = generateEmail(name.replace(/\s+/g, ""));

    const createdAt = randomDate(
        new Date("2025-01-01"),
        new Date("2026-09-30")
    );

    return {
        id: `CUS-${String(index).padStart(5, "0")}`,

        name,

        email,

        firstName: person.firstName,

        lastName: person.lastName,

        type: isCompany ? "business" : "individual",

        country: country.name,

        countryCode: country.code,

        currency: country.currency,

        createdAt,

        createdAtFormatted: formatDate(createdAt),

        totalSpent: 0,

        transactionCount: 0,

        successfulPayments: 0
    };
}

/* =========================================================
   TRANSACTION GENERATOR
========================================================= */

function generateTransaction(index, customers) {
    const customer = randomItem(customers);

    const status = randomItem(TRANSACTION_STATUSES);

    const paymentMethod = randomItem(PAYMENT_METHODS);

    const amount = randomFloat(25, 8500);

    const feeRate = 0.029;

    const fixedFee = 0.3;

    const fee = Number((amount * feeRate + fixedFee).toFixed(2));

    const net = Number((amount - fee).toFixed(2));

    const date = randomDate(new Date("2026-01-01"), new Date("2026-09-30"));

    const description = randomItem(DESCRIPTIONS);

    const transaction = {
        id: `TX-${String(index).padStart(6, "0")}`,

        customerId: customer.id,

        customerName: customer.name,

        description,

        amount,

        currency: customer.currency,

        status,

        paymentMethod,

        paymentMethodCode: PAYMENT_METHOD_CODES[paymentMethod],

        date,

        dateFormatted: formatDate(date),

        dateTimeFormatted: formatDateTime(date),

        fee,

        net,

        cardLast4:
            paymentMethod === "Bank Transfer"
                ? null
                : String(randomNumber(1000, 9999)),

        refunded: status === "refunded",

        live: true
    };

    /*
    | Mise à jour du client
    */

    if (status === "succeeded") {
        customer.totalSpent = Number((customer.totalSpent + amount).toFixed(2));

        customer.successfulPayments++;
    }

    customer.transactionCount++;

    return transaction;
}

/* =========================================================
   INVOICE GENERATOR
========================================================= */

function generateInvoice(index, customers) {
    const customer = randomItem(customers);

    const amount = randomFloat(100, 7500);

    const status = randomItem(INVOICE_STATUSES);

    const issueDate = randomDate(
        new Date("2026-01-01"),
        new Date("2026-09-15")
    );

    const dueDate = new Date(issueDate);

    dueDate.setDate(dueDate.getDate() + 30);

    return {
        id: `INV-2026-${String(index).padStart(4, "0")}`,

        customerId: customer.id,

        customerName: customer.name,

        description: randomItem(DESCRIPTIONS),

        amount,

        currency: customer.currency,

        status,

        issueDate,

        issueDateFormatted: formatDate(issueDate),

        dueDate,

        dueDateFormatted: formatDate(dueDate)
    };
}

/* =========================================================
   PAYMENT LINK GENERATOR
========================================================= */

function generatePaymentLink(index) {
    const amount = randomFloat(50, 5000);

    const description = randomItem(DESCRIPTIONS);

    const createdAt = randomDate(
        new Date("2026-01-01"),
        new Date("2026-09-30")
    );

    const payments = randomNumber(0, 150);

    return {
        id: `PL-${String(index).padStart(5, "0")}`,

        code: generateLinkCode(),

        title: description,

        description,

        amount,

        currency: "EUR",

        payments,

        revenue: Number((amount * payments).toFixed(2)),

        status: randomBoolean(0.88) ? "active" : "inactive",

        createdAt,

        createdAtFormatted: formatDate(createdAt)
    };
}

function generateLinkCode() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    for (let i = 0; i < 8; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }

    return result;
}

/* =========================================================
   GENERATE DATA
========================================================= */

const customers = Array.from(
    {
        length: DATA_CONFIG.customers
    },
    (_, index) => generateCustomer(index + 1)
);

const transactions = Array.from(
    {
        length: DATA_CONFIG.transactions
    },
    (_, index) => generateTransaction(index + 1, customers)
);

const invoices = Array.from(
    {
        length: DATA_CONFIG.invoices
    },
    (_, index) => generateInvoice(index + 1, customers)
);

const paymentLinks = Array.from(
    {
        length: DATA_CONFIG.paymentLinks
    },
    (_, index) => generatePaymentLink(index + 1)
);

/* =========================================================
   GLOBAL ANALYTICS
========================================================= */

const successfulTransactions = transactions.filter(
    transaction => transaction.status === "succeeded"
);

const pendingTransactions = transactions.filter(
    transaction => transaction.status === "pending"
);

const failedTransactions = transactions.filter(
    transaction => transaction.status === "failed"
);

const refundedTransactions = transactions.filter(
    transaction => transaction.status === "refunded"
);

const totalVolume = successfulTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const totalFees = successfulTransactions.reduce(
    (total, transaction) => total + transaction.fee,
    0
);

const totalNet = successfulTransactions.reduce(
    (total, transaction) => total + transaction.net,
    0
);

const pendingVolume = pendingTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const refundedVolume = refundedTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const analytics = {
    totalTransactions: transactions.length,

    successfulTransactions: successfulTransactions.length,

    pendingTransactions: pendingTransactions.length,

    failedTransactions: failedTransactions.length,

    refundedTransactions: refundedTransactions.length,

    totalVolume: Number(totalVolume.toFixed(2)),

    totalFees: Number(totalFees.toFixed(2)),

    totalNet: Number(totalNet.toFixed(2)),

    pendingVolume: Number(pendingVolume.toFixed(2)),

    refundedVolume: Number(refundedVolume.toFixed(2))
};

/* =========================================================
   PAYMENT METHOD ANALYTICS
========================================================= */

const paymentMethodStats = {};

PAYMENT_METHODS.forEach(method => {
    paymentMethodStats[method] = transactions.filter(
        transaction => transaction.paymentMethod === method
    ).length;
});

const paymentMethodTotal = Object.values(paymentMethodStats).reduce(
    (sum, value) => sum + value,
    0
);

const paymentMethodPercentages = {};

Object.entries(paymentMethodStats).forEach(([method, count]) => {
    paymentMethodPercentages[method] = Number(
        ((count / paymentMethodTotal) * 100).toFixed(1)
    );
});

/* =========================================================
   MONTHLY REVENUE
========================================================= */

function generateMonthlyRevenue() {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
    ];

    return months.map((month, index) => {
        const monthTransactions = successfulTransactions.filter(transaction => {
            const date = transaction.date;

            return date.getMonth() === index;
        });

        const revenue = monthTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        return {
            month,

            revenue: Number(revenue.toFixed(2)),

            transactions: monthTransactions.length
        };
    });
}

const monthlyRevenue = generateMonthlyRevenue();

/* =========================================================
   EXPORT GLOBAL DATA
========================================================= */

window.NexaPayData = {
    customers,

    transactions,

    invoices,

    paymentLinks,

    analytics,

    paymentMethodStats,

    paymentMethodPercentages,

    monthlyRevenue
};

/* =========================================================
   DEBUG
========================================================= */

console.log("NexaPay data generated:", {
    customers: customers.length,
    transactions: transactions.length,
    invoices: invoices.length,
    paymentLinks: paymentLinks.length
});
