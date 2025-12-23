import axios from "axios";

export const usersList = (data) => {
  return axios({
    url: "user/getList",
    method: "POST",
    data: data,
  });
};

export const deleteUser = (data) => {
  return axios({
    url: "user/delete",
    method: "POST",
    data: data,
  });
};

export const updateUserStatus = (data) => {
  return axios({
    url: "user/updateStatus",
    method: "POST",
    data: data,
  });
};
export const getUserFormData = (data) => {
  return axios({
    url: "user/getFormData",
    method: "GET",
    params: data,
  });
};

export const saveuser = (data) => {
  return axios({
    url: "user/save",
    method: "POST",
    data: data,
  });
};

export const aspList = (data) => {
  return axios({
    url: "master/asp",
    method: "GET",
    params: data,
  });
};

export const aspFormData = (data) => {
  return axios({
    url: "master/asp/getFormData",
    method: "GET",
    params: data,
  });
};

export const aspFilterData = () => {
  return axios({
    url: "master/asp/getFilterData",
    method: "GET",
  });
};

export const saveAsp = (data) => {
  return axios({
    url: "master/asp/save",
    method: "POST",
    data: data,
  });
};
export const deleteAsp = (data) => {
  return axios({
    url: "master/asp/delete",
    method: "POST",
    data: data,
  });
};

export const updateAspStatus = (data) => {
  return axios({
    url: "master/asp/updateStatus",
    method: "POST",
    data: data,
  });
};

export const viewASP = (data) => {
  return axios({
    url: "master/asp/getViewData",
    method: "GET",
    params: data,
  });
};

// Mechanics API
export const mechanicsList = (data) => {
  return axios({
    url: "master/aspMechanic/list",
    method: "GET",
    params: data,
  });
};
export const mechanicsFormData = (data) => {
  return axios({
    url: "master/aspMechanic/getFormData",
    method: "GET",
    params: data,
  });
}
export const updateMechanicStatus = (data) => {
  return axios({
    url: "master/aspMechanic/updateStatus",
    method: "PUT",
    data: data,
  });
};
export const saveMechanic = (data) => {
  return axios({
    url: "master/aspMechanic/save",
    method: "POST",
    data: data,
  });
}
export const deleteAspMechanics = (data) => {
  return axios({
    url: "master/aspMechanic/delete",
    method: "PUT",
    data: data,
  });
};
 
//ASP Mechanics Import and Export
export const aspMechanicImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/aspMechanicImport",
    data: data,
  });
};
 
export const aspMechanicExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/aspMechanicExport",
    data: data,
  });
};
//Own patrol vehicle Import and Export
export const ownPatrolVehicleImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicle/import",
    data: data,
  });
};
 
export const ownPatrolVehicleExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicle/export",
    data: data,
  });
};
//Own Patrol vehicle Helper Import and Export
export const ownPatrolHelperImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper/import",
    data: data,
  });
};
 
export const ownPatrolHelperExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper/export",
    data: data,
  });
};
//User Import
export const importUser = (data) => {
  return axios({
    method: "POST",
    url: "user/userImportMaster",
    data: data,
  });
};

//User Export

export const exportUser = (data) => {
  return axios({
    method: "POST",
    url: "user/userExportMaster",
    data: data,
  });
};

//user skill import
export const importUserSkill = (data) => {
  return axios({
    method: "POST",
    url: "user/userSkillImport",
    data: data,
  });
};

//user skill export
export const exportUserSkill = (data) => {
  return axios({
    method: "POST",
    url: "user/userSkillExport",
    data: data,
  });
};
//ASP Import
export const importASP = (data) => {
  return axios({
    method: "POST",
    url: "master/aspImportMaster",
    data: data,
  });
};

//ASP Export
export const exportASP = (data) => {
  return axios({
    method: "POST",
    url: "master/aspExportMaster",
    data: data,
  });
};
//ASP Mechanics Import and Export
// export const aspMechanicImportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/aspMechanicImport",
//     data: data,
//   });
// };

// export const aspMechanicExportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/aspMechanicExport",
//     data: data,
//   });
// };
//Own patrol vehicle Import and Export
// export const ownPatrolVehicleImportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/ownPatrolVehicle/import",
//     data: data,
//   });
// };

// export const ownPatrolVehicleExportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/ownPatrolVehicle/export",
//     data: data,
//   });
// };
//Own Patrol vehicle Helper Import and Export
// export const ownPatrolHelperImportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/ownPatrolVehicle/import",
//     data: data,
//   });
// };

// export const ownPatrolHelperExportMaster = (data) => {
//   return axios({
//     method: "POST",
//     url: "master/ownPatrolVehicle/export",
//     data: data,
//   });
// };
//vehicle master
export const getVehicleList = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicles",
    data: data,
  });
};

//get form data
export const getVehicleFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/ownPatrolVehicle/getFormData",
    params: data,
  });
};

export const saveVehicle= (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicle/save",
    data: data,
  });
};
//update status

export const updateVehicleStatus= (data) => {
  return axios({
    method: "PUT",
    url: "master/ownPatrolVehicle/updateStatus",
    data: data,
  });
};

export const deleteVehicle=(data)=>{
  return axios({
    method: "PUT",
    url: "master/ownPatrolVehicle/delete",
    data: data,
  });
};

export const gethelperlist = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper",
    data: data,
  });
};
export const updateHelperStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper/updateStatus",
    data: data,
  });
};

export const deleteHelper = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper/delete",
    data: data,
  });
};

export const saveHelper = (data) => {
  return axios({
    method: "POST",
    url: "master/ownPatrolVehicleHelper/save",
    data: data,
  });
};
//get form data
export const getHelperFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/ownPatrolVehicleHelper/getFormData",
    params: data,
  });
};

export const viewHelper = (data) => {
  return axios({
    method: "GET",
    url: "master/ownPatrolVehicleHelper/getViewData",
    params: data,
  });
};

export const viewVehicle=(data)=>{
  return axios({
    method: "GET",
    url: "master/ownPatrolVehicle/getViewData",
    params: data,
  });
}


//Replacement user
export const replacementUser = (data) => {
  return axios({
    method: "POST",
    url: "user/getUsersByManagerRole",
    data: data,
  });
};

//activity status
export const activityStatus=(data)=>{
  return axios({
    method: "GET",
    url: "master/activityStatus/getList",
    params: data,
  });
}