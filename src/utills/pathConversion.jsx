import { MenuList } from "./menuList";

export const getPathArray = (path) => {
  // console.log("path array", path.split("/")[1]);
  const MenuItem = MenuList.map((group) => group.menus)
    .flat()
    .find((item) => item.code == path.split("/")[1]);
  // console.log("menuItem", MenuItem, path.split("/")?.length);
  const pathTitle =
    path.split("/")?.length >= 3
      ? MenuItem?.submenus?.find((item) => item?.url == path.split("/")[2])
          ?.label ?? MenuItem?.label
      : MenuItem?.label;

  return MenuItem == undefined
    ? path
        .split("/")[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : pathTitle;
};
