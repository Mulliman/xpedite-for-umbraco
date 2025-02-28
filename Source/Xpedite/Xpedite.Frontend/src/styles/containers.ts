import { css } from "lit";
import { backgroundGradientDark, ColourStyles, mainGreenCss } from "./colours";

export const ContainerStyles = [
    ColourStyles,
    css`

    .primary-container {
        background:${backgroundGradientDark};
        border: 10px solid ${mainGreenCss};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 1rem;
        margin-bottom: 2rem;
        box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
        border-radius: var(--uui-border-radius, 3px);
        border-radius: 15px;

        .logo {
            margin-top: calc(-1rem - 33px);
            text-align: center;

            img{
                display: inline-block;
                max-height: 80px;
            }
        }

        h1{
            margin-top: 0;
        }
    }
`];