import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { CloseIcon } from "../../utills/imgConstants";
import { getLatestUpdates } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";

const NewsBanner = () => {
  const [visible, setVisible] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(10);
  const scrollContentRef = useRef(null);
  const [updates, setUpdates] = useState([]);
  const user = useSelector(CurrentUser);
  const { data, isLoading } = useQuery(
    ["getLatestUpdates"],
    () => getLatestUpdates(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success && res?.data?.data?.length > 0) {
          setUpdates(res?.data?.data);
        }
      },
      onError: (err) => {
        console.error("Failed to fetch latest updates", err);
      },
    }
  );

  useEffect(() => {
    if (scrollContentRef.current) {
      const contentWidth = scrollContentRef.current.scrollWidth;
      const baseDuration = 10; // seconds for a full scroll
      const adjustedDuration = (contentWidth / 1000) * baseDuration; // Adjust based on content width
      setAnimationDuration(adjustedDuration);
    }
  }, [updates]);

  // console.log("data==>>", updates);
  const formatDescription = (description) => {
    // Split by the bullet symbol (•), remove extra spaces and empty strings
    const points = description
      ?.split("•")
      .map((point) => point.trim())
      .filter(Boolean);

    return points?.map((point, index) => (
      <span key={index} className="bullet-point">
        {index > 0 && " • "} {point}
      </span>
    ));
  };

  return (
    <>
      {visible && updates.length > 0 ? (
        <div className="news-banner">
          <div className="scroll-area">
            <div
              className="scroll-content"
              ref={scrollContentRef}
              style={{
                animationDuration: `${animationDuration}s`, // Apply dynamic animation duration
              }}
            >
              {updates.map((update) => (
                <span key={update?.id} style={{ marginRight: 40 }}>
                  <strong>{update?.title} -</strong>
                  {formatDescription(update?.description)}
                </span>
              ))}
            </div>
          </div>
          <button className="close-btn" onClick={() => setVisible(false)}>
            <img src={CloseIcon} alt="Close" />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default NewsBanner;
