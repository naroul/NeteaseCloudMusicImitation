<template>
  <div
    class="player"
    id="p_player"
    @click.capture
    @mouseover.prevent="msOverPlayer"
    @mouseleave.prevent="msLeavePlayer"
    @mousemove.prevent="msMovePlayer"
    @mouseup.prevent="msUpPlayer"
  >
    <!-- 锁定操作区 -->
    <div class="lock-zone">
      <div class="lock">
        <i
          :class="['icn-lock', `${isLocked ? 'locked' : 'unlock'}`]"
          @click="controlLock"
        />
      </div>
    </div>

    <!-- 操作区 -->
    <transition name="slide">
      <div class="operator-zone" v-show="isShowPlayer">
        <div class="op-content">
          <!-- 三种按钮 -->
          <i class="iconfont icon-previous" @click="playPre" />
          <i
            :class="['iconfont', `${isPlaying ? 'icon-stop1' : 'icon-play3'}`]"
            @click="controlPlay"
          />
          <i class="iconfont icon-next" @click="playNext" />

          <!-- 歌曲封面 -->
          <div @click="linkToSongPage" class="music-cover">
            <img :src="curCoverUrl" />
          </div>

          <!-- 进度条区域 -->
          <div class="progress-zone">
            <div class="m-label">
              <!-- 歌名 -->
              <span
                class="m-name"
                v-if="songList.length"
                @click="linkToSongPage"
                :title="songList[curSongIndex].name"
              >
                {{ songList[curSongIndex].name }}
              </span>

              <!-- mv -->
              <i v-if="songList.length" class="iconfont icon-MV" />

              <!-- 歌手名 -->
              <span class="ar-name" v-if="songList.length">
                <LinkLabel type="artist" :id="songList[curSongIndex].author.id">
                  {{ songList[curSongIndex].author.name }}
                </LinkLabel>
              </span>

              <i
                v-if="
                  songList.length &&
                  songList[curSongIndex].source &&
                  songList[curSongIndex].source.id
                "
                :title="`来自于${songList[curSongIndex].source.type}`"
                class="iconfont icon-link"
              />
            </div>

            <!-- 进度条 -->
            <div class="progress-wrapper">
              <!-- 总进度条 -->
              <div class="total-progress" @click.stop="msClickPrgs"></div>
              <!-- 缓存进度条 -->
              <div
                class="buffered-progress"
                :style="{ width: `${widthBufferedPrgs}px` }"
                @click.stop="msClickPrgs"
              ></div>
              <!-- 播放进度条 -->
              <div
                class="play-progress"
                :style="{ width: `${widthPlayPrgs}px` }"
                @click.stop="msClickPrgs"
              ></div>
              <!-- 时间进度 -->
              <div class="time-progress">
                <span>{{ _formatMsToDuration(curTime) }}</span>
                / {{ _formatMsToDuration(duration) }}
              </div>
              <!-- 滑块 -->
              <div
                @mousedown.prevent="msDownSlider"
                class="slider"
                :style="{ left: `${offsetLeftSlider}px` }"
              ></div>
            </div>
          </div>

          <!-- 添加到歌单 -->
          <i class="iconfont icon-addfile" />

          <!-- 音量调节区域 -->
          <div class="icon-vol-wrapper" @mouseleave="msLeaveVol">
            <div class="vol-prgs" v-if="isShowVolConfig">
              <div class="prgs-invisible" @click="msClickVolPrgs"></div>
              <div
                class="prgs"
                @click="msClickVolPrgs"
                :style="{ height: `${volPrgsHeight}px` }"
              >
                <span
                  class="slider-vol"
                  @click.stop
                  @mousedown="msDownVolSlider"
                  @mousemove="msMoveVolSlider"
                  @mouseup="msUpVolSlider"
                ></span>
              </div>
            </div>
            <i
              :class="['icon-play-conf', 'iconfont', volIcon]"
              @click="controlVol"
            />
          </div>

          <!-- 播放模式 -->
          <div class="icon-mode-wrapper">
            <div class="mode-tip" v-show="isShowModeTip">
              {{ playModeConf.tip }}
            </div>
            <i
              :class="['icon-play-conf', 'iconfont', playModeConf.icon]"
              :title="playModeConf.tip"
              @click="modeSwitch"
            />
          </div>

          <!-- 歌曲数 -->
          <div class="song-count" @click="controlSongList">
            {{ songList.length }}
            <span class="tip" v-show="isShowStartPlayTip">已开始播放</span>
          </div>
        </div>
      </div>
    </transition>

    <div class="song-list" v-if="isShowSongList">
      <div class="listhd">
        <div class="listhdc">
          <h4>播放列表({{ songList.length }})</h4>

          <div class="s-collect">
            <i class="ico ico-add" />
            收藏全部
          </div>

          <span class="listhdc-line"></span>

          <div class="s-clear" @click="clearSongList">
            <i class="ico ico-del" />
            删除
          </div>

          <p class="listhdc-lytit" v-if="songList.length">
            {{ songList[curSongIndex].name }}
          </p>

          <span class="s-close" @click="closeSongList"></span>
        </div>
      </div>

      <div class="listbd">
        <img
          class="imgbg"
          :src="`//music.163.com/api/img/blur/${
            songList.length && songList[curSongIndex].picStr
          }`"
        />
        <!-- 歌曲列表区 -->
        <div class="msk"></div>
        <div class="listbdc">
          <!-- 不存在播放的歌曲时，显示提示 -->
          <div class="nocnt" v-if="!songList.length">
            <i class="ico ico-face"></i> 你还没有添加任何歌曲 <br />去首页
            <router-link to="/" class="f-tdu">发现音乐</router-link>，或在
            <router-link to="/music/mymusic" class="f-tdu">我的音乐</router-link
            >收听自己收藏的歌单。
          </div>

          <!-- 存在歌曲时，显示播放列表 -->
          <ul v-else>
            <li
              v-for="(song, index) of songList"
              :class="{ curBak: index === curSongIndex }"
              @click="playSelected(index)"
            >
              <!-- 播放按钮 -->
              <div
                :class="['col', 'col-1', { visible: index === curSongIndex }]"
              >
                <div class="playicn"></div>
              </div>

              <!-- 歌名 -->
              <div
                :class="['col', 'col-2', { 'col-cur': index === curSongIndex }]"
              >
                {{ song.name }}
              </div>

              <!-- 按钮区 -->
              <div class="col col-3">
                <div class="icns">
                  <!-- 删除 -->
                  <i class="ico ico-del"></i>
                  <!-- 下载 -->
                  <i class="ico ico-dl"></i>
                  <!-- 分享 -->
                  <i class="ico ico-share"></i>
                  <!-- 收藏 -->
                  <i class="ico ico-add"></i>
                </div>
              </div>

              <!-- 歌手 -->
              <div
                :class="['col', 'col-4', { 'col-cur': index === curSongIndex }]"
              >
                {{ song.author.name }}
              </div>

              <!-- 歌曲时长 -->
              <div
                :class="['col', 'col-5', { 'col-cur': index === curSongIndex }]"
              >
                {{ _formatMsToDuration(song.dt) }}
              </div>

              <!-- 来源 -->
              <div class="col col-6">
                <router-link
                  to="/"
                  :class="['ico', 'ico-src', { 'ico-nosrc': !song.source }]"
                  :title="`${
                    song.source && song.source.type
                      ? `来自于${song.source.type}`
                      : '暂无来源'
                  }`"
                ></router-link>
              </div>
            </li>
          </ul>
          <!-- 滚动条 -->
          <Scroll
            :position="{ right: '0px' }"
            :background="'#000'"
            :scrollTopProps="listbdcScrTop"
            @scr="listbdcScr"
          />
        </div>

        <!-- 歌词区 -->
        <div class="msk2"></div>
        <div class="listlyric">
          <div
            v-if="songList.length && lyric && lyric.cnts && !lyric.cnts.length"
            class="nocnt nolyric"
          >
            纯音乐，无歌词
          </div>

          <div
            ref="lyricCntWrp"
            v-if="lyric && lyric.cnts && lyric.cnts.length"
          >
            <p
              v-for="(cnt, index) of lyric.cnts"
              :class="['lyric-cnt', { 'lyric-cur': index === curLyricIndex }]"
            >
              {{ cnt }}
            </p>
          </div>

          <Scroll
            :key="reRenderLyricScr"
            :position="{ right: '0px' }"
            :scrollTopProps="lyricScrTop"
          />
        </div>
      </div>
    </div>

    <audio
      ref="audio"
      :src="curSongUrl"
      @timeupdate="updateCurTime"
      @progress="updateBuffered"
      @ended="endPlay"
    />
  </div>
</template>

<script>
import * as _ from "lodash";
import { formatMsToDuration } from "^/formatMsToDuration";
import { fix } from "^/fix";
import { debounce } from "^/debounce";
import { binarySearch } from "^/binarySearch";
import { formatLyric } from "^/formatLyric";
import { getRandomInt } from "^/getRandomInt";
import { isChildOfNodeById } from "^/isChildOfNodeById";
import { playerMixin } from "@/mixins";
import defaultCover from "#/images/Common/music.jpg";
import { getSongUrl, getLyric } from "@/apis/song";
import Scroll from "@/ui/Scroll";
import LinkLabel from "@/ui/LinkLabel";

export default {
  mixins: [playerMixin],

  data() {
    return {
      /**
       * 是否被锁定
       */
      isLocked: false,

      /**
       * 是否显示播放器
       */
      isShowPlayer: false,

      /**
       * 进度条滑块是否在滑动中
       */
      isMovingSlider: false,

      /**
       * 音量滑块是否在滑动中
       */

      isMovingVolSlider: false,

      /**
       * 播放列表数据
       */
      songList: [],

      /**
       * 正在播放的歌曲的url 用来绑定audio的src
       */
      curSongUrl: "",

      /**
       * 当前播放的进度 单位 ms
       */
      curTime: 0,

      /**
       * 当前播放歌曲的总时长 单位 ms
       */
      duration: 0,

      /**
       * 当前歌曲缓存到的时长 单位 ms
       */
      buffered: 0,

      /**
       * 播放进度条的宽度
       */
      widthPlayPrgs: 0,

      /**
       * 音量条高度 最大值93 可变范围80 即最小13
       */
      volPrgsHeight: 93,

      /**
       * 播放模式  0 列表循环  1 随机 2 单曲循环
       */
      curPlayMode: 0,

      /**
       * 是否显示播放模式的浮窗
       */
      isShowModeTip: false,

      /**
       * 是否显示开始播放的浮窗
       */
      isShowStartPlayTip: false,

      /**
       * 是否显示歌曲列表
       */
      isShowSongList: false,

      /**
       * 列表的 scrollTop
       */
      listbdcScrTop: 0,

      /**
       * 正在播放的歌曲的歌词数据
       */
      lyric: {
        /**
         * 事件戳数组
         */
        timeStamps: [],

        /**
         * 歌词数组，与事件戳一一对应
         */
        cnts: [],
      },

      /**
       * 每条歌词对应的scrollTop值
       */
      lyricScrTops: [],

      /**
       * 重新渲染滚动条标识
       */
      reRenderLyricScr: 0,
    };
  },

  computed: {
    /**
     * 正在播放的歌曲封面
     */
    curCoverUrl() {
      /**
       * 播放列表变化时，改变当前播放歌曲的封面
       */
      return this.songList &&
        this.songList.length &&
        this.songList[this.curSongIndex]
        ? this.songList[this.curSongIndex].coverUrl
        : defaultCover;
    },

    /**
     * 正在播放的歌曲id
     */
    curSongId() {
      return (
        this.songList &&
        this.songList.length &&
        this.songList[this.curSongIndex] &&
        this.songList[this.curSongIndex].id
      );
    },

    /**
     * 缓冲进度条的宽度
     */
    widthBufferedPrgs() {
      if (!this.buffered) {
        return 0;
      }
      return this.maxPrgsWidth * fix(this.buffered / this.duration);
    },

    /**
     * 滑块向左的偏移量 值为 widthPlayPrgs - 7
     */
    offsetLeftSlider() {
      return this.widthPlayPrgs - 7;
    },

    /**
     * 音量图标 音量为 0 时显示静音
     */
    volIcon() {
      return this.volPrgsHeight ===
        this.maxvolPrgsHeight - this.activevolPrgsHeight
        ? "icon-sound-Mute1"
        : "icon-sound-filling-fill";
    },

    /**
     * 播放模式图标
     */
    playModeConf() {
      return {
        icon: this.playMode[this.curPlayMode],
        tip: this.playModeTip[this.curPlayMode],
      };
    },

    /**
     * 正在播放的歌词在歌词数组的index
     */
    curLyricIndex() {
      const index = binarySearch(this.curTime, this.lyric.timeStamps);
      return index === -1 ? this.lyric.timeStamps.length - 1 : index;
    },

    /**
     * 每条歌词对应的scrollTop值
     */
    lyricScrTop() {
      return this.lyricScrTops[this.curLyricIndex] > this.listbdcHeight / 2
        ? this.lyricScrTops[this.curLyricIndex] - this.listbdcHeight / 2 + 10
        : 0;
    },
  },

  watch: {
    /**
     * 监听播放列表数据源
     */
    async playlistInfo(newList, oldList) {
      /**
       * 清楚上次的定时器
       */
      clearTimeout(this.playTimeout);

      this.playTimeout = null;

      /**
       * 播放列表变化时，展示播放器 1s
       */
      this.isShowPlayer = true;

      /**
       * 展开开始播放tip
       */
      this.isShowStartPlayTip = true;

      this.playTimeout = setTimeout(() => {
        if (!this.isLocked) {
          this.isShowPlayer = false;
        }

        this.isShowStartPlayTip = false;
      }, 1500);

      /**
       * 播放列表变化时，发送请求，设置播放列表对应歌曲url数组
       */
      const id = _.uniq(newList.map((item) => item.id));
      await this._getSongUrls(id);

      /**
       * 在播放状态下点击别的歌单，需要重新播放
       */
      if (this.isPlaying) {
        /**
         * 由于chrome禁止在用户交互之前通过js播放audio，不然会报一个错误
         * 又因为 play() 返回的是一个promise，所以在这里捕获，不让错误打印在浏览器上
         */
        this.$refs.audio.play().catch((e) => e);
      }

      /**
       * 当因为清空列表导致触发该watch时，不执行以下操作
       */
      if (newList && newList.length) {
        switch (this.addType) {
          /**
           *  'add': 0, // 只添加，但不改变正在播放的歌曲
           *  'addPlay': 1, // 添加并播放最后一首歌曲
           *  'replace': 2, // 将播放列表全部替换
           */
          case 0:
            /**
             * 只添加时，不改变正在播放的歌曲
             */
            break;
          case 1:
            /**
             * 播放添加后的播放列表的最后一首歌
             */
            this.setCurSongIndex(this.songList.length - 1);
            break;
          case 2:
            /**
             * 全部替换播放列表后，播放第一首歌
             */
            this.setCurSongIndex(0);
            break;
        }

        /**
         * 获得最新的正在播放的歌词数据
         */
        this._debounceGetLyric(this.songList[this.curSongIndex].id);
      }
    },

    /**
     * 监听播放列表
     */
    songList(newList, oldList) {
      const { curSongIndex } = this;

      if (
        (newList.length &&
          newList[curSongIndex] &&
          newList[curSongIndex].id) ===
        (oldList.length && oldList[curSongIndex] && oldList[curSongIndex].id)
      ) {
        /**
         * 每当播放列表变化时，判断变化前正在播放的歌曲和变化后对应播放的歌曲是否是同一首，如果是同一首则不需要改变curSongUrl
         * 因为后端即便是同一首歌，也会返回不同的url，导致curSongUrl变化后，audio重新渲染，以致于正在播放的歌曲重新播放
         */
        return;
      }

      /**
       * 其它情况下，如果是清空列表时，则初始化curSongUrl为空，其它情况则赋值为最新的url
       */
      this.curSongUrl =
        newList && newList.length && newList[curSongIndex]
          ? newList[curSongIndex].url
          : "";
    },

    /**
     * 监听播放状态并做出对应操作
     */
    isPlaying(newStatus, oldStatus) {
      if (newStatus) {
        this.$refs.audio.play().catch((e) => e);
      } else {
        this.$refs.audio.pause();
      }
    },

    /**
     * 监听播放时间，改变播放进度条的宽度
     */
    curTime(newCurTime, oldCurTime) {
      /**
       * 如果播放时间还没初始化，进度条则为0
       */
      if (!newCurTime) {
        this.widthPlayPrgs = 0;
        return;
      }

      if (!this.isMovingSlider) {
        /**
         * 如果不处于拖动状态，设置进度条与播放时间对应
         */
        this.widthPlayPrgs =
          this.maxPrgsWidth * fix(this.curTime / this.duration);
      }
    },

    /**
     * 监听音量条高度，实时改变播放音量
     */
    volPrgsHeight(newHeight, oldHeight) {
      this.$refs.audio.volume = fix(
        (newHeight - (this.maxvolPrgsHeight - this.activevolPrgsHeight)) /
          this.activevolPrgsHeight,
        1
      );
    },

    /**
     * 监听播放歌曲的index，同步改变滚动条位置和列表内容位置
     */
    curSongIndex(newIndex, oldIndex) {
      /**
       * 赋值audio新的歌曲url
       */
      this.curSongUrl = this.songList[newIndex].url;

      /**
       * 获取歌词数据
       */
      this._debounceGetLyric(this.songList[newIndex].id);

      /**
       * 调整歌曲列表滚动条位置
       */
      if ((newIndex + 1) * this.listbdcItemHeight > this.listbdcHeight) {
        this.listbdcScrTop =
          (newIndex + 1) * this.listbdcItemHeight - this.listbdcHeight;
      } else {
        this.listbdcScrTop = 0;
      }
    },

    /**
     * 监听歌曲列表是否渲染
     */
    isShowSongList(newStatus, oldStatus) {
      this.$nextTick(function () {
        if (newStatus) {
          /**
           * 打开歌曲列表和锁定播放器组件
           */
          this.isLocked = newStatus;

          /**
           * 每次打开歌曲列表时，计算生成歌词框的scrollTop的数组
           */
          this._getLyricScrTops();
        }
      });
    },
  },

  methods: {
    /**
     * 跳转到歌曲详情页
     */
    linkToSongPage() {
      if (
        this.songList &&
        this.songList.length &&
        this.songList[this.curSongIndex] &&
        this.songList[this.curSongIndex].id
      ) {
        this.$router.push(
          `/music/song?id=${this.songList[this.curSongIndex].id}`
        );
      }
    },

    /**
     * 切换锁定状态
     */
    controlLock() {
      this.isLocked = !this.isLocked;
      this.isShowPlayer = true;
    },

    /**
     * 进度条点击
     */
    msClickPrgs(e) {
      /**
       * 当有播放歌曲时，进度条交互才可用
       */
      if (this.songList && !this.songList.length) {
        return;
      }

      /**
       * 在进度条区域操作时执行click逻辑
       */
      if (e.offsetX <= this.maxPrgsWidth) {
        this.widthPlayPrgs = e.offsetX;

        this.$refs.audio.currentTime =
          (fix(e.offsetX / this.maxPrgsWidth) * this.duration) / 1000;
      }
    },

    /**
     * 鼠标移入播放区域
     */
    msOverPlayer() {
      if (!this.isLocked) {
        this.isShowPlayer = true;
      }
    },

    /**
     * 鼠标移出播放器区域
     */
    msLeavePlayer() {
      /**
       * 在非锁定状态 和 歌曲列表未展示时 才能隐藏播放器
       */
      if (!this.isLocked && !this.isShowSongList) {
        /**
         * 隐藏播放器操作区
         */
        this.isShowPlayer = false;
      }

      /**
       * 设置进度条拖动距离对应的播放时间
       */
      if (this.isMovingSlider) {
        this.$refs.audio.currentTime =
          (fix(this.widthPlayPrgs / this.maxPrgsWidth) * this.duration) / 1000;
      }

      /**
       * 终止拖动
       */
      this.isMovingSlider = false;
    },

    /**
     * 点击播放滑块，开始滑动改变进度
     */
    msDownSlider(e) {
      /**
       * 当有播放歌曲时，进度条交互才可用
       */
      if (this.songList && !this.songList.length) {
        return;
      }

      /**
       * 设置滑动初始位置为点击滑块处坐标
       */
      this.startX = e.clientX;

      /**
       * 设置滑动初始播放进度条的宽度
       */
      this.startWidthPlayPrgs = this.widthPlayPrgs;

      /**
       * 开始滑动
       */
      this.isMovingSlider = true;
    },

    /**
     * 点击播放滑块后，鼠标在播放器区域滑动时
     */
    msMovePlayer(e) {
      /**
       * 当有播放歌曲时，进度条交互才可用
       */
      if (this.songList && !this.songList.length) {
        return;
      }

      const {
        isMovingSlider,
        widthPlayPrgs,
        maxPrgsWidth,
        startX,
        startWidthPlayPrgs,
        atLeftOutside,
        atRightOutside,
      } = this;

      if (isMovingSlider && widthPlayPrgs > 0 && widthPlayPrgs < maxPrgsWidth) {
        /**
         * 滑块进入边界
         */
        this.atLeftOutside = false;

        this.atRightOutside = false;

        /**
         * 进度条将要变成的长度
         */
        const width = startWidthPlayPrgs + e.clientX - startX;

        /**
         * 进度条将要变成的长度如果小于0 则进度条直接长度设为0
         */
        if (width < 0) {
          this.widthPlayPrgs = 0;
          return;
        }

        /**
         * 进度条将要变成的长度如果大于最大值 则进度条直接长度设为最大值
         */
        if (width > maxPrgsWidth) {
          this.widthPlayPrgs = maxPrgsWidth;
          return;
        }

        /**
         * 正常情况
         */
        this.widthPlayPrgs = width;
      } else if (isMovingSlider && widthPlayPrgs <= 0) {
        /**
         * 越界或正在左边界时
         */
        if (!atLeftOutside) {
          /**
           * 调整滑块位置对齐左边界
           */
          this.widthPlayPrgs = 0;

          /**
           * 当widthPlayPrgs === 0 时，表示滑块正在左边界，
           * 而当 atLeftOutside 为false时，表示滑块刚刚到达左边界
           * 此时设置滑动初始设置为左边界
           */
          this.startX = e.clientX;

          this.startWidthPlayPrgs = 0;

          /**
           * 滑块开始越界
           */
          this.atLeftOutside = true;
        }

        if (e.clientX > this.startX) {
          this.widthPlayPrgs = this.startWidthPlayPrgs + e.clientX - startX;
        }
      } else if (isMovingSlider && widthPlayPrgs >= maxPrgsWidth) {
        /**
         * 越界或正在右边界时
         */
        if (!atRightOutside) {
          /**
           * 调整滑块位置对齐右边界
           */
          this.widthPlayPrgs = maxPrgsWidth;

          /**
           * 当widthPlayPrgs === maxPrgsWidth 时，表示滑块正在右边界，
           * 而当 atRightOutside 为false时，表示滑块还未开始越界，即刚刚到达右边界
           * 此时设置滑动初始设置为左边界
           */
          this.startX = e.clientX;

          this.startWidthPlayPrgs = maxPrgsWidth;

          /**
           * 滑块开始越界
           */
          this.atRightOutside = true;
        }

        if (e.clientX < this.startX) {
          this.widthPlayPrgs = this.startWidthPlayPrgs + e.clientX - startX;
        }
      }
    },

    /**
     * 鼠标在播放器区域松开时，停止进度改变
     */
    msUpPlayer() {
      /**
       * 当有播放歌曲时，进度条交互才可用
       */
      if (this.songList && !this.songList.length) {
        return;
      }

      /**
       * 设置进度条拖动距离对应的播放时间
       */
      if (this.isMovingSlider) {
        this.$refs.audio.currentTime =
          (fix(this.widthPlayPrgs / this.maxPrgsWidth) * this.duration) / 1000;
      }

      /**
       * 终止拖动
       */
      this.isMovingSlider = false;
    },

    /**
     * 播放/暂停 按钮点击 回调
     */
    controlPlay() {
      if (this.songList && !this.songList.length) {
        return;
      }
      this.setPlayStatus(!this.isPlaying);
    },

    /**
     * 播放上一首 回调
     */
    playPre() {
      if (this.songList && !this.songList.length) {
        return;
      }

      const { curPlayMode } = this;

      const maxIndex = this.songList.length - 1;

      switch (curPlayMode) {
        /**
         * 单曲循环 单曲循环时 切换下一首的表现与顺序播放一样
         * 区别在于歌曲ended后 单曲循环重新播放
         */
        case 2:

        /**
         * 顺序播放
         */
        case 0:
          /**
           * 如果当前在播发列表第一首，则跳到最后一首
           */
          if (this.curSongIndex === 0) {
            this.setCurSongIndex(maxIndex);
          } else {
            this.setCurSongIndex(this.curSongIndex - 1);
          }

          return;

        /**
         * 随机播放
         */
        case 1:
          this._randomPlay();
          return;
      }
    },

    /**
     * 播放下一首 回调
     */
    playNext() {
      if (this.songList && !this.songList.length) {
        return;
      }

      const { curPlayMode } = this;

      const maxIndex = this.songList.length - 1;

      switch (curPlayMode) {
        /**
         * 单曲循环 单曲循环时 切换下一首的表现与顺序播放一样
         * 区别在于歌曲ended后 单曲循环重新播放
         */
        case 2:

        /**
         * 顺序播放
         */
        case 0:
          /**
           * 如果当前在播发列表最后一首，则跳到第一首
           */
          if (this.curSongIndex === maxIndex) {
            this.setCurSongIndex(0);
          } else {
            this.setCurSongIndex(this.curSongIndex + 1);
          }

          return;

        /**
         * 随机播放
         */
        case 1:
          this._randomPlay();
          return;
      }
    },

    /**
     * 播放完毕事件 回调
     */
    endPlay() {
      const { curPlayMode } = this;

      switch (curPlayMode) {
        /**
         * 顺序播放
         */
        case 0:

        /**
         * 随机播放
         */
        case 1:
          this.playNext();

        /**
         * 单曲循环
         */
        case 2:
          this.$refs.audio.play().catch((e) => e);
      }
    },

    /**
     * 更新播放进度时间
     */
    updateCurTime(e) {
      this.curTime = e.target.currentTime * 1000;
    },

    /**
     * audio缓存事件 缓存完成之前一直调用
     */
    updateBuffered(e) {
      const timeRanges = this.$refs.audio.buffered;

      /**
       * 初始时，buffered并没有长度，需要判断，否则报错
       * 设置目前为止的缓存最大进度时间
       */
      if (timeRanges.length !== 0) {
        this.buffered = timeRanges.end(timeRanges.length - 1) * 1000;
      }
    },

    /**
     * 控制音量条的显示
     */
    controlVol() {
      this.setVolConfigStatus(!this.isShowVolConfig);
    },

    /**
     * 点击音乐条
     */
    msClickVolPrgs(e) {
      /**
       * 减10是为了鼠标在滑块中心，不减的话就会在滑块顶部
       */
      const height = e.target.offsetHeight - e.offsetY + 5;

      this.volPrgsHeight = this._calVolHeight(height);
    },

    /**
     * 鼠标离开音量设置区域
     */
    msLeaveVol(e) {
      /**
       * 离开区域终止滑动行为
       */
      this.isMovingVolSlider = false;
    },

    /**
     * 音量条滑块 mousedown 事件
     */
    msDownVolSlider(e) {
      /**
       * 音量滑块正在滑动
       */
      this.isMovingVolSlider = true;

      /**
       * 记录音量滑块开始滑动时的开始坐标
       */
      this.startY = e.clientY;

      /**
       * 将开始滑动时的音量条高度设为初始值
       */
      this.startHeightVolPrgs = this.volPrgsHeight;
    },

    /**
     * 音量条滑块 mousemove 事件
     */
    msMoveVolSlider(e) {
      if (!this.isMovingVolSlider) {
        return;
      }

      /**
       * 先计算音量条将要变成的高度
       */
      const height = this.startHeightVolPrgs - (e.clientY - this.startY);

      this.volPrgsHeight = this._calVolHeight(height);
    },

    /**
     * 音量条滑块 mouseup 事件
     */
    msUpVolSlider(e) {
      /**
       * 判断是否是点击行为
       */
      if (e.clientY === this.startY) {
        /**
         * (e.offsetY - 9) 是鼠标点击位置与滑块中心的距离
         */
        const height = this.volPrgsHeight - (e.offsetY - 9);

        this.volPrgsHeight = this._calVolHeight(height);
      }

      /**
       * 音量滑块正在滑动
       */
      this.isMovingVolSlider = false;

      /**
       * 归零音量滑块开始滑动时的开始坐标
       */
      this.startY = 0;

      /**
       * 将最终音量条高度记录为下次的初始值
       */
      this.startHeightVolPrgs = this.volPrgsHeight;
    },

    /**
     * 切换播放模式
     */
    modeSwitch() {
      const nextMode = this.curPlayMode + 1;

      /**
       * 在 0 1 2中循环
       */
      this.curPlayMode = nextMode > 2 ? 0 : nextMode;

      /**
       * 清除上次的定时器
       */
      clearTimeout(this.modeTimer);
      this.modeTimer = null;

      /**
       * 切换后 显示说明浮窗，2s后关闭
       */
      this.isShowModeTip = true;
      this.modeTimer = setTimeout(() => (this.isShowModeTip = false), 2000);
    },

    /**
     * 是否显示歌曲列表框
     */
    controlSongList() {
      if (!this.isShowSongList) {
        /**
         * 如果歌曲列表是收起状态, 绑定点击事件
         */
        document.body.addEventListener("click", this._closeSongList);
      }

      if (this.isShowSongList) {
        /**
         * 如果歌曲列表是展开状态, 解除绑定的点击事件
         */
        document.body.removeEventListener("click", this._closeSongList);
      }

      /**
       * 开启/关闭歌曲列表框
       */
      this.isShowSongList = !this.isShowSongList;
    },

    /**
     * 歌曲列表自定义滚动事件回调
     */
    listbdcScr(scrollTop) {
      /**
       * 更新 listbdcScrTop
       */
      this.listbdcScrTop = scrollTop;
    },

    /**
     * 点击关闭按钮  收起播放歌曲详情列表
     */
    closeSongList() {
      this.isShowSongList = false;
    },

    /**
     * 播放歌曲详情列表点击播放
     */
    playSelected(index) {
      this.setCurSongIndex(index);
    },

    /**
     * 清空播放歌曲数据
     */
    clearSongList() {
      /**
       * 清空列表和歌词
       */
      this.songList = [];

      /**
       * 同时清空vuex中的歌曲列表数据
       */
      this.replacePlaylistInfo([]);

      /**
       * 初始化curSongIndex
       */
      this.setCurSongIndex(0);

      /**
       * 清空歌词
       */
      this.lyric = {
        timeStamps: [],
        cnts: [],
      };

      /**
       * 重新加载进度条
       */
      this.reRenderLyricScr = Math.floor(Math.random() * 1e8);
    },

    /**
     * 点击除播放器之外的节点时列表收起
     */
    _closeSongList(e) {
      if (
        !isChildOfNodeById("p_player", e.target) &&
        !(e.target.id === "p_player")
      ) {
        this.isShowSongList = false;
        document.body.removeEventListener("click", this._closeSongList);
      }
    },

    /**
     * 根据传入音乐条将要变成的高度值 返回合理的音乐条高度
     */
    _calVolHeight(height) {
      /**
       * 如果音乐进度条将要超过最大高度 则直接设置为最大高度
       */
      if (height >= this.maxvolPrgsHeight) {
        return this.maxvolPrgsHeight;
      }

      /**
       * 如果音乐进度条将要小于最小高度 则直接设置为最小高度
       */
      if (height <= this.maxvolPrgsHeight - this.activevolPrgsHeight) {
        return this.maxvolPrgsHeight - this.activevolPrgsHeight;
      }

      /**
       * 音乐滑块在可变范围滑动时
       */
      if (
        height < this.maxvolPrgsHeight &&
        height > this.maxvolPrgsHeight - this.activevolPrgsHeight
      ) {
        return height;
      }
    },

    /**
     * 随机播放 即在范围内随机设置curSongIndex
     */
    _randomPlay() {
      const maxIndex = this.songList.length - 1;

      /**
       * 在范围内随机产生下一首播放的歌曲的对应url列表的index
       */
      let nextIndex = getRandomInt(0, maxIndex);

      /**
       * 判断随机生成的 index 是否与现在正在播放的歌曲一样
       */
      if (this.curSongIndex === nextIndex) {
        /**
         * 与目前播放歌曲一样时，将随机产生的index加一
         */
        nextIndex += 1;

        /**
         * 若是加一后超过最大index，则设置为0，即第一首
         */
        if (nextIndex === maxIndex) {
          nextIndex = 0;
        }
      }

      this.setCurSongIndex(nextIndex);
    },

    /**
     * 格式化时长
     */
    _formatMsToDuration(ms) {
      return formatMsToDuration(ms);
    },

    /**
     * 获取每一行歌词列表 Dom 的高度，存入数组
     */
    _getLyricScrTops() {
      if (this.$refs.lyricCntWrp) {
        let cntsH = [];

        /**
         * 计算每行歌词的 scrollTop
         */
        Array.from(this.$refs.lyricCntWrp.children).reduce((prev, cur) => {
          cntsH.push(prev + cur.offsetHeight);
          return prev + cur.offsetHeight;
        }, 0);

        this.lyricScrTops = cntsH;
      }
    },

    /**
     * 根据歌曲id获取url
     */
    async _getSongUrls(id) {
      await getSongUrl({ id }).then(({ data: { data } }) => {
        let list = [];
        this.playlistInfo.map((item) => {
          const url = data.find((dataItem) => {
            return item.id === dataItem.id;
          }).url;

          if (url) {
            list = [...list, { url, ...item }];
          }
        });
        this.songList = list;
      });
    },

    /**
     * 获取歌词并格式化存储
     */
    _getLyric(id) {
      getLyric({ id }).then((res) => {
        const { data } = res;

        if ((data && data.nolyric) || !(data && data.lrc)) {
          /**
           * 无歌词时清空歌词数据
           */
          this.lyric = {
            timeStamps: [],
            cnts: [],
          };

          return;
        }

        this.lyric = formatLyric(data.lrc.lyric);

        this.$nextTick(function () {
          /**
           * 在渲染完歌词列表后，再设置重新渲染滚动条标识
           */
          this.reRenderLyricScr = Math.floor(Math.random() * 1e8);

          /**
           * 每次在渲染完歌词后，获取每一行歌词的高度
           */
          this._getLyricScrTops();
        });
      });
    },

    /**
     * 对获取歌词方法做防抖处理
     */
    _debounceGetLyric: debounce("_getLyric", 300),
  },

  created() {
    /**
     * 存储列表变化时，改变播放器展示状态的定时器
     */
    this.playTimeout = null;

    /**
     * 存储展示播放模式tip定时器
     */
    this.modeTimer = null;

    /**
     * 进度条的总宽度，用于计算，对应 css 中 total-progress的width
     */
    this.maxPrgsWidth = 490;

    /**
     * 音量条的最大高度，可变高度为80 即最小高度为13
     */
    this.maxvolPrgsHeight = 93;

    /**
     * 音量条的可变高度
     */
    this.activevolPrgsHeight = 80;

    /**
     * 进度条滑块开始滑动时的坐标
     */
    this.startX = 0;

    /**
     * 音量滑块开始滑动时的坐标
     */
    this.startY = 0;

    /**
     * 进度条滑块开始滑动时，播放进度条已有的宽度
     */
    this.startWidthPlayPrgs = 0;

    /**
     * 音量条滑块开始滑动时，进度条已有的高度
     */
    this.startHeightVolPrgs = 93;

    /**
     * listbdc的视区高度
     */
    this.listbdcHeight = 260;

    /**
     * 歌曲列表中，每一首歌所占的高度
     */
    this.listbdcItemHeight = 28;

    /**
     * 一行歌词的高度
     */
    this.lyricCntHeight = 32;

    /**
     * 进度条滑块是否正在越左边界
     */
    this.atLeftOutside = false;

    /**
     * 进度条滑块是否正在越左边界
     */
    this.atRightOutside = false;

    /**
     * 播放模式 及 对应 icon名
     */
    this.playMode = {
      0: "icon-sequence",
      1: "icon-random",
      2: "icon-loop",
    };

    this.playModeTip = {
      0: "循环",
      1: "随机",
      2: "单曲循环",
    };
  },

  mounted() {
    this.$refs.audio.oncanplay = () => {
      /**
       * 赋值歌曲总时长 转化为单位ms
       */
      this.duration = this.$refs.audio.duration * 1000;

      /**
       * 初始时，设置一次缓存进度长度，防止初始时已缓存完毕，不触发 progress 事件
       */
      const timeRanges = this.$refs.audio.buffered;

      if (timeRanges.length !== 0) {
        this.buffered = timeRanges.end(timeRanges.length - 1) * 1000;
      }

      /**
       * 每当audio加载到可播放时，如果当前播放状态为true，则播放歌曲
       */
      if (this.isPlaying) {
        /**
         * 由于chrome禁止在用户交互之前通过js播放audio，不然会报一个错误
         * 又因为 play() 返回的是一个promise，所以在这里捕获，不让错误打印在浏览器上
         */
        this.$refs.audio.play().catch((e) => e);
      }
    };
  },

  components: {
    Scroll,
    LinkLabel,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.player {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9999;

  .lock-zone {
    position: relative;
    height: 14px;
    border-bottom: 2px solid #696969;
    z-index: 9;

    .lock {
      position: absolute;
      top: -5px;
      right: 15px;
      width: 52px;
      height: 67px;
      background: url("~@/assets/images/Common/playbar.png");
      background-position: 0 -380px;

      .icn-lock {
        display: block;
        width: 18px;
        height: 18px;
        margin: 6px 0 0 17px;
        background: url("~@/assets/images/Common/playbar.png");
      }

      .locked {
        background-position: -100px -380px;

        &:hover {
          background-position: -100px -400px;
        }
      }

      .unlock {
        background-position: -80px -380px;

        &:hover {
          background-position: -80px -400px;
        }
      }
    }
  }

  .operator-zone {
    position: relative;
    height: 50px;
    background: rgb(64, 63, 63);
    z-index: 10;

    .op-content {
      width: 960px;
      height: 50px;
      margin: 0 auto;
      padding: 0 10px;
      display: flex;
      align-items: center;

      .iconfont {
        color: #d4d4d4;
        font-size: 33px;
        margin: 0 4px;

        &:hover {
          color: #fff;
        }
      }

      .icon-previous {
        font-size: 25px;
      }

      .icon-next {
        font-size: 25px;
      }

      .music-cover {
        margin-left: 20px;
        margin-right: 15px;
        border: 1px solid #000;
        border-radius: 2px;
        font-size: 0;

        &:hover {
          cursor: pointer;
        }

        img {
          width: 34px;
          height: 34px;
        }
      }

      .progress-zone {
        height: 34px;
        padding-top: 1px;
        padding-bottom: 3px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .m-label {
          height: 18px;
          display: flex;
          align-items: flex-start;

          span,
          i {
            font-size: 12px;
            color: #9b9b9b;

            &:hover {
              color: #e8e8e8;
            }
          }

          .iconfont {
            position: relative;
            top: -1px;
            font-size: 16px;
          }

          .m-name {
            max-width: 300px;
            color: #e8e8e8;
            @include word-hide;

            &:hover {
              text-decoration: underline;
              cursor: pointer;
            }
          }

          .ar-name {
            margin: 0 15px;
            @include word-hide;
          }
        }

        .progress-wrapper {
          position: relative;
          width: 600px;
          height: 8px;

          .total-progress {
            width: 490px;
            height: 8px;
            border-radius: 3px;
            background: #161616;
          }

          .buffered-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 8px;
            border-radius: 3px;
            background: #535353;
          }

          .play-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 8px;
            border-radius: 3px;
            background: #c70c0c;
          }

          .time-progress {
            position: absolute;
            top: -2px;
            right: 0;
            font-size: 12px;
            color: #505050;

            span {
              color: #a1a1a1;
            }
          }

          .slider {
            position: absolute;
            top: -8px;
            width: 22px;
            height: 24px;
            background: url("~@/assets/images/Common/iconall.png");
            background-position: 0 -250px;

            &:hover {
              background-position: 0 -280px;
            }
          }
        }
      }

      .icon-vol-wrapper {
        position: relative;
        z-index: 9;

        .vol-prgs {
          position: absolute;
          top: -130px;
          left: -4px;
          width: 32px;
          height: 113px;
          background: url("~@/assets/images/Common/playbar.png");
          background-position: 0 -503px;

          .prgs-invisible {
            position: absolute;
            bottom: 9px;
            left: 14px;
            width: 5px;
            height: 93px;
            background: transparent;
          }

          .prgs {
            position: absolute;
            bottom: 9px;
            left: 14px;
            width: 5px;
            height: 93px;
            background: url("~@/assets/images/Common/playbar.png");
            background-position: -40px bottom;
          }

          .slider-vol {
            position: absolute;
            top: -4px;
            left: -7px;
            display: block;
            width: 18px;
            height: 20px;
            background: url("~@/assets/images/Common/iconall.png");
            background-position: -40px -250px;
            cursor: pointer;

            &:hover {
              background-position: -40px -280px;
            }
          }
        }
      }

      .icon-mode-wrapper {
        position: relative;
        z-index: 9;

        .mode-tip {
          position: absolute;
          top: -50px;
          left: -26px;
          width: 81px;
          height: 39px;
          line-height: 34px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          background: url("~@/assets/images/Common/playbar.png");
          background-position: 0 -457px;
        }
      }

      .icon-addfile {
        margin-left: 20px;
        margin-right: 13;
        padding-right: 13px;
        border-right: 1px solid #3c3c3c;
        font-size: 20px;
        color: #a1a1a1;

        &:hover {
          color: #fff;
        }
      }

      .icon-play-conf {
        font-size: 20px;
        color: #a1a1a1;
        z-index: 9;

        &:hover {
          color: #fff;
        }
      }

      .song-count {
        position: relative;
        width: 38px;
        padding-left: 21px;
        line-height: 27px;
        text-align: center;
        color: #666;
        text-shadow: 0 1px 0 #080707;
        text-indent: 0;
        text-decoration: none;
        font-size: 12px;
        background: url("~@/assets/images/Common/playbar.png");
        background-position: -42px -68px;
        cursor: pointer;

        &:hover {
          background-position: -42px -98px;
        }

        .tip {
          position: absolute;
          top: -68px;
          left: -62px;
          clear: both;
          width: 152px;
          height: 49px;
          background: url("~@/assets/images/Common/playbar.png");
          background-position: 0 -287px;
          text-align: center;
          color: #fff;
          line-height: 37px;
        }
      }
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-enter,
  .slide-leave-to {
    height: 0;
  }

  .song-list {
    position: absolute;
    left: 50%;
    bottom: 51px;
    width: 986px;
    height: 301px;
    transform: translateX(-50%);

    .listhd {
      height: 41px;
      padding: 0 5px;
      background: url("~@/assets/images/Common/playlist_bg.png") no-repeat;
      background-position: 0 0;

      .listhdc {
        position: relative;
        height: 40px;

        h4 {
          position: absolute;
          left: 25px;
          top: 0;
          height: 39px;
          padding: 0;
          margin: 0;
          line-height: 39px;
          font-size: 14px;
          color: #e2e2e2;
        }

        .s-collect {
          position: absolute;
          left: 398px;
          top: 12px;
          height: 20px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #ccc;
          cursor: pointer;

          &:hover {
            color: #fff;
          }

          .ico-add {
            width: 16px;
            height: 16px;
            background: url("~@/assets/images/Common/playlist.png");
            background-position: -24px 0;

            &:hover {
              background-position: -24px -20px;
            }
          }
        }

        .ico {
          margin: 1px 6px 0 0;
        }

        .listhdc-line {
          position: absolute;
          top: 13px;
          left: 477px;
          height: 15px;
          border-left: 1px solid #000;
          border-right: 1px solid #2c2c2c;
        }

        .s-clear {
          position: absolute;
          left: 490px;
          top: 12px;
          height: 20px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #ccc;
          cursor: pointer;

          &:hover {
            color: #fff;
          }

          .ico-del {
            width: 13px;
            height: 16px;
            background: url("~@/assets/images/Common/playlist.png");
            background-position: -51px 0;

            &:hover {
              background-position: -51px -20px;
            }
          }
        }

        .listhdc-lytit {
          position: absolute;
          left: 595px;
          top: 0;
          width: 346px;
          text-align: center;
          height: 39px;
          line-height: 39px;
          color: #fff;
          font-size: 14px;
          @include word-hide;
        }

        .s-close {
          position: absolute;
          top: 6px;
          right: 8px;
          width: 30px;
          height: 30px;
          overflow: hidden;
          text-indent: -999px;
          cursor: pointer;
          background: url("~@/assets/images/Common/playlist.png") no-repeat;
          background-position: -195px 9px;

          &:hover {
            background-position: -195px -21px;
          }
        }
      }
    }

    .listbd {
      position: absolute;
      left: 0;
      top: 41px;
      width: 976px;
      height: 260px;
      padding: 0 5px;
      overflow: hidden;
      background: url("~@/assets/images/Common/playlist_bg.png") no-repeat;
      background-position: -1014px 0;
      background-repeat: repeat-y;

      .imgbg {
        position: absolute;
        left: 2px;
        top: -360px;
        z-index: 1;
        width: 980px;
        height: auto;
        opacity: 0.2;
      }

      .msk {
        position: absolute;
        left: 2px;
        top: 0;
        z-index: 2;
        width: 558px;
        height: 260px;
        background: #121212;
        opacity: 0.5;
      }

      .listbdc {
        position: absolute;
        left: 2px;
        top: 0;
        z-index: 4;
        height: 260px;
        width: 558px;
        overflow: hidden;

        .ico {
          float: none;
          display: inline-block;
          position: relative;
          top: -4px;
          width: 36px;
          height: 29px;
          margin-right: 3px;
          background: url("~@/assets/images/Common/playlist.png");
          background-position: -138px 0;
          vertical-align: middle;
        }

        .f-tdu {
          text-decoration: underline;
        }

        ul {
          overflow: hidden;

          li {
            float: left;
            display: flex;
            width: 100%;

            &:hover {
              background-color: rgba(0, 0, 0, 0.3);

              .col {
                color: #fff;
              }

              .col-3 {
                visibility: visible;
              }

              .col-5 {
                color: #fff;
              }
            }

            .ico {
              float: right;
              height: 16px;
              overflow: hidden;
              margin: 7px 0 0 10px;
              text-indent: -9999px;
            }

            .col {
              padding-left: 10px;
              height: 28px;
              line-height: 28px;
              overflow: hidden;
              color: #ccc;
              font-size: 12px;
              cursor: pointer;
            }

            .col-1 {
              width: 10px;
              visibility: hidden;

              .playicn {
                margin-top: 8px;
                width: 10px;
                height: 13px;
                background: url("~@/assets/images/Common/playlist.png");
                background-position: -182px 0;
              }
            }

            .visible {
              visibility: visible;
            }

            .col-2 {
              width: 256px;
              @include word-hide;
            }

            .col-3 {
              position: relative;
              width: 78px;
              visibility: hidden;

              .icns {
                position: absolute;
                right: 0;
                top: 0;
                width: 100px;
                height: 23px;

                .ico-del {
                  width: 13px;
                  background: url("~@/assets/images/Common/playlist.png");
                  background-position: -51px 0;

                  &:hover {
                    background-position: -51px -20px;
                  }
                }

                .ico-dl {
                  width: 14px;
                  background: url("~@/assets/images/Common/playlist.png");
                  background-position: -57px -50px;

                  &:hover {
                    background-position: -80px -50px;
                  }
                }

                .ico-share {
                  width: 14px;
                  background: url("~@/assets/images/Common/playlist.png");
                  background-position: 0px 0px;

                  &:hover {
                    background-position: 0 -20px;
                  }
                }

                .ico-add {
                  width: 16px;
                  background: url("~@/assets/images/Common/playlist.png");
                  background-position: -24px 0px;

                  &:hover {
                    background-position: -24px -20px;
                  }
                }
              }
            }

            .col-4 {
              width: 70px;
              color: #9b9b9b;

              &:hover {
                text-decoration: underline;
              }
            }

            .col-5 {
              width: 35px;
              color: #666;
            }

            .col-6 {
              width: 37px;
              padding-left: 6px;

              .ico-src {
                width: 14px;
                margin-left: 0;
                background: url("~@/assets/images/Common/playlist.png");
                background-position: -80px 0px;

                &:hover {
                  background-position: -80px -20px;
                }
              }

              .ico-nosrc {
                background-position: -100px 0;

                &:hover {
                  background-position: -100px 0;
                }
              }
            }

            .col-cur {
              color: #fff;
            }
          }

          .curBak {
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }

      .nocnt {
        color: #aaa;
        font-size: 12px;
        padding-top: 85px;
        text-align: center;
        line-height: 43px;
      }

      .msk2 {
        position: absolute;
        left: 560px;
        top: 0;
        z-index: 3;
        width: 420px;
        height: 250px;
        background: #121212;
        opacity: 0.01;
      }

      .listlyric {
        position: absolute;
        left: 560px;
        top: 0;
        z-index: 4;
        padding: 21px 6px 20px 0;
        height: 219px;
        width: 414px;
        overflow: hidden;

        .nolyric {
          padding-top: 85px;
          color: #999;
        }

        .lyric-cnt {
          height: auto;
          min-height: 32px;
          text-align: center;
          line-height: 32px;
          font-size: 12px;
          color: #989898;
          word-wrap: break-word;
          transition: color 0.7s linear;
        }

        .lyric-cur {
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
