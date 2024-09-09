<template>
    <div class="home">
        <img alt="background" :class="{ fadeIn: isImageLoaded }" src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
            @load="startAnimation" />
        <div id="app">
            <div class="container">
                <h1>Energy Calculator</h1>
                <div class="form-group-container">
                    <div class="form-group">
                        <label for="day">Select Day:</label>
                        <input type="number" id="day" v-model.number="day" />
                    </div>
                    <div class="form-group">
                        <label for="rate">Price Rate (R per kWh):</label>
                        <input type="number" id="rate" v-model.number="rate" step="0.01"
                            placeholder="Enter price rate" />
                    </div>
                    <div class="form-group">
                        <label for="capacity">Energy Generated (kWh):</label>
                        <input type="number" id="capacity" v-model.number="capacity" step="0.01"
                            placeholder="Enter energy generated" readonly />
                    </div>
                </div>
                <div class="form-group">
                    <label for="energyUsed">Energy Used (kWh):</label>
                    <input type="number" id="energyUsed" v-model.number="energyUsed" step="0.01"
                        placeholder="Enter energy used" readonly />
                </div>
                <div class="button-group">
                    <button @click="fetchData">Fetch Data</button>
                </div>
                <div class="result">{{ resultMessage }}</div>
                <canvas id="energyChart" width="400" height="200"></canvas>
            </div>

            <div id="register">
                <div id="ticket">
                    <h1>Your Receipt</h1>
                    <table>
                        <tbody id="entries">
                            <tr>
                                <td>Units Sent Back</td>
                                <td>{{ savedUnits.toFixed(2) }} kWh</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Amount Paid Back:</th>
                                <th id="total">
                                    R {{ totalMoneyEarned.toFixed(2).replace(".", ",") }}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Chart from "chart.js/auto";

export default {
    data() {
        return {
            day: null,
            rate: 1, // Initialize with a default value
            resultMessage: "",
        };
    },
    computed: {
        ...mapState(["capacity", "energyUsed", "totalMoneyEarned"]),
        savedUnits() {
            return this.capacity - this.energyUsed;
        },
        resultMessage() {
            if (this.capacity !== null && this.energyUsed !== null) {
                return `Energy Generated - ${this.capacity} kWh, Energy Used - ${this.energyUsed} kWh`;
            }
            return "";
        },
    },
    methods: {
        ...mapActions(["fetchData", "calculateReturn"]),
        async fetchData() {
            if (!this.day) {
                this.resultMessage = "Please select a day.";
                return;
            }

            try {
                await this.$store.dispatch("fetchData", this.day);
                // Update the rate in the Vuex store
                this.$store.commit("SET_RATE", this.rate);
                this.resultMessage = `Data fetched: Energy Generated: ${this.capacity} kWh, Energy Used: ${this.energyUsed} kWh`;
                this.calculateReturn();
                this.updateChart();
            } catch (error) {
                this.resultMessage = `Error fetching data: ${error.message}`;
            }
        },
        calculateReturn() {
            this.$store.dispatch("calculateReturn");
        },
        updateChart() {
            const ctx = document.getElementById("energyChart").getContext("2d");
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
                            backgroundColor: ["#FFCC00", "#FF9900", "#99CC00"],
                            borderColor: ["#FFCC00", "#FF9900", "#99CC00"],
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
        },
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
.home {
    position: relative;
    color: white;
}

img {
    filter: grayscale(1);
    transition: filter 2s ease-in;
    height: 100vh;
    width: 100%;
    object-fit: cover;
    position: absolute;
    /* Ensure the image is positioned absolutely */
    top: 0;
    left: 0;
    z-index: 1;
    /* Send image behind the content */
}

img.fadeIn {
    filter: grayscale(0);
}

#app {
    position: relative;
    /* Position relative to allow stacking on top of image */
    z-index: 2;
    /* Ensure the content is on top of the image */
    width: 100%;
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    justify-content: center;
}

.container {
    justify-content: center;
    background: #FFFFFF;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: auto;
    max-width: 600px;
    box-sizing: border-box;
    margin: 10px;
}

h1 {
    color: #FF9900;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(90deg, #FFCC00, #FF9900);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    color: #FF9900;
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
    border-color: #FFCC00;
    outline: none;
    box-shadow: 0 0 5px rgba(255, 204, 0, 0.5);
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 8px;
}

button {
    background-color: #FF9900;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #FFCC00;
}

.result {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #FFCC00;
    text-align: center;
}

#error {
    color: #FF9900;
    font-size: 16px;
    font-weight: 500;
}

.success {
    color: #FFCC00;
    font-size: 16px;
    font-weight: 500;
}

#register {
    width: 100%;
    max-width: 600px;
}

#ticket {
    background: #FFFFFF;
    color: black;
    margin: auto;
    padding: 1em;
    border-radius: 12px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
    width: 100%;
    max-width: 500px;
}

#ticket h1 {
    text-align: center;
    color: #FF9900;
}

#ticket table {
    font-family: 'Courier New', Courier, monospace;
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
</style>