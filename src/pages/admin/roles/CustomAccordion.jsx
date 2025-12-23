import React, { useCallback, useMemo, useState } from "react";
import { TreeFilterIcon } from "../../../utills/imgConstants";
import "./style.less";
import { Tree } from "primereact/tree";
import { useParams } from "react-router";

const CustomAccordion = ({ value, onSelectionChange, selectedIds }) => {
  console.log("value-SelectdIds", value, selectedIds);
  const { roleId } = useParams();

  const [selectedKeys, setSelectedKeys] = useState();

  console.log("selectedKeys", selectedKeys);

  // Construct Tree Data structure from API Data through value prop
  const convertToTreeData = (value, parentKey = null, subchildIndex = null) => {
    return value?.map((item, index) => {
      const key = parentKey !== null ? `${parentKey}-${index}` : `${index}`;
      const subKey =
        subchildIndex !== null ? `${subchildIndex}-${index}` : `${index}`;

      return {
        key: key,
        id: item?.id,
        label: item.name,
        children: item?.subChild
          ? item.subChild.map((subItem, subIndex) => ({
              id: subItem?.id,
              key: `${subKey}-${subIndex}`,
              label: subItem.name,
            }))
          : null,
        ...(item?.child
          ? {
              children: convertToTreeData(item?.child, key, subKey),
            }
          : {}),
      };
    });
  };
  const data = convertToTreeData(value);

  //Flat tree strucuture to get selected Ids
  const flatted = (array) => {
    return array?.reduce((acc, el) => {
      return acc?.concat(
        { key: el.key, id: el.id, label: el.label },
        el.children ? flatted(el.children) : []
      );
    }, []);
  };

  //Convert to select key structure from reconstructed Nested tree structure
  const convertToSelectKey = (newArray) => {
    console.log("convertykey array", newArray);
    return newArray?.reduce((acc, el) => {
      return {
        ...acc, // Previous 'acc' values
        [el.key]: {
          checked:
            el?.actualChildrenlength == el?.children?.length ? true : false,

          partialChecked:
            el?.children?.length > 0 &&
            el?.children?.length < el?.actualChildrenlength
              ? true
              : false,
        }, // New key-value pair
        ...(el?.children?.length > 0 ? convertToSelectKey(el?.children) : {}),
      };
    }, {});
  };

  //Reconstruct Nested tree structure from SelectedIds
  const reconstructNested = (flatArray, matchedIds) => {
    const filterarray = flatArray?.filter((item) =>
      matchedIds?.includes(item.id)
    );
    const newArray = filterarray?.map((item, i) => {
      return {
        key: item.key,
        id: item.id,
        label: item.label,
        actualChildrenlength: item?.children ? item?.children?.length : 0,
        children:
          item?.children?.length > 0
            ? reconstructNested(item?.children, matchedIds)
            : [],
      };
    });
    console.log("newArray", newArray);
    return newArray;
  };

  useMemo(() => {
    if (selectedIds) {
      console.log("this is editmode", roleId);
      console.log("selectedIds on memo", selectedIds);
      const NestedArray = reconstructNested(data, selectedIds);
      console.log("NestedArray", NestedArray);
      const SelectedKeys = convertToSelectKey(NestedArray);
      console.log("SelectedKeys on memo", SelectedKeys);
      setSelectedKeys(SelectedKeys);
    }
  }, [selectedIds]);

  const handleSelectionChange = (e) => {
    setSelectedKeys(e.value);

    const permissionIds = flatted(data)
      ?.filter((item) => Object.keys(e.value).includes(item.key))
      .reduce((acc, curr) => {
        return acc?.concat(curr.id);
      }, []);
    console.log("permissionIds", permissionIds);
    onSelectionChange(permissionIds);
  };

  return (
    <div>
      <Tree
        value={data}
        selectionMode="checkbox"
        selectionKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        filter
        filterPlaceholder="Search"
        filterIcon={(options) => <TreeFilterIcon {...options.iconProps} />}
      />
    </div>
  );
};

export default CustomAccordion;
