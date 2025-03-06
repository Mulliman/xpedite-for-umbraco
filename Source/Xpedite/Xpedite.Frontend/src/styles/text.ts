import { css } from "lit";

// export const mainGreen = "#2B9088";
// export const mainGreenCss = unsafeCSS(mainGreen);

export const TextStyles = css`
  :root {
  }

  .x-completed {
  }

  .x-guide {
    h2{
        margin-top: var(--uui-size-space-2);
        margin-bottom: 0;
    }

    .intro{
        margin-top: 0.5rem;
        font-size: 1.1rem;
    }

    uui-icon {
      margin-top: var(--uui-size-space-6);
      font-size: 1.8rem;
    }

    uui-icon:first-child {
      margin-top: var(--uui-size-space-4);
      font-size: 2.2rem
    }

    h3.heading-below-icon {
      margin-top: var(--uui-size-space-4);
    }
  }
`;
