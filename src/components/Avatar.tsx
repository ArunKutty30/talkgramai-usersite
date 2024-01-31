import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import { userStore } from "../store/userStore";

interface IAvatarProps extends HTMLAttributes<HTMLDivElement> {
  username?: string | null;
  profileImg?: string;
  size?: number;
}

const Avatar: React.FC<IAvatarProps> = ({ size, style, username, profileImg, ...rest }) => {
  const user = userStore((store) => store.user);
  return (
    <StyledAvatar style={{ ...style, width: size, height: size }} size={size} {...rest}>
      {profileImg ? (
        <img src={profileImg} alt="" />
      ) : (
        <span>
          {username
            ? username.slice(0, 1)
            : user && user.displayName && user.displayName.slice(0, 1)}
        </span>
      )}
    </StyledAvatar>
  );
};

const StyledAvatar = styled.div<IAvatarProps>`
  width: 40px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--primary);
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  > span {
    font-size: ${(props) => (props.size ? `${props.size * 0.4}px` : "16px")};
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center !important;
  }
`;

export default React.memo(Avatar);
