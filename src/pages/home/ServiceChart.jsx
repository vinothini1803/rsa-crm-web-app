// import React from "react";
// import Chart from "react-apexcharts";

// const ServiceChart = () => {
//   const services = [
//     { name: "Towing service", color: "black" },
//     { name: "Mechanical Service", color: "yellow" },
//     { name: "Other services", color: "grey" },
//   ];
//   const series = [23500, 23500, 23500];
//   console.log("window.innerHeight", window.innerHeight);
//   return (
//     <div className="custom-card chart-card  h-50">
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
//               },
//               dataLabels: {
//                 enabled: false,
//               },
//               tooltip: {
//                 enabled: false,
//               },
//               grid: {
//                 padding: {
//                   top: 10,
//                 },
//               },

//               plotOptions: {
//                 pie: {
//                   customScale: 0.85, //radius of pie based on width and height
//                   donut: {
//                     size: "130", //thickness of donut
//                     labels: {
//                       show: true,
//                       total: {
//                         show: true,
//                         showAlways: true,
//                         fontSize: "14px",
//                         fontFamily: "Poppins",
//                         fontWeight: 500,
//                         color: "#949494",
//                         label: "Total Services",
//                         formatter: (w) => {
//                           return 344412;
//                         },
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
//                 formatter: (seriesName, opts) => {
//                   console.log("legend", seriesName, opts);
//                   return seriesName;
//                 },
//               },
//             }}
//             series={series}
//             type="donut"
//             width={"100%"}
//             height={"100%"}
//           />
//         </div>

//         <div className="service-summary-container">
//           {services?.map((service, i) => (
//             <div className={`service-detail service-detail-${service.color}`}>
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
