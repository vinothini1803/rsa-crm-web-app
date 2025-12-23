import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import {
  CollapseMinusIcon,
  CollapsePlusIcon,
} from "../../../utills/imgConstants";
import { useFieldArray, useFormContext } from "react-hook-form";
import TemplateNestedAccordion from "./TemplateNestedAccordion";
import "./style.less"

const TemplateCustomAccordion = ({setValue}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "templates",
  });
  console.log("templates", fields);
  return (
    <>
      {fields?.map((item, index) => {
        return (
          <div>
            <Accordion
              className="template-accordion-header template-tab-accordian"
              expandIcon={(options) => (
                <CollapsePlusIcon {...options.iconProps} />
              )}
              collapseIcon={(options) => (
                <CollapseMinusIcon {...options.iconProps} />
              )}
              
            >
              <AccordionTab
                header={
                  <div className="accordion-headers" key={item?.id}>
                    <span className="accordion-title">{item?.title}</span>
                  </div>
                }
              >
                <TemplateNestedAccordion nestedIndex = {index} setValue={setValue}/>
              </AccordionTab>
              
            </Accordion>
          </div>
        );
      })}
    </>
  );
};

export default TemplateCustomAccordion;
