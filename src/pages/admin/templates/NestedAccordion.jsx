import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { set, useFieldArray, useFormContext } from "react-hook-form";
import {
  CollapseMinusIcon,
  CollapsePlusIcon,
  fileIcon,
} from "../../../utills/imgConstants";

const NestedAccordion = ({ nestedindex, nestedIndex, }) => {
  const { control,setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `templates.${nestedIndex}.children.${nestedindex}.child`,
  });
  console.log("nestedsubfeld", fields);
  const handleClick = (child) =>{
    console.log("child",child,)
    setValue("subject",child?.title)
  }
  return (
    <>
      {fields.map((item, k) => {
        return (
          <>
            <Accordion
              className="nested-accordion-header nested-tab-accordian"
              expandIcon={(options) => (
                <CollapsePlusIcon {...options.iconProps} />
              )}
              collapseIcon={(options) => (
                <CollapseMinusIcon {...options.iconProps} />
              )}
            >
              <AccordionTab
                key={item?.id}
                className="accordion-tab-border"
                header={
                  <div className="accordion-header">
                    <span className="accordion-title">{item.title}</span>
                  </div>
                }
              >
                <>
                {item?.subchild.map((child,index)=>{
                    return(
                        <div className="accordion-nested-headers" key={index} onClick={()=>handleClick(child)}>
                        <img src={fileIcon} alt="file-icon" />
                        <div className="accordion-title">{child?.title}</div>
                      </div>
                    )
                })}
                 
                </>
              </AccordionTab>
            </Accordion>
          </>
        );
      })}
    </>
  );
};
export default NestedAccordion;
