import React from "react";
import Chart from "react-apexcharts";

const CaseChart = () => {
  return (
    <div className="custom-card chart-card h-50">
      <div className="custom-card-header chart-header-padding brder-bottom d-flex align-items-center">
        <div>Cases</div>
      </div>
      <div className="custom-card-body chart-body-padding">
        <Chart
          options={{
            markers: {
              colors: "#FECC3F",
            },
            stroke: {
              show: true,
              curve: "smooth",
              colors: ["#FECC3F"],
              width: 3,
            },
            fill: {
              colors: ["#FECC3F"],
              opacity: 0.14,
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.6,
              },
            },
            chart: {
              id: "Trip-Summary Chart",
              height: "390px",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false, // Disable zooming
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: [
                "8 AM",
                "10 AM",
                "12 PM",
                "2 PM",
                "4 PM",
                "6 PM",
                "8 PM",
              ],
              labels: {
                style: {
                  colors: ["#353C42"],
                  fontSize: "14px",

                  fontWeight: 500,
                  cssClass: "apexcharts-xaxis-label",
                },
              },
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              show: true,
              labels: {
                formatter: (value) => {
                  //console.log("value", value);
                  return value;
                },

                style: {
                  colors: ["#353C42"],
                  fontSize: "14px",

                  fontWeight: 500,
                  cssClass: "apexcharts-yaxis-label",
                },
              },
            },
            tooltip: {
              theme: "dark",
              
              marker: {
                show: true,
                fillColors:"#FECC3F"
              },
              x: {
                show: true,
                format: "dd MMM",
                formatter: () => "2 June 2021 12:00AM",
              },
              //formatter
            },
          }}
          series={[
            {
              name: "Case",
              data: [4, 6, 8, 3, 7, 2, 10],
            },
          ]}
          type="area"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CaseChart;
