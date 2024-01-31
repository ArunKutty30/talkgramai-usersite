import React from "react";
import Skeleton from "react-loading-skeleton";

const SessionCardLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index.toString()} style={{ height: "100px" }} />
      ))}
    </div>
  );
};

export default SessionCardLoader;
