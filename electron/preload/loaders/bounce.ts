/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
export default {
  html: `
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    `,
  style: `
   .spinner {
      width: 40px;
      height: 40px;
      position: relative;
      margin: 100px auto;
    }

    .double-bounce1,
    .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-animation: sk-bounce 2s infinite ease-in-out;
      animation: sk-bounce 2s infinite ease-in-out;
    }

    .double-bounce2 {
      -webkit-animation-delay: -1s;
      animation-delay: -1s;
    }

    @-webkit-keyframes sk-bounce {
      0%,
      100% {
        -webkit-transform: scale(0);
      }
      50% {
        -webkit-transform: scale(1);
      }
    }

    @keyframes sk-bounce {
      0%,
      100% {
        transform: scale(0);
        -webkit-transform: scale(0);
      }
      50% {
        transform: scale(1);
        -webkit-transform: scale(1);
      }
    }
    `,
}
