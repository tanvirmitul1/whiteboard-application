import React, { useState, useEffect } from "react";
import { useSubmitReactionMutation } from "../../Apis/whiteboardApiSlice";
import useAuth from "../../customHooks/useAuth";

const reactionIcons = {
  like: "👍",
  love: "😍",
  laugh: "🤣",
  sad: "🙁",
  angry: "😡",
};

const Reactions = ({ whiteboard }) => {
  const { user } = useAuth();
  const [reactionCounts, setReactionCounts] = useState(
    whiteboard.reactions || {}
  );
  const [userReaction, setUserReaction] = useState(
    whiteboard.reactors.find((reactor) => reactor.userId === user._id)
      ?.reactionType || null
  );

  const [submitReaction] = useSubmitReactionMutation();

  const handleReaction = async (reactionType) => {
    try {
      await submitReaction({
        whiteboardId: whiteboard._id,
        reactionType,
        userId: user._id,
      }).unwrap();

      const sound = new Audio("/audio/waterDrop.mp3");
      sound.play();

      setReactionCounts((prevCounts) => {
        const newCounts = { ...prevCounts };

        if (userReaction) {
          // Decrement the previous reaction count
          newCounts[userReaction] = Math.max(
            (newCounts[userReaction] || 1) - 1,
            0
          );
        }

        // Increment the new reaction count
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;

        return newCounts;
      });

      // Update the user's current reaction
      setUserReaction(reactionType);
    } catch (error) {
      console.error("Error submitting reaction:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          color: "gray",
        }}
      >
        {Object.keys(reactionCounts).map((reactionType) => (
          <div
            key={reactionType}
            onClick={() => handleReaction(reactionType)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            {reactionIcons[reactionType]}
            <span>{reactionCounts[reactionType]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reactions;
