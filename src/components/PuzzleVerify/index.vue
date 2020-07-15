<template>
  <div class="puzzle-wrapper">
    <div class="puzzle-zone">
      <!-- 整个拼图背景图 -->
      <canvas ref="puzzle" />
      <!-- 拼图碎片形状的白色遮盖块 -->
      <canvas ref="occlusion" class="occlusion" />
      <!-- 拼图碎片 -->
      <canvas
        ref="puzzlePieces"
        class="puzzle-pieces"
        :style="{ left: `${position.puzzlePiecesLeft}px` }"
      />
    </div>

    <div class="operator-zone">
      <div
        class="failed-tip"
        v-if="verifiedStatus === this.VerifyStatus.Failed"
      >
        验证失败，请再试一次
      </div>
      <div class="operator-bar"></div>
      <div
        class="operator-block"
        :style="{ left: `${position.operatorBlockLeft}px` }"
        @mousedown.prevent="handleMouseDown"
        @mousemove.prevent="handleMouseMove"
        @mouseup.prevent="handleMouseUp"
        @mouseleave.prevent="handleMouseLeave"
      ></div>
    </div>
  </div>
</template>

<script>
import { getRandomInt } from '^/getRandomInt';
import lute from '#/images/PuzzleVerify/lute.jpg';
import coffe from '#/images/PuzzleVerify/coffe.png';
import piano from '#/images/PuzzleVerify/piano.jpg';

export default {
  data() {
    return {
      position: {
        /**
         * 拼图碎片的左偏移量
         */
        puzzlePiecesLeft: 0,

        /**
         * 白色部分的左偏移量
         */
        operatorBlockLeft: 0,
      },

      /**
       * 验证状态，初始化为未验证
       */
      verifiedStatus: 0,
    };
  },

  computed: {
    /**
     * 从三张图片中随机选取一张
     */
    puzzleImg() {
      /**
       * 随机选择三张图片中的一张
       */
      const order = getRandomInt(0, 2);

      return [lute, coffe, piano].map((url) => {
        let img = new Image();
        img.src = url;
        return img;
      })[order];
    },
  },

  methods: {
    /**
     * 在canvas实例上生成拼图碎片的轮廓的剪切路径
     * @param ctx canvas实例
     * @param x 拼图碎片左上角横坐标
     * @param y 拼图碎片左上角纵坐标
     * @param l 拼图碎片的边长
     * @param r 拼图碎片的圆形凸起的半径
     */
    clipCtx(ctx, x, y, l = 40, r = 10, PI = Math.PI) {
      // ctx.beginPath();
      // ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
      // ctx.clip();
      // ctx.globalCompositeOperation = 'overlay';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
      ctx.lineTo(x + l, y + l);
      ctx.lineTo(x, y + l);
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
      ctx.lineTo(x, y);
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.clip();
      ctx.globalCompositeOperation = 'overlay';
    },

    /**
     * 绘制完整的拼图背景
     */
    drawPuzzle() {
      const puzzleCanvas = this.$refs.puzzle;
      const ctx1 = puzzleCanvas.getContext('2d');

      puzzleCanvas.width = 400;
      puzzleCanvas.height = 300;
      ctx1.drawImage(this.puzzleImg, 0, 0);
    },

    /**
     * 绘制的拼图碎片
     */
    drawPuzzlePieces(x, y) {
      const puzzlePiecesCanvas = this.$refs.puzzlePieces;
      const ctx = puzzlePiecesCanvas.getContext('2d');

      puzzlePiecesCanvas.width = 400;
      puzzlePiecesCanvas.height = 300;

      this.clipCtx(ctx, x, y);
      ctx.stroke();
      ctx.drawImage(this.puzzleImg, 0, 0);
    },

    /**
     * 绘制的拼图碎片
     */
    drawOcclusion(x, y) {
      const occlusionCanvas = this.$refs.occlusion;
      const ctx = occlusionCanvas.getContext('2d');

      occlusionCanvas.width = 400;
      occlusionCanvas.height = 300;

      this.clipCtx(ctx, x, y);
      ctx.fill();
      ctx.drawImage(this.puzzleImg, 0, 0);
    },

    /**
     * 绘制整个拼图区域
     */
    draw() {
      /**
       * 防止图片未加载完成时，canvas就开始绘制导致图片显示不出
       */
      this.puzzleImg.onload = () => {
        /**
         * 保证碎片在拼图之内，并且距离左边框有一定距离
         */
        const x = getRandomInt(100, 340);
        const y = getRandomInt(60, 240);

        /**
         * 设置拼图碎片贴在左边框上
         */
        this.position.puzzlePiecesLeft = -x;

        /**
         * 记录拼图碎片的初始偏移量
         */
        this.initPuzzlePiecesLeft = -x;

        this.drawPuzzle();
        this.drawOcclusion(x, y);
        this.drawPuzzlePieces(x, y);
      };
    },

    /**
     * 拖拽时 点击鼠标的第一下
     */
    handleMouseDown(e) {
      /**
       * 设置拖拽状态和横坐标
       */
      if (
        this.position.operatorBlockLeft >= 0 &&
        this.position.operatorBlockLeft <= 340
      ) {
        this.dragConfig = {
          isDragging: true,
          initX: e.offsetX,
        };
        this.verifiedStatus = this.VerifyStatus.Unverified;
      }
    },

    /**
     * 鼠标移动
     */
    handleMouseMove(e) {
      if (this.dragConfig.isDragging) {
        /**
         * 越界不可拖动
         */
        if (
          this.position.operatorBlockLeft < 0 ||
          this.position.operatorBlockLeft > 340
        ) {
          this.dragConfig.isDragging = false;
        }

        /**
         * 拖动的距离
         */
        const offsetX = e.offsetX - this.dragConfig.initX;

        /**
         * 移动操作块和拼图碎片
         */
        this.position.puzzlePiecesLeft += offsetX;
        this.position.operatorBlockLeft += offsetX;

        /**
         * 越出左边界处理
         */
        if (this.position.operatorBlockLeft < 0) {
          this.position.puzzlePiecesLeft = this.initPuzzlePiecesLeft;
          this.position.operatorBlockLeft = 0;
        }

        /**
         * 越出右边界情况
         */
        if (this.position.operatorBlockLeft > 340) {
          this.position.puzzlePiecesLeft = this.initPuzzlePiecesLeft + 340;
          this.position.operatorBlockLeft = 340;
        }
      }
    },

    /**
     * 拖拽完成后 松开鼠标
     */
    handleMouseUp(e) {
      const {
        position: { operatorBlockLeft },
        initPuzzlePiecesLeft,
      } = this;

      this.dragConfig = {
        isDragging: false,
        initX: 0,
      };

      /**
       * 当拼图碎片被移到接近位置时，设置验证状态为通过，并抛出验证状态
       * 验证未通过时，初始化位置，提示验证失败，并重新验证
       */
      if (
        operatorBlockLeft > -initPuzzlePiecesLeft - 5 &&
        operatorBlockLeft < -initPuzzlePiecesLeft + 5
      ) {
        this.verified();
        this.$emit('verified', this.verifiedStatus);
      } else {
        this.verifyFailed();
        /**
         * 将拼图碎片位置初始化
         */
        this.position.puzzlePiecesLeft = this.initPuzzlePiecesLeft;

        /**
         * 将操作块位置初始化
         */
        this.position.operatorBlockLeft = 0;
      }
    },

    /**
     * 鼠标移出操作块
     */
    handleMouseLeave(e) {
      this.dragConfig = {
        isDragging: false,
        initX: 0,
      };
    },

    /**
     * 验证通过
     */
    verified() {
      this.verifiedStatus = this.VerifyStatus.Verified;
    },

    /**
     * 验证失败
     */
    verifyFailed() {
      this.verifiedStatus = this.VerifyStatus.Failed;
    },
  },

  created() {
    /**
     * 初始拖拽信息
     */
    this.dragConfig = {
      /**
       * 是否正在拖拽
       */
      isDragging: false,

      /**
       * 拖拽开始的横坐标
       */
      initX: 0,
    };

    /**
     * 拼图碎片的初始偏移量 会在draw()中得到初始值
     */
    this.initPuzzlePiecesLeft = 0;

    /**
     * 验证状态
     */
    this.VerifyStatus = {
      /**
       * 未验证
       */
      Unverified: 0,

      /**
       * 验证通过
       */
      Verified: 1,

      /**
       * 验证失败
       */
      Failed: 2,
    };
  },

  mounted() {
    this.draw();
  },
};
</script>

<style lang="scss" scoped>
.puzzle-wrapper {
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  background: #d5d5d5;

  .puzzle-zone {
    position: relative;

    .occlusion {
      position: absolute;
      top: 0;
    }

    .puzzle-pieces {
      position: absolute;
      top: 0;
    }
  }

  .operator-zone {
    position: relative;
    width: 400px;
    height: 40px;
    box-sizing: border-box;

    .failed-tip {
      position: absolute;
      top: -25px;
      height: 20px;
      padding-left: 10px;
      font-size: 12px;
      line-height: 20px;
      color: red;
    }

    .operator-bar {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      height: 10px;
      border-radius: 4px;
      background: #303030;
    }

    .operator-block {
      position: absolute;
      top: 0;
      width: 40px;
      height: 40px;
      background: #dee7fe;
      border-radius: 20px;
    }
  }
}
</style>
