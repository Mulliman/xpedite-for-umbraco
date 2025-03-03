import { css } from "lit";
import { backgroundGradientDark, ColourStyles, mainGreenCss } from "./colours";

export const ContainerStyles = [
  ColourStyles,
  css`
    .contrained{
        max-width: 1600px;
        margin: 0 auto;
    }

    .primary-container {
      background: ${backgroundGradientDark};
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
      color: white;

      .logo {
        margin-top: calc(-1rem - 33px);
        text-align: center;

        img {
          display: inline-block;
          max-height: 80px;
        }
      }

      h1 {
        margin-top: 0;
      }
    }

    .secondary-container {
      background: ${backgroundGradientDark};
      border: 3px solid ${mainGreenCss};
      display: block;
      /* flex-direction: column;
      justify-content: stretch;
      align-items: center; */
      padding: 1rem;
      margin-bottom: 2rem;
      box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
      border-radius: var(--uui-border-radius, 3px);
      border-radius: 10px;
      color: white;

      .heading {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        uui-icon {
          padding: 0.5rem;
          font-size: 1.5rem;
          border-radius: 5px;
          background: ${mainGreenCss};
          /* margin-right: 0.5rem; */
        }

        h1, h2, h3 {
          padding: 0;
          margin: 0 0.5rem 0 0;
          /* vertical-align: middle; */
        }
      }

      .content {
        p{

            &:last-child{
                margin-bottom: 0;
            }
        }

      }
    }

    .x-actions {
        margin-top: 1rem;

        div{
            display: flex;
            flex-direction: row;
            align-items: center;
            width:100%;
            margin-top: 0.5rem;

            uui-icon{
                font-size: 1.5rem;
                margin-right: 0.5rem;
            }

            span {
                vertical-align: middle;
                margin-right: 0.5rem;
            }

            button, a{
                margin-left: auto;
            }
        }
    }
  `,
];
