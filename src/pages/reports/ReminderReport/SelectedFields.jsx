import React from "react";
import { DragDropIcon, RemoveIcon } from "../../../utills/imgConstants";
import Search from "../../../components/common/Search";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const SelectedFields = ({
  selectedFields,
  setSelectedFieldList,
  onChange,
  onSearchChange,
  onRemove,
  setOrderList
}) => {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);

  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newList = Array.from(selectedFields);
    const [movedTask] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedTask);
    setSelectedFieldList(newList);
    setOrderList(newList)
  };
  return (
    <div className="fields-container">
      <div className="fields-header">
        <Search
          placeholder={"Search"}
          expand={true}
          className={"report-field-search"}
          onChange={handleSearchChange}
        />
      </div>

      <div className="fields-body drag-fields-body">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="reportfield-list">
            {(provided, snapshot) => (
              <ul
                className="fields-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedFields?.map((field, i) => (
                  <Draggable
                    key={field.id}
                    draggableId={String(field?.id)}
                    index={i}
                    //isDragDisabled={searchQuery !== "" ? true : false}
                  >
                    {(provided, snapshot) => (
                      <li
                        key={i}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div
                          className={`field ${
                            snapshot.isDragging ? "dragging" : ""
                          }`}
                        >
                          <img src={DragDropIcon} alt={"dragdrop"} />
                          <div className="field-name">{field?.name}</div>
                          <button
                            className="ms-auto btn-link btn-bg-transparent"
                            onClick={() => onRemove(field)}
                          >
                            <img src={RemoveIcon} />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default SelectedFields;
