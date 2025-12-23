import React, { useEffect, useState } from "react";
import { UpgradeIcon } from "../../../utills/imgConstants";
import { InputSwitch } from "primereact/inputswitch";
import { Chip } from 'primereact/chip';

const UpgradePolicyCard = ({ onUpgradeChange, upgradeChanged, policyAlreadyRequested, agentId,caseData }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = (e) => {
    setChecked(e.value);
    onUpgradeChange(e.value);
  };

  useEffect(() => {
    if (upgradeChanged !== undefined) {
      setChecked(upgradeChanged);
    }
  }, [upgradeChanged])

  return (
    <div className="upgrade-card">
      <div className="upgrade-card-header">
        <img src={UpgradeIcon} />
        <div className="upgrade-card-title-text">Upgrade</div>
        {policyAlreadyRequested ? (
          <Chip label="Membership Requested" className="info-chip blue ms-auto" />
        ) : (
          <div className="switch-container">
            <InputSwitch checked={checked} onChange={handleChange} disabled={agentId && caseData?.caseStatusId == 2 ? false : true}/>
          </div>
        )}
        
      </div>
      <div className="upgrade-card-content">
        Customer is interested in upgrading membership{policyAlreadyRequested ? '.' : '?'}
      </div>
    </div>
  );
};

export default UpgradePolicyCard;
