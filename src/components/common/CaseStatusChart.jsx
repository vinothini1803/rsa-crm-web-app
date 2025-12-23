import React from "react";
import PercentageBar from "./PercentageBar";
import {
  ArrowCircleIcon,
  AssignUserIcon,
  CircleTickIcon,
  ClockTickmarkIcon,
  ClockXMarkIcon,
  MoneyBillIcon,
  UserShieldYellowIcon,
  WomenIcon,
} from "../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from 'primereact/dropdown';


export const CaseLists = ({ items }) => (
  <>
    <div className="row row-gap-4_5">
      {items?.map((cases, i) => {
        return (
          <div className="col-md-3">
            <div className="case-lists">
              <div className="case-lists-left">
                <img
                  src={cases?.caseImg}
                  className="case-lists-img-bg"
                  style={{ backgroundColor: cases?.bgColor }}
                />
              </div>
              <div className="case-lists-right">
                <h4
                  className="case-lists-count"
                  style={{ color: cases?.color }}
                >
                  {cases.count}
                </h4>
                <span className="case-lists-title">{cases.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);
const CaseStatusChart = () => {



const defaultValues = {
    city: 'Today'
};

const {
    control,
    formState: { errors },
    handleSubmit,
    reset
} = useForm({ defaultValues });
const cities = [
  { name: 'Today', code: '123' },
  { name: 'Yesterday', code: 'RM' },
  { name: 'LastWeek', code: 'LDN' },
  { name: 'LastMonth', code: 'IST' },
  { name: 'LastYear', code: 'PRS' }
];
const onSubmit = () => {
  
}
  return (
    <div className="case-status-card chart-card">
      <div className="case-status-card-header d-flex align-items-center justify-content-between">
        <div>Case Status</div>
        <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column align-items-center gap-2">           
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required.' }}
                    render={({ field, fieldState }) => (
                            <Dropdown
                                id={field.name}
                                value={field.value}
                                optionLabel="name"
                                placeholder="Select a City"
                                options={cities}
                                onChange={(e) => field.onChange(e.value)}
                            />
                    )}
                />
               
            </form>
        </div>
      </div>
      <div className="case-status-card-body case-list">
        <PercentageBar
          items={[
            { label: "Not - Picked", value: 3, color: "#EA4335" },
            { label: "Not-Assigned", value: 3, color: "#EA4335" },
            { label: "SLA Violated", value: 3, color: "#EA4335" },
            { label: "Fuel", value: 3, color: "#EA4335" },
            { label: "Women Assist", value: 2, color: "#EA4335" },
            { label: "With in SLA", value: 8, color: "#4DB86B" },
            { label: "Picked", value: 8, color: "#0370F2" },
            { label: "ASP Assigned", value: 8, color: "#FECC3F" },
            { label: "Reimbursement", value: 8, color: "#A889E6" },
          ]}
        />  
        <div className="pt-4_5">
          <CaseLists
            items={[
              {
                label: "Not - Picked",
                count: 34,
                caseImg: ArrowCircleIcon,
                color: "#EA4335",
                bgColor: "#EA43351F",
              },
              {
                label: "Not-Assigned",
                count: 50,
                caseImg: AssignUserIcon,
                color: "#EA4335",
                bgColor: "#EA43351F",
              },
              {
                label: "SLA Violated",
                count: 30,
                caseImg: ClockXMarkIcon,
                color: "#EA4335",
                bgColor: "#EA43351F",
              },
              {
                label: "Fuel",
                count: 250,
                caseImg: WomenIcon,
                color: "#EA4335",
                bgColor: "#EA43351F",
              },

              {
                label: "With in SLA",
                count: 304,
                caseImg: ClockTickmarkIcon,
                color: "#1A2E35",
                bgColor: "#4DB86B24",
              },
              {
                label: "Picked",
                count: 200,
                caseImg: CircleTickIcon,
                color: "#1A2E35",
                bgColor: "#0370F21F",
              },
              {
                label: "ASP Assigned",
                count: 23,
                caseImg: UserShieldYellowIcon,
                color: "#1A2E35",
                bgColor: "#FECC3F24",
              },
              {
                label: "Reimbursement",
                count: 4,
                caseImg: MoneyBillIcon,
                color: "#1A2E35",
                bgColor: "#A889E624",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CaseStatusChart;
