import { css, unsafeCSS } from "lit";

export const mainGreen = "#2B9088";
export const mainGreenCss = unsafeCSS(mainGreen);

export const lightGreen = "#92C98C";
export const lightGreenCss = unsafeCSS(lightGreen);

export const mainGreenTranslucent = "#2B908888";
export const mainGreenTranslucentCss = unsafeCSS(mainGreenTranslucent);

export const templatesColour = "#066784";
export const templatesColourCss = unsafeCSS(templatesColour);
export const partialsColour = "#2B9088";
export const partialsColourCss = unsafeCSS(partialsColour);
export const blocksColour = "#92C98C";
export const blocksColourCss = unsafeCSS(blocksColour);

export const buttonGradient = css`linear-gradient(to top right, ${unsafeCSS(templatesColour)}, ${unsafeCSS(mainGreen)})`;

export const headingGradientLight = css`linear-gradient(to top right, #31add3, #6dddd4, #d4f5d0)`;

export const backgroundGradientDark = css`linear-gradient(to right top, rgb(0, 10, 10) 65%, rgb(1, 27, 27))`;

export const ColourStyles = css`
    :root{
    }

    .x-text-gradient-light{
        color: white;
        background: ${headingGradientLight};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;