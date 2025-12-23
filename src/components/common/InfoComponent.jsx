import "./components.less";

const InfoComponent = ({ title, info, infoContentClass}) => {
  return (
    <div className="info-container">
      <div className="info-title">{title}</div>
      <div className={`info-content ${infoContentClass ?? ''}`}>{info}</div>
    </div>
  );
};
export default InfoComponent;
