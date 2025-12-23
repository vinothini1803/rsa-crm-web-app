import React from "react";
import {
  CollapseMinusIcon,
  CollapsePlusIcon,
  FolderDocumentIcon,
  fileIcon,
} from "../../../utills/imgConstants";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useFieldArray, useFormContext } from "react-hook-form";
import "./style.less";
import NestedAccordion from "./NestedAccordion";
const TemplateNestedAccordion = ({ nestedIndex,setValue }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `templates.${nestedIndex}.children`,
  });
  console.log("nested.feld", fields);
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
                    {item?.image && (
                      <img src={item?.image} alt={"folder_icon"} />
                    )}

                    <span className="accordion-title">{item.title}</span>
                  </div>
                }
              >
                {/* {console.log("fielditem",item)}
                <div className="accordion-nested-headers">
                    <img src={fileIcon} alt="file-icon" />
                <div className="accordion-title">title</div>
                </div> */}
               <NestedAccordion nestedindex={k} nestedIndex={nestedIndex} setValue={setValue}/>
              </AccordionTab>
            </Accordion>
          </>
        );
      })}
    </>
  );
};

export default TemplateNestedAccordion;

