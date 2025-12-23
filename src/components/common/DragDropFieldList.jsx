import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import Search from "./Search";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DragDropIcon, EmptyReportIcon } from "../../utills/imgConstants";

const DragDropFieldList = ({
  fields,
  setReportFields,
  onSearchChange,
  onChange,
  onUnSelectAll,
  searchQuery,
  setAllReportFields,
}) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newList = Array.from(fields);
    const [movedTask] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedTask);

    setReportFields(newList);
    setAllReportFields(newList);
  };

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleChange = (e, index) => {
    onChange(index);
  };

  const handleUnSelectAll = (e) => {
    onUnSelectAll();
  };

  return (
    <div className="report-fieldlist-container">
      <div className="field-search-container">
        <Search
          placeholder={"Search Fields"}
          expand={true}
          className={"report-list-search"}
          onChange={handleSearchChange}
        />
      </div>

      {fields?.length === 0 ? (
        <div className="report-field-empty-container">
          <div className="empty-content-container">
            <img src={EmptyReportIcon} alt="Empty report" />
            <div className="empty-content">No headers selected</div>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="field-list">
            {(provided, snapshot) => (
              <div
                className={`report-field-list ${
                  snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {!searchQuery && (
                  <div className={"report-field"}>
                    <Checkbox onChange={handleUnSelectAll} />
                    <div className="field-name">Unselect All</div>
                  </div>
                )}
                {fields?.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={String(field?.id)}
                    index={index}
                    isDragDisabled={searchQuery !== "" ? true : false}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`report-field ${
                          snapshot.isDragging ? "dragging" : ""
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Checkbox
                          checked={field.checked}
                          onChange={(e) => handleChange(e, index)}
                        />
                        <div className="field-name">{field?.name}</div>
                        <div
                          className={`dragdrop-icon ${
                            searchQuery !== "" ? "disabled" : ""
                          }`}
                        >
                          <img src={DragDropIcon} alt={"dragdrop"} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default DragDropFieldList;
