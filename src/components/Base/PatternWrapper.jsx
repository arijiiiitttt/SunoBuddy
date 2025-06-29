// Base/PatternWrapper.jsx
import React from 'react';
import styled from 'styled-components';

const PatternWrapper = ({ children }) => {
  return (
    <StyledWrapper>
      <div className="content-wrapper">{children}</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  background-color: transparent;
  background-image: radial-gradient(#000000 1px, #e5e5f7 1px);
  background-size: 30px 30px;

  .content-wrapper {
    position: relative;
    z-index: 10;
  }
`;

export default PatternWrapper;
