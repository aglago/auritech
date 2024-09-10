// Convert number to words for the invoice
export const numberToWords = (num) => {
  const currency = "Rupees"; // Main currency
  const miniCurrency = "Paise"; // Mini currency or coins
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const convertLessThanOneThousand = (n) => {
    if (n >= 100) {
      return (
        ones[Math.floor(n / 100)] +
        " Hundred " +
        convertLessThanOneThousand(n % 100)
      );
    }
    if (n >= 20) {
      return tens[Math.floor(n / 10)] + " " + ones[n % 10];
    }
    if (n >= 10) {
      return teens[n - 10];
    }
    return ones[n];
  };

  const convertNumber = (n) => {
    const billions = Math.floor(n / 1000000000);
    const millions = Math.floor((n % 1000000000) / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const remainder = n % 1000;

    let result = "";

    if (billions) {
      result += convertLessThanOneThousand(billions) + " Billion ";
    }
    if (millions) {
      result += convertLessThanOneThousand(millions) + " Million ";
    }
    if (thousands) {
      result += convertLessThanOneThousand(thousands) + " Thousand ";
    }
    if (remainder) {
      result += convertLessThanOneThousand(remainder);
    }

    return result.trim();
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = convertNumber(integerPart) + " " + currency;

  if (decimalPart > 0) {
    result +=
      " and " + convertLessThanOneThousand(decimalPart) + " " + miniCurrency;
  }

  // Fix formatting
  result = result
    .replace(/\s{2,}/g, " ") // Remove extra spaces
    .trim(); // Trim leading/trailing spaces

  return result;
};

export const calculateTaxType = (placeOfSupply, placeOfDelivery) => {
  return placeOfSupply === placeOfDelivery ? "CGST & SGST" : "IGST";
};

export const calculateTaxAmount = (netAmount, taxRate, taxType) => {
  console.log("netAmount: " + netAmount + " taxRate: " + taxRate + " taxType: " + taxType);
  
  const totalTax = netAmount * (taxRate / 100);
  console.log("totalTax: " + totalTax);
  console.log("totalTax/2: " + totalTax / 2);
  
  
  return taxType === "CGST & SGST"
    ? { CGST: totalTax / 2, SGST: totalTax / 2 }
    : { IGST: totalTax };
};

export const calculateTotal = (invoice) => {
  return invoice.items
    ?.reduce((total, item) => {
      const netAmount = item.unitPrice * item.quantity - (item.discount || 0);
      const taxAmount = calculateTaxAmount(
        netAmount,
        item.taxRate,
        calculateTaxType(invoice.placeOfSupply, invoice.placeOfDelivery)
      );
      return (
        total + netAmount + Object.values(taxAmount).reduce((a, b) => a + b, 0)
      );
    }, 0)
    .toFixed(2);
};


// Format currency
export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};


// Validate Indian GST number
export const validateGSTIN = (gstin) => {
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

// Format date to DD/MM/YYYY
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Generate a random invoice number
export const generateInvoiceNumber = () => {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

// Validate email address
export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};


// Format phone number (assuming Indian format)
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "+91 " + match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
};
