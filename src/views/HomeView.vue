<template>
  <div class="home">
    <img alt="background" :class="{ fadeIn: isImageLoaded }" src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
      @load="startAnimation" />
    <div class="text-overlay text-uppercase rounded" :class="{ fadeIn: isVisible }">
      <h1 class="display-3">PowerTrack</h1>
      <p class="display-6">Coding The Future</p>
    </div>
  </div>
  <section class="powertrack-about">
    <div class="heading-container pt-5 pb-3 d-inline-flex text-uppercase d-flex flex-wrap justify-content-center">
      <h1 class="text display-5 fw-bold">Power</h1>
      <h1 class="text-success display-5 fw-bold">Track</h1>
    </div>
    <div class="about-container container p-5">
      <p class="p fs-5">
        Introducing Power Track – an elegant, user-centric application that
        seamlessly connects to your solar and battery inverters. Gain real-time
        insights into your energy production, consumption, and excess energy
        sent back to the grid. Stay informed and optimize your energy use with
        ease, from anywhere in the world.
      </p>
    </div>
    <div class="energy-dashboard-section container col-md-12 p-2 bg-dark bg-gradient rounded shadow" id="dashboard">
      <div class="dashboard-heading text-light fw-bold text-start pt-5 pb-4 px-3 text-capitalize">
        Energy Dashboard
      </div>
      <div class="dashboard-timezones mb-4 container-fluid">
        <ul
          class="navbar text-decoration-none list-unstyled nav-background rounded text-uppercase position-relative justify-content-center">
          <li class="nav-item active">
            <a class="nav-link px-3" href="#">Today</a>
          </li>
        </ul>
      </div>

      <div class="chart-container d-flex flex-wrap justify-content-between">
        <!-- Energy Calculator -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow">
            <div class="card-body p-3 bg-dark text-white rounded">
              <h5 class="h5 text-light text-uppercase text-start">
                Energy Calculator
              </h5>
              <div class="card-text">
                <form @submit.prevent="fetchData">
                  <div class="form-group mb-3">
                    <label for="day">Select Day:</label>
                    <input type="number" id="day" v-model.number="day" required placeholder="Select a day"
                      class="form-control" />
                  </div>
                  <div class="form-group mb-3">
                    <label for="rate">Price Rate (R per kWh):</label>
                    <input type="number" id="rate" v-model.number="rate" step="0.01" placeholder="Enter price rate"
                      required class="form-control" />
                  </div>
                  <div class="form-group mb-3">
                    <label for="capacity">Energy Generated (kWh):</label>
                    <input type="number" id="capacity" v-model.number="capacity" step="0.01"
                      placeholder="Energy generated" readonly class="form-control" />
                  </div>
                  <div class="form-group mb-3">
                    <label for="energyUsed">Energy Used (kWh):</label>
                    <input type="number" id="energyUsed" v-model.number="energyUsed" step="0.01"
                      placeholder="Energy used" readonly class="form-control" />
                  </div>
                  <div class="button-group mb-3">
                    <button type="submit" class="btn btn-primary">
                      Fetch Data
                    </button>
                  </div>
                  <div class="pdf-button-group">
                    <button @click="exportToPDF" v-if="
                      isDataFetched &&
                      capacity !== null &&
                      energyUsed !== null &&
                      savedUnits !== null &&
                      totalMoneyEarned !== null
                    " class="btn btn-export">
                      Export as PDF
                    </button>
                  </div>
                </form>
              </div>

              <!-- Result -->

              <!-- Register -->
            </div>
          </div>
        </div>

        <div class="chart-card col-md-4 mb-4">
          <canvas v-if="isDataFetched" id="energyChart" width="200" height="200"></canvas>
        </div>

        <div class="chart-card col-md-4 mb-4">
          <div id="register" class="register" v-if="isDataFetched">
            <h2>Your Receipt</h2>
            <table>
              <tbody id="entries">
                <tr>
                  <td>Units</td>
                  <td>{{ savedUnits.toFixed(2) }} kWh</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Amount in Rands:</th>
                  <th id="total">
                    R {{ totalMoneyEarned.toFixed(2).replace(".", ",") }}
                  </th>
                </tr>
              </tfoot>
            </table>
            <div v-if="isDataFetched" class="result">{{ resultMessage }}</div>
          </div>
        </div>
        <!-- First Chart -->
        <div class="chart-card col-md-12 mb-4">
          <div class="card h-100 border-0 shadow">
            <div class="card-body p-3 bg-dark text-white rounded">
              <h5 class="h5 text-light text-start text-uppercase">
                Production
              </h5>
              <div class="card-text">
                <canvas id="myChart" height="325"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Chart -->
        <div class="chart-card col-md-12 mb-4">
          <div class="card h-100 border-0 shadow">
            <div class="card-body p-3 bg-dark text-white rounded">
              <h5 class="h5 text-light text-start text-uppercase">Cost</h5>
              <div class="card-text">
                <canvas id="mySecondChart" height="325"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Chart -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow">
            <div class="card-body p-3 bg-dark text-white rounded">
              <h5 class="h5 text-light text-uppercase text-start">
                Usage Estimate
              </h5>

              <div class="card-text">
                <canvas id="myThirdChart" height="325"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="our-partners pb-5 pt-5 mt-3 mb-3">
    <div class="our-partners-heading-container d-flex justify-content-center text-uppercase flex-wrap">
      <h1 class="our-partners-heading-our px-1 fw-bold">Our</h1>
      <h1 class="our-partners-heading-partner px-3 fw-bold">Partners</h1>
    </div>
    <div class="our-partners-sub-heading">
      <p class="our-partners-sub-heading-text">
        Companies contributing to the sustainability of our programme
      </p>
    </div>
    <div class="our-partners-companies d-flex justify-content-center">
      <div class="carousel-container">
        <div class="carousel-item">
          <img src="../assets/microsoft-logo.jpg" alt="Microsoft">
        </div>
        <div class="carousel-item">
          <img src="../assets/google-logo.jpg" alt="Google">
        </div>
        <div class="carousel-item">
          <img src="../assets/slack-logo.png" alt="Slack">
        </div>
        <div class="carousel-item">
          <img src="../assets/click-up-logo.png" alt="ClickUp">
        </div>
        <div class="carousel-item">
          <img src="../assets/suptask-logo.webp" alt="Suptask">
        </div>
        <div class="carousel-item">
          <img src="../assets/canva-logo.webp" alt="Canva">
        </div>
        <div class="carousel-item">
          <img src="../assets/mainwp-logo.png" alt="MainWP">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from "chart.js";
import jsPDF from "jspdf";
import { nextTick } from "vue";
import { mapState, mapActions } from "vuex";

Chart.register(...registerables);

export default {
  data() {
    return {
      day: "Day 1",
      rate: 1,
      isDataFetched: false,
      isVisible: false,
      isImageLoaded: false,
      errorMessage: "",
    };
  },
  computed: {
    ...mapState([
      "monthlyProduction",
      "monthlyConsumption",
      "unit",
      "sell",
      "dailyLabels",
      "dailyProductionData",
      "dailyConsumptionData",
      "dayData",
      "capacity",
      "energyUsed",
      "totalMoneyEarned",
    ]),
    savedUnits() {
      return this.capacity - this.energyUsed;
    },
    resultMessage() {
      if (this.capacity !== null && this.energyUsed !== null) {
        if (this.savedUnits <= 0) {
          return "You did not generate enough energy to receive any payment.";
        } else {
          return `Energy Generated: ${this.capacity.toFixed(
            2
          )} kWh, Energy Used: ${this.energyUsed.toFixed(
            2
          )} kWh. Units Sent Back: ${this.savedUnits.toFixed(
            2
          )} kWh. Amount Paid Back: R ${this.totalMoneyEarned
            .toFixed(2)
            .replace(".", ",")}`;
        }
      }
      return "";
    },
  },
  methods: {
    ...mapActions(["fetchData", "calculateReturn", "fetchInverterData"]),

    async fetchData() {
      if (!this.day) {
        this.errorMessage = "Please select a day.";
        this.isDataFetched = false;
        return;
      }
      try {
        console.log("Fetching data for day:", this.day);
        await this.$store.dispatch("fetchData", this.day);
        this.$store.commit("SET_RATE", this.rate);
        await this.calculateReturn();
        this.isDataFetched = true;
        await nextTick();
        this.updateChart();
      } catch (error) {
        console.error("Error fetching data:", error);
        this.errorMessage = `Error fetching data: ${error.response?.data?.message || error.message
          }`;
        this.isDataFetched = false;
      }
    },

    async calculateReturn() {
      try {
        await this.$store.dispatch("calculateReturn");
      } catch (error) {
        console.error("Error calculating return:", error);
      }
    },

    updateChart() {
      const canvas = document.getElementById("energyChart");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (this.chart) {
            this.chart.destroy();
          }
          this.chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["Energy Generated", "Energy Used", "Excess Energy"],
              datasets: [
                {
                  label: "Energy (kWh)",
                  data: [this.capacity, this.energyUsed, this.savedUnits],
                  backgroundColor: ["#3498DB", "#2980B9", "#1ABC9C"],
                  borderColor: ["#3498DB", "#2980B9", "#1ABC9C"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        } else {
          console.error("Unable to get canvas context for energyChart.");
        }
      } else {
        console.error("Canvas element not found for energyChart.");
      }
    },

    initChart() {
      const ctx1 = document.getElementById("myChart");
      if (ctx1) {
        this.myChart = new Chart(ctx1, {
          type: "doughnut",
          data: {
            labels: ["Solar Production", "Consumption"],
            datasets: [
              {
                data: [this.monthlyProduction, this.monthlyConsumption],
                backgroundColor: ["rgb(255, 255, 1)", "rgb(255, 0, 0)"],
                borderColor: ["rgb(255, 255, 1)", "rgb(255, 0, 0)"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#FFFFFF",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} kwh`;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for myChart.");
      }

      const ctx2 = document.getElementById("mySecondChart");
      if (ctx2) {
        this.mySecondChart = new Chart(ctx2, {
          type: "bar",
          data: {
            labels: this.dailyLabels,
            datasets: [
              {
                label: "Production",
                data: this.dailyProductionData,
                backgroundColor: "rgb(0, 172, 0)",
                borderColor: "rgb(0, 172, 0)",
                borderWidth: 1,
              },
              {
                label: "Consumption",
                data: this.dailyConsumptionData,
                backgroundColor: "rgb(255, 0, 0)",
                borderColor: "rgb(255, 0, 0)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#FFFFFF",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} kwh`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#FFFFFF",
                },
              },
              x: {
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#FFFFFF",
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for mySecondChart.");
      }

      const ctx3 = document.getElementById("myThirdChart");
      if (ctx3) {
        this.myThirdChart = new Chart(ctx3, {
          type: "line",
          data: {
            labels: this.dailyLabels,
            datasets: [
              {
                label: "Production",
                data: this.dailyProductionData,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                pointBackgroundColor: "rgb(75, 192, 192)",
                pointBorderColor: "rgb(255, 255, 255)",
                pointBorderWidth: 2,
              },
              {
                label: "Consumption",
                data: this.dailyConsumptionData,
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "rgb(255, 255, 255)",
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#FFFFFF",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} kWh`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  color: "#444444",
                },
                ticks: {
                  color: "#FFFFFF",
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#FFFFFF",
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for myThirdChart.");
      }
    },

    startAnimation() {
      this.isVisible = true;
      this.isImageLoaded = true;
    },

    exportToPDF() {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Energy Calculator Report", 10, 20);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(10, 25, 200, 25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 35);
      doc.text(`Day: ${this.day || "N/A"}`, 10, 45);
      doc.text(`Price Rate: R ${this.rate.toFixed(2)}`, 10, 55);
      const dataYStart = 65;
      doc.text(
        `Capacity: ${this.capacity?.toFixed(2) || "N/A"} kWh`,
        10,

        dataYStart
      );
      doc.text(
        `Energy Used: ${this.energyUsed?.toFixed(2) || "N/A"} kWh`,
        10,
        dataYStart + 10
      );
      doc.text(
        `Saved Units: ${this.savedUnits?.toFixed(2) || "N/A"} kWh`,
        10,
        dataYStart + 20
      );
      doc.text(
        `Amount Paid Back: R ${this.totalMoneyEarned?.toFixed(2).replace(".", ",") || "N/A"
        }`,
        10,
        dataYStart + 30
      );
      if (this.isImageLoaded) {
        const addChartImage = (chartId, yOffset) => {
          const canvas = document.getElementById(chartId);
          if (canvas) {
            doc.addImage(
              canvas.toDataURL("image/png"),
              "PNG",
              10,
              yOffset,
              180,
              90
            );
          } else {
            console.error(`Canvas element not found for ${chartId}.`);
          }
        };
        addChartImage("myChart", dataYStart + 40);
        addChartImage("mySecondChart", dataYStart + 130);
        addChartImage("myThirdChart", dataYStart + 220);
      }
      doc.save(
        `Energy_Calculator_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );
    },
  },

  async mounted() {
    await this.fetchInverterData();
    await this.fetchData();
    this.initChart();
  },

  watch: {
    capacity() {
      this.updateChart();
    },
    energyUsed() {
      this.updateChart();
    },
  },
};
</script>

<style scoped>
/* Home Section */
.home {
  position: relative;
  overflow: hidden;
  color: #fff;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../assets/AdobeStock_519445978-scaled.jpeg.webp") no-repeat center center fixed;
  background-size: cover;
  animation: homeBackground 15s ease-in-out infinite;
}

@keyframes homeBackground {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.home img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.8);
  transition: filter 2s ease-in-out, opacity 2s ease-in-out;
}

.home .fadeIn {
  filter: grayscale(0);
  opacity: 1;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  text-align: center;
  color: #fff;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 1s ease-in-out, transform 2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
}

.text-overlay h1 {
  font-size: 5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.text-overlay p {
  font-size: 1.5rem;
}

/* PowerTrack About Section */
.powertrack-about {
  background-color: #fff;
  padding: 3rem 1rem;
  position: relative;
  overflow: hidden;
}

.heading-container {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.heading-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #00bcd4, #ffffff, #00bcd4);
  background-size: 200% 100%;
  animation: headingGlow 2s infinite;
}

@keyframes headingGlow {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 100%;
  }
}

.heading-container h1 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
}

.text-success {
  color: green;
}

/* Energy Dashboard Section */
.energy-dashboard-section {
  background: linear-gradient(135deg, #1d1d1d, #333);
  margin: 1.5rem auto;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;
}

.energy-dashboard-section::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
  animation: pulse 20s infinite ease-in-out;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.2;
  }

  50% {
    transform: scale(1);
    opacity: 0.8;
  }

  100% {
    transform: scale(0.8);
    opacity: 0.2;
  }
}

.dashboard-heading {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  position: relative;
  color: #e0e0e0;
}

/* Navbar Section */
.navbar {
  background-color: #343a40;
  border-radius: 0.5rem;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.navbar::before {
  content: "";
  position: absolute;
  top: -8px;
  left: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  border: 2px solid #00bcd4;
  border-radius: 0.5rem;
  pointer-events: none;
  opacity: 0.5;
  z-index: -1;
  animation: borderGlow 2s infinite;
}

@keyframes borderGlow {
  0% {
    border-color: #00bcd4;
  }

  50% {
    border-color: #ffffff;
  }

  100% {
    border-color: #00bcd4;
  }
}

.nav-item.active .nav-link {
  color: #fff;
  background-color: #00bcd4;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: #fff;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link:hover {
  color: #00bcd4;
  background-color: #454d55;
}

/* Chart Cards */
.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-card {
  flex: 1 1 calc(33.333% - 1rem);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: cardFloat 5s ease-in-out infinite;
}

@keyframes cardFloat {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }

  100% {
    transform: translateY(0);
  }
}

.card {
  border: none;
  overflow: hidden;
}

.card-body {
  padding: 1.5rem;
  position: relative;
}

.card-text {
  margin-top: 1rem;
}

.card-title {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

/* Our Partners Section */
.our-partners-companies {
  margin: 2rem;
  position: relative;
}

.our-partners-heading-partner {
  color: rgb(88, 190, 190);
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 1rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  display: inline-block;
  margin-right: 1rem;
  position: relative;
  animation: carouselMove 20s linear infinite;
}

.carousel-item img {
  filter: grayscale(0.5);
  display: block;
  height: auto;
  max-height: 105px;
  transition: filter 0.3s ease, transform 0.3s ease;
}

.carousel-item:hover img {
  filter: grayscale(0);
  transform: scale(1.05);
}

@keyframes carouselMove {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-20%);
  }
}

.energy-calculator {
  position: relative;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  margin: 40px auto;
  z-index: 1;
  text-align: left;
  backdrop-filter: blur(15px);
}

.energy-calculator h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
  background: #f9f9f9;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input::placeholder {
  color: #aaa;
}

.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.button-group {
  margin-top: 20px;
}

.pdf-button-group {
  margin-top: 20px;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-export {
  background: #f39c12;
  color: #fff;
}

.btn-export:hover {
  background: #e67e22;
}

.result,
#error,
.success {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

#error {
  color: #e74c3c;
}

.success {
  color: #2ecc71;
}

.register {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table,
th,
td {
  border: 1px solid #555;
}

th,
td {
  padding: 12px;
  text-align: left;
  font-size: 16px;
}

th {
  background: #444;
  color: white;
}

td {
  background: #333;
  color: #eee;
}

tfoot {
  background: #444;
  color: white;
  font-weight: 700;
}

@media (max-width: 768px) {
  .energy-calculator {
    padding: 20px;
    margin: 20px;
  }

  .energy-calculator h2 {
    font-size: 2rem;
  }

  .form-group input {
    font-size: 14px;
  }

  button {
    font-size: 14px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .text-overlay {
    left: 50%;
    bottom: 25%;
    transform: translateX(-50%);
    max-width: 90%;
    padding: 1rem;
  }

  .text-overlay h1 {
    font-size: 2rem;
  }

  .text-overlay p {
    font-size: 1rem;
  }

  .chart-container {
    flex-direction: column;
  }

  .chart-card {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .text-overlay h1 {
    font-size: 1.75rem;
  }

  .text-overlay p {
    font-size: 0.9rem;
  }

  .navbar {
    border-radius: 0;
  }

  .chart-card {
    flex: 1 1 100%;
  }
}

.form-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-group {
  flex: 1;
  min-width: calc(33.333% - 10px);
  box-sizing: border-box;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 15px;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #ff9900;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #ffcc00;
  outline: none;
  box-shadow: 0 0 5px rgba(255, 204, 0, 0.5);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

button {
  background-color: #ff9900;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffcc00;
}

.result {
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #ffcc00;
  text-align: center;
}

#error {
  color: #ff9900;
  font-size: 16px;
  font-weight: 500;
}

.success {
  color: #ffcc00;
  font-size: 16px;
  font-weight: 500;
}

#register {
  width: 100%;
  max-width: 600px;
}

#ticket {
  background: #ffffff;
  color: black;
  margin: auto;
  padding: 1em;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
}

#ticket h1 {
  text-align: center;
  color: #ff9900;
}

#ticket table {
  font-family: "Courier New", Courier, monospace;
  width: 100%;
  border-collapse: collapse;
}

#ticket td,
#ticket th {
  padding: 8px;
}

#ticket th {
  text-align: left;
  background-color: #f7f7f7;
}

#ticket td,
#ticket #total {
  text-align: left;
}

#ticket tfoot th {
  border-top: 1px solid #ddd;
  font-size: 14px;
  background-color: #f7f7f7;
}

/* media queries */
@media (max-width: 768px) {
  .text-overlay {
    left: 50%;
    bottom: 50%;
    transform: translateX(-50%);
    text-align: center;
    max-width: 400px;
  }

  h1.display-3 {
    font-size: 2.25rem;
  }

  p.display-6 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  h1.display-3 {
    font-size: 1.75rem;
  }

  p.display-6 {
    font-size: 1rem;
  }
}
</style>