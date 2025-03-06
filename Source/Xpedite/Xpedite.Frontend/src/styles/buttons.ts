import { css } from "lit";
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

  .x-button-secondary {
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

  .x-button-tertiary {
    font-weight: bold;
    background: #ccc;
    padding: 5px 10px;
    color: black;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: ${buttonGradient};
      color: white !important;
    }
  }
`;
