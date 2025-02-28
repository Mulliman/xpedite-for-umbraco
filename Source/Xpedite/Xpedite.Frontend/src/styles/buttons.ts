import { css, unsafeCSS } from "lit";
import { buttonGradient } from "./colours";

// export const mainGreen = "#2B9088";
// export const mainGreenCss = unsafeCSS(mainGreen);

export const ButtonStyles = css`
  :root {
  }

  .x-button {
    font-weight: bold;
    background: ${buttonGradient};
    padding: 10px;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: #206063;
    }
  }
`;
