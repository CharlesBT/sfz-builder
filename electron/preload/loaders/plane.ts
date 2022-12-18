export default {
  html: `
    <div class="spinner"></div>
    `,
  style: `
  .spinner {
      width: 40px;
      height: 40px;
      margin: 100px auto;
      background-color: #fff;
      -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
      animation: sk-rotateplane 1.2s infinite ease-in-out;
    }

    @-webkit-keyframes sk-rotateplane {
      0% {
        -webkit-transform: perspective(120px);
      }
      50% {
        -webkit-transform: perspective(120px) rotateY(180deg);
      }
      100% {
        -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg);
      }
    }

    @keyframes sk-rotateplane {
      0% {
        transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      }
      50% {
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      }
      100% {
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      }
    }
    `,
}
