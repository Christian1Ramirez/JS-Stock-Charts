function getColor(stock) {
  const colors = {
    GME: "rgba(61, 161, 61, 0.7)",
    MSFT: "rgba(209, 4, 25, 0.7)",
    DIS: "rgba(18, 4, 209, 0.7)",
    BNTX: "rgba(166, 43, 158, 0.7)",
  };
  return colors[stock];
}

async function main() {
  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );

  const response = await fetch(
    `https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=67fa011f450f42bfb03cedf3175b9a76`
  );
  const result = await response.json();

  const { GME, MSFT, DIS, BNTX } = result;
  const stocks = [GME, MSFT, DIS, BNTX];

  stocks.forEach((stock) => stock.values.reverse());

  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
        data: stock.values.map((value) => parseFloat(value.high)),
      })),
    },
  });

  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Highest",
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          data: stocks.map((stock) => findHighest(stock.values)),
        },
      ],
    },
  });

  new Chart(averagePriceChartCanvas.getContext("2d"), {
    type: "pie",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Average",
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          data: stocks.map((stock) => calculateAverage(stock.values)),
        },
      ],
    },
  });
}

function findHighest(values) {
  return Math.max(...values.map((value) => parseFloat(value.high)));
}

function calculateAverage(values) {
  const total = values.reduce((sum, value) => sum + parseFloat(value.high), 0);
  return total / values.length;
}

main();
