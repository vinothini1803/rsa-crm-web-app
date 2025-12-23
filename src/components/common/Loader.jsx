import {PageLoader} from "../../utills/imgConstants";

const Loader = () => 
    <>
        <div className="loader-wrap">
            <div className="loader-content">
                <PageLoader className="loader-spinner" />
                {/* <img className="loader_logo" src={LoaderLogo} /> */}
            </div>
        </div>
    </>;

export default Loader;
