// import React, { useState } from "react";
// import Chart from "react-apexcharts";
// import "./components.less";

// const ServiceChart = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const services = [
//     { name: "Towing service", color: "black" },
//     { name: "Mechanical Service", color: "yellow" },
//     { name: "Other services", color: "grey" },
//   ];
//   const series = [23500, 23500, 23500];

//   return (
//     <div className="custom-card chart-card">
//       <div className="custom-card-header brder-bottom chart-header-padding d-flex align-items-center">
//         <div>Services</div>
//       </div>
//       <div className="custom-card-body chart-body-padding d-flex align-items-center">
//         <div className="h-100" style={{ width: "55%" }}>
//           <Chart
//             options={{
//               colors: ["#1A2E35", "#EAEAEA", "#FFCB6C"],
//               chart: {
//                 type: "donut",
//                 events: {
//                   dataPointMouseEnter: (event, chartContext, config) => {
//                     setHoveredIndex(config.dataPointIndex);
//                   },
//                   dataPointMouseLeave: () => {
//                     setHoveredIndex(null);
//                   },
//                 },
//               },
//               dataLabels: {
//                 enabled: false,
//               },
//               tooltip: {
//                 enabled: true,
//                 custom: ({ series, seriesIndex }) => {
//                   return `
//                     <div class="custom-tooltip">
//                       <span>${services[seriesIndex].name}</span>
//                       <span>${series[seriesIndex]} services</span>
//                     </div>
//                   `;
//                 },
//               },
//               grid: {
//                 padding: {
//                   top: 10,
//                 },
//               },
//               plotOptions: {
//                 pie: {
//                   customScale: 0.85,
//                   donut: {
//                     size: "130",
//                     labels: {
//                       show: true,
//                       total: {
//                         show: true,
//                         fontSize: "14px",
//                         label: "Total Services",
//                         formatter: () => 344412,
//                       },
//                     },
//                   },
//                 },
//               },
//               labels: [
//                 "Towing service",
//                 "Other services",
//                 "Mechanical Service",
//               ],
//               legend: {
//                 show: false,
//               },
//             }}
//             series={series}
//             type="donut"
//             width="100%"
//             height="100%"
//           />
//         </div>

//         <div className="service-summary-container">
//           {services?.map((service, i) => (
//             <div
//               className={`service-detail service-detail-${service.color} ${
//                 hoveredIndex === i ? "hovered" : ""
//               }`}
//               key={i}
//             >
//               <div className="service-detail-content">
//                 <div className="service-count">{series[i]}</div>
//                 <div className="service-name">{service.name}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceChart;
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./components.less";

const ServiceChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Example data structure returned from your API
  const dataFromAPI = {
    success: true,
    totalServices: 9,
    services: [
      {
        name: "Towing Service",
        count: 6,
      },
      {
        name: "Mechanical Service",
        count: 2,
      },
      {
        name: "Others Service",
        count: 1,
      },
    ],
  };

  // Map the API data to chart-friendly format
  const services = dataFromAPI.services.map(service => ({
    name: service.name,
    count: service.count,
    color: service.name === "Towing Service" ? "black" : 
           service.name === "Mechanical Service" ? "yellow" : "grey",
  }));

  const series = services.map(service => service.count);
  const labels = services.map(service => service.name);

  return (
    <div className="custom-card chart-card">
      <div className="custom-card-header brder-bottom chart-header-padding d-flex align-items-center">
        <div>Services</div>
      </div>
      <div className="custom-card-body chart-body-padding d-flex align-items-center">
        <div className="h-100" style={{ width: "55%" }}>
          <Chart
            options={{
              // colors: services.map(service => service.color), // Map dynamic colors
              colors: ["#1A2E35", "#EAEAEA", "#FFCB6C"],
              chart: {
                type: "donut",
                events: {
                  dataPointMouseEnter: (event, chartContext, config) => {
                    setHoveredIndex(config.dataPointIndex);
                  },
                  dataPointMouseLeave: () => {
                    setHoveredIndex(null);
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              tooltip: {
                enabled: true,
                custom: ({ series, seriesIndex }) => {
                  return `
                    <div class="custom-tooltip">
                      <span>${services[seriesIndex].name}</span>
                      <span>${series[seriesIndex]} services</span>
                    </div>
                  `;
                },
              },
              grid: {
                padding: {
                  top: 10,
                },
              },
              plotOptions: {
                pie: {
                  customScale: 0.85,
                  donut: {
                    size: "130",
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        fontSize: "14px",
                        label: "Total Services",
                        formatter: () => dataFromAPI.totalServices,
                      },
                    },
                  },
                },
              },
              labels: labels,
              legend: {
                show: false,
              },
            }}
            series={series}
            type="donut"
            width="100%"
            height="100%"
          />
        </div>

        <div className="service-summary-container">
          {services.map((service, i) => (
            <div
              className={`service-detail service-detail-${service.color} ${
                hoveredIndex === i ? "hovered" : ""
              }`}
              key={i}
            >
              <div className="service-detail-content">
                <div className="service-count">{series[i]}</div>
                <div className="service-name">{service.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceChart;
