document.addEventListener("DOMContentLoaded", function () {
  fetchSupportedCurrencies();
  document.getElementById("tokenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const tokenID = document.getElementById("tokenID").value;
    const currency = document.getElementById("currency").value;
    const includeMarketCap =
      document.getElementById("includeMarketCap").checked;
    const include24hrVol = document.getElementById("include24hrVol").checked;

    fetchTokenDetails(tokenID, currency, includeMarketCap, include24hrVol);
  });
});

async function fetchSupportedCurrencies() {
  const options = {
    method: "GET",
    headers: { "x-cg-demo-api-key": "CG-jmxou7JSfuAZxcYBVveugRAZ" },
  };
  const currencySelect = document.getElementById("currency");

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
      options
    );
    const currencies = await response.json();

    currencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency;
      option.innerText = currency.toUpperCase();
      currencySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching supported currencies:", error);
  }
}

async function fetchTokenDetails(
  tokenID,
  currency,
  includeMarketCap,
  include24hrVol
) {
  let url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenID}&vs_currencies=${currency}`;

  if (includeMarketCap) url += "&include_market_cap=true";
  if (include24hrVol) url += "&include_24hr_vol=true";

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayTokenDetails(data[tokenID], currency);
  } catch (error) {
    console.error("Error fetching token details:", error);
  }
}

function displayTokenDetails(tokenDetails, currency) {
  const detailsDiv = document.getElementById("tokenDetails");
  if (!tokenDetails) {
    detailsDiv.innerHTML = "Token details could not be fetched.";
    return;
  }

  detailsDiv.innerHTML = `
      <p><strong>Current Price (${currency.toUpperCase()}):</strong> ${
    tokenDetails[currency]
  }</p>
      ${
        tokenDetails[currency + "_market_cap"]
          ? `<p><strong>Market Cap:</strong> ${
              tokenDetails[currency + "_market_cap"]
            }</p>`
          : ""
      }
      ${
        tokenDetails[currency + "_24h_vol"]
          ? `<p><strong>24-hour Trading Volume:</strong> ${
              tokenDetails[currency + "_24h_vol"]
            }</p>`
          : ""
      }
  `;
}
