<template>
  <div class="container">
    <x-header :left-options="{backText: ''}">
      购买会员
      <img class="header-img" @click="exitWeb" slot="overwrite-left" src="../assets/arrow-left.png" width="20" height="20">
    </x-header>
    <main class="main">
      <nav class="user-nav">
        <img class="avatar" :src="avatar">
        <div class="user-name">{{userName}}</div>
        <div class="user-tip">开通会员，享受8项超级特权</div>
      </nav>
      <section class="member-tab">
        <button-tab class="button-tab" v-model="buttonTab">
          <button-tab-item>
            <div class="position">
              <span>去广告会员</span>
              <div class="tab-mark">{{adMark}}</div>
            </div>
          </button-tab-item>
          <button-tab-item>
            <div class="position">
              <span>超级会员</span>
              <div class="tab-mark">{{vMark}}</div>
            </div>
          </button-tab-item>
        </button-tab>
        <div class="notice" v-if="adMsg" @click="onADShow">
          <img class="notice-left" src="../assets/notice.png" width="20" height="20">
          <div class="notice-center">
            <span class="center-text">{{adMsg}}   {{adMsg}}   {{adMsg}}   {{adMsg}}</span>
          </div>
          <img class="notice-right" src="../assets/arrow-right.png" width="10" height="10">
        </div>
        <div class="price-box">
          <ul class="box-content">
            <li :class="{active: priceItem.active}" v-for="(priceItem, index) in priceList" @click="chooisePrice(priceItem, index)">
              <p>{{priceItem.Desc}}</p>
              <p>{{priceItem.SFee}}</p>
              <p>{{priceItem.OFee}}</p>
              <p>{{priceItem.MDesc}}</p>
              <div class="banner" v-if="priceItem.Mark">{{priceItem.Mark}}</div>
            </li>
          </ul>
        </div>
      </section>
      <section class="pay-radio">
        <group>
          <Radio :options="payOption" v-model="payType">
          </Radio>
        </group>
      </section>
      <section class="coupon" v-if="priceItem && priceItem.Coupon">
        <cell>
          <span class="coupon-value">{{priceItem && priceItem.Coupon}}</span>
          <span class="coupon-title" slot="title">使用优惠券</span>
          <img class="coupon-icon" slot="child" src="../assets/arrow-right.png">
        </cell>
      </section>
      <footer class="footer" v-if="buttonTab === 0">
        <div class="footer-title">去广告会员特权</div>
        <div class="footer-content">
          <img src="../assets/big-footer.png">
        </div>
        <p class="text-tip">虚拟商品不支持7天无理由退款 《会员服务协议》</p>
      </footer>
      <footer class="footer" v-else>
        <div class="footer-title">超级会员特权</div>
        <div class="footer-list">
          <div class="footer-item" v-for="item in privilegeList" @click="onShow(item)">
            <img :src="item.img1">
            <p>{{item.name}}</p>
          </div>
        </div>
        <p class="text-tip">虚拟商品不支持7天无理由退款 《会员服务协议》</p>
      </footer>

    </main>
    <footer class="pay row">
      <div class="pay-left col-66">
        <span>实付:{{priceItem && priceItem.Fee}}</span>
        <div class="divider-vertical" v-if="priceItem && priceItem.BDesc"></div>
        <span class="small" v-if="priceItem && priceItem.BDesc">仅需：{{priceItem && priceItem.BDesc}}</span>
      </div>
      <div class="pay-right col-34"  @click="onPay">立即支付</div>
    </footer>
    <div v-transfer-dom>
      <x-dialog v-model="showModal">
        <div class="modal">
          <img class="close-icon" src="../assets/close.png" @click="onHide">
          <div class="modal-title">
            <img :src="privilege.img2">
            <span>{{privilege.name}}</span>
          </div>
          <div class="modal-text">
            {{privilege.text}}
          </div>
          <div class="modal-button" @click="onHide">
            关闭
          </div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showADModal">
        <div class="img-modal">
          <!--<img class="close-icon" src="../assets/close.png" @click="onHide">-->
          <img class="modal-img" src="../assets/modal-bg.png">
          <div class="modal-img-title">
            会员消息详情
          </div>
          <div class="modal-text">
            {{adMsg}}
          </div>
          <div class="modal-button" @click="onADHide">
            我知道了
          </div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoading" transition="none"></loading>
    </div>
  </div>
</template>

<script>
  import { XHeader, XDialog, Loading, ButtonTab, ButtonTabItem, Group, Cell, TransferDomDirective as TransferDom } from 'vux';
  import Radio from '../components/radio';
  import { get } from '../utils/http';


  const privilegeList = [
    {
      name: '手机定位',
      img1: require('../assets/footer1.png'),
      img2: require('../assets/modal1.png'),
      text: '免费对手机发送一条短信，对方查看确定后可成功定位到手机',
    },
    {
      name: '新闻定位',
      img1: require('../assets/footer2.png'),
      img2: require('../assets/modal2.png'),
      text: '分享一篇好玩的新闻给他，双方有趣互动可定位',
    },
    {
      name: '红包定位',
      img1: require('../assets/footer3.png'),
      img2: require('../assets/modal3.png'),
      text: '只要对方成功领取红包，100%定位成功哦',
    },
    {
      name: '去广告',
      img1: require('../assets/footer4.png'),
      img2: require('../assets/modal4.png'),
      text: '去除APP内外所有广告，使用更清爽',
    },
    {
      name: '视频守护',
      img1: require('../assets/footer5.png'),
      img2: require('../assets/modal5.png'),
      text: '可单方面对家人发起视频，了解他周围的环境，守护他安全',
    },
    {
      name: '隐藏APP',
      img1: require('../assets/footer6.png'),
      img2: require('../assets/modal6.png'),
      text: '隐藏后，防走丢将在手机桌面隐藏，且不会收到任何推送消息',
    },
    {
      name: '更多电子围栏',
      img1: require('../assets/footer7.png'),
      img2: require('../assets/modal7.png'),
      text: '支持创建10个电子围栏（非VIP仅能创建1个）',
    },
    {
      name: '更多足迹',
      img1: require('../assets/footer8.png'),
      img2: require('../assets/modal8.png'),
      text: '支持查询群成员15天内的所有足迹（非VIP仅能查看3天）',
    },
  ];

  export default {
    directives: {
      TransferDom,
    },
    components: {
      XHeader,
      XDialog,
      Loading,
      ButtonTab,
      ButtonTabItem,
      Radio,
      Group,
      Cell,
    },
    data() {
      return {
        payOption: [{
          icon: require('../assets/zfb.png'),
          key: '2',
          value: '支付宝支付',
        }, {
          icon: require('../assets/wx.png'),
          key: '1',
          value: '微信支付',
        }],
        buttonTab: 0,
        priceList: [],
        priceList1: [],
        priceList2: [],
        privilegeList,
        privilege: {},
        payType: '2',
        adMsg: '',
        adMark: '',
        vMark: '',
        userName: '',
        avatar: '',
        couponValue: '-￥100元',
        showLoading: false,
        showADModal: false,
        showModal: false,
      };
    },
    created() {
      this.intiData();
      this.getUserIP((ip) => {
        this.ip = ip;
      });
      const { query } = this.$route;
      const { userName, avatar, UID } = query;
      this.userName = userName;
      this.avatar = avatar;
      this.UID = UID;
    },
    methods: {
      intiData() {
        this.showLoading = true;
        get('v3/vip/price', {
          Class: 1,
          Action: 1,
        }).then((data) => {
          this.showLoading = false;
          const newData = [...data.data];
          newData[0].active = true;
          this.priceList = newData;
          this.priceList1 = newData;
          this.adMsg = data.ADMsg;
          this.adMark = data.ADMark;
        });
        get('v3/vip/price', {
          Class: 0,
          Action: 1,
        }).then((data) => {
          this.showLoading = false;
          const newData = [...data.data];
          newData[0].active = true;
          this.priceList2 = newData;
          this.adMsg = data.VMsg;
          this.vMark = data.VMark;
        });
      },
      exitWeb() {
        if (window.appSdk) {
          if (window.appSdk.exitWeb) {
            window.appSdk.exitWeb();
          }
        }
      },
      onShow(item) {
        this.privilege = item;
        this.showModal = true;
      },
      onHide() {
        this.showModal = false;
      },
      onADShow() {
        this.showADModal = true;
      },
      onADHide() {
        this.showADModal = false;
      },
      chooisePrice(priceItem, index) {
        const priceList = this.priceList.map(item => ({
          ...item,
          active: false,
        }));
        priceList[index].active = true;
        this.priceList = priceList;
      },
      onPay() {
        this.showLoading = true;
        const params = {
          ClientIP: this.ip,
          Class: this.priceItem.Class,
          Action: this.priceItem.Action,
          Type: this.priceItem.Type,
          UID: this.UID,
          Position: 'other',
          CSource: 'other',
          PType: this.payType,
          P: 0,
        };
        get('v3/vip/h5pay', params).then((data) => {
          this.showLoading = false;
          if (this.payType === '2') {
            const divForm = document.getElementsByTagName('divform');
            if (divForm.length) {
              document.body.removeChild(divForm[0]);
            }
            const div = document.createElement('divform');
            div.innerHTML = data; // data就是接口返回的form 表单字符串
            document.body.appendChild(div);
            document.forms[0].setAttribute('target', '_blank'); // 新开窗口跳转
            document.forms[0].submit();
          } else {
            window.location.replace(`${data.mweb_url}&redirect_url=${window.location.href}`);
          }
        });
      },
      getUserIP(onNewIP) {
        const MyPeerConnection = window.RTCPeerConnection ||
          window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        const pc = new MyPeerConnection({
          // eslint-disable-next-line
            iceServers: [],
        });
        function noop() { }
        const localIPs = {};
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

        function iterateIP(ip) {
          if (!localIPs[ip]) onNewIP(ip);
          localIPs[ip] = true;
        }

        pc.createDataChannel('');

        pc.createOffer((sdp) => {
          sdp.sdp.split('\n').forEach((line) => {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
        }, noop);

        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate ||
            !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
          ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
      },
    },
    watch: {
      buttonTab(value) {
        if (value === 0) {
          this.priceList = this.priceList1;
        } else {
          this.priceList = this.priceList2;
        }
      },
    },
    computed: {
      priceItem() {
        return this.priceList.filter(item => item.active)[0];
      },
    },
  };
</script>

<style lang="less" scoped>
  .container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .main{
    flex: 1;
    border-top: 1px solid #F2F3F4;
    overflow: scroll;
  }
  .header-img{
    padding: 0 6px;
  }
  .user-nav{
    height: 65px;
    background-color: #fff;
    padding: 0 4%;
    margin-bottom: 15px;
    position: relative;
    .icon{
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
    .avatar{
      width: 38px;
      height: 38px;
      position: absolute;
      border-radius: 50%;
      top: 12px;
      left: 15px;
    }
    .user-name{
      position: absolute;
      color: #333;
      font-size: 16px;
      top: 8px;
      left: 65px;
    }
    .user-tip{
      font-size: 11px;
      position: absolute;
      color: #666;
      top: 36px;
      left: 65px;
    }
  }
  .member-tab{
    padding: 19px 4%;
    background-color: #fff;
    margin-bottom: 15px;
    .button-tab{
      padding: 3px 4%;
    }
    .position{
      position: relative;
      .limited-time{
        position: absolute;
        z-index: 2;
        top: -9px;
        right: -12px;
      }
      .tab-mark{
        background: #00D359;
        font-style: italic;
        color: #fff;
        padding: 0 8px 0 6px;
        line-height: 18px;
        border-radius: 10px;
        position: absolute;
        z-index: 2;
        font-size: 13px;
        top: -9px;
        right: -12px;
      }
    }
  }
  .notice{
    position: relative;
    margin-top: 7px;
    height: 30px;
    .notice-left{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
    .notice-right{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
    .notice-center{
      position: absolute;
      overflow: hidden;
      width: 90%;
      height: 30px;
      left: 6%;
      top: 50%;
      transform: translate(0, -50%);
      .center-text{
        position: absolute;
        top: 0;
        left: 0;
        animation: go 16s linear infinite;
        line-height: 30px;
        font-size: 11px;
        white-space: nowrap;
        color: #666;
      }
      @keyframes go {
    　　from {
          left: 0;
        }
        to {
          left: -100%;
        }
      }
    }
  }
  .price-box{
    overflow-y: hidden;
    overflow-x: scroll;
    .box-content{
      display: flex;
      li{
        width: 106px;
        height: 125px;
        margin-top: 22px;
        position: relative;
        border-radius: 5px;
        margin-right: 10px;
        box-sizing: border-box;
        flex-shrink: 0;
        border: 1px solid #E1E1E1;
        text-align: center;
        p:nth-of-type(1){
          line-height: 25px;
          padding-top: 18px;
          font-size: 13px;
          color: #666;
        }
        p:nth-of-type(2){
          font-size: 19px;
          line-height: 26px;
          padding-bottom: 4px;
          color: #DEA95D;
        }
        p:nth-of-type(3){
          font-size: 11px;
          color: #666;
          line-height: 16px;
          padding-bottom: 4px;
          text-decoration: line-through;
        }
        p:nth-of-type(4){
          width: 62%;
          margin: 0 auto;
          font-size: 11px;
          color: #fff;
          line-height: 20px;
          padding: 0 6px;
          border-radius: 10px;
          background: #ECCA9B;
        }
        .banner{
          min-width: 106px;
          line-height: 26px;
          z-index: 1;
          white-space: nowrap;
          font-size: 11px;
          position: absolute;
          top: -11px;
          left: -1px;
          background: #FE8B00;
          color: #fff;
          border-top-left-radius: 19px;
          border-bottom-right-radius: 19px;
        }
      }

      .active{
        border: 1px solid #DEA95D;
        background: #FFF9ED;
      }
    }
  }
  .pay-radio{
    margin-bottom: 15px;
  }
  .footer{
    background: #fff;
    padding: 10px 4% 6px 4%;
    .footer-title{
      line-height: 30px;
      color: #000;
    }
    .footer-content{
      padding-top: 6px;
      img{
        width: 100%;
        height: 162px;
      }
    }
    .footer-list{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding-top: 6px;
      .footer-item{
        width: 25%;
        height: 60px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          display: block;
          width: 45px;
          height: 45px;
        }
        p{
          color: #F0AF28;
          font-size: 10px;
          text-align: center;
        }
      }
    }
    .text-tip{
      line-height: 20px;
      font-size: 11px;
      text-align: center;
      color: #CECECE;
    }
  }
  .pay{
    background: #666666;
    color: #fff;
    height: 56px;
    .pay-left{
      line-height: 56px;
      text-align: center;
      height: 100%;
      .small{
        font-size: 11px;
      }
    }
    .pay-right{
      line-height: 56px;
      text-align: center;
      background: #DEA95D;
    }
  }
  .divider-vertical{
    position: relative;
    top: -0.06em;
    display: inline-block;
    width: 1px;
    height: .9em;
    margin: 0 8px;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 0;
    color: rgba(0,0,0,0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    background: #fff;
  }
  .img-modal{
    position: relative;
    display: inline-block;
    width: 50px;
    height: 100px;
    .modal-img{
      position: absolute;
      width: 316px;
      top: -100px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .modal-img-title{
      position: absolute;
      width: 100px;
      top: -33px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #fff;
      font-size: 14px;
    }
    .modal-text{
      position: absolute;
      width: 260px;
      top: 30px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #666;
      font-size: 14px;
    }
    .modal-button{
      position: absolute;
      width: 208px;
      top: 106px;
      left: 50%;
      transform: translate(-50%, 0);
      background: #FF6F29;
      height: 38px;
      line-height: 38px;
      border-radius: 19px;
      color: #fff;
      font-size: 14px;
    }
  }
  .modal{
    padding: 14px 10px;
    position: relative;
    .close-icon{
      width: 15px;
      height: 15px;
      padding: 0 6px 0 6px;
      float: right;
    }
    .modal-title{
      height: 32px;
      line-height: 32px;
      img{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      span{
        color: #333;
        font-size: 18px;
      }
    }
    .modal-text{
      padding: 6px;
      color: #666;
      line-height: 18px;
      font-size: 13px;
    }
    .modal-button{
      width: 208px;
      margin: 4px auto;
      background: #FE8B00;
      height: 38px;
      line-height: 38px;
      border-radius: 19px;
      color: #fff;
      font-size: 14px;
    }
  }
  .coupon{
    background: #fff;
    margin-bottom: 15px;
    .coupon-value{
      color: #FE6000;
      padding-right: 12px;
    }
    .coupon-title{
      color: #333;
      line-height: 30px;
      font-size: 14px;
    }
    .coupon-icon{
      position: absolute;
      right: 6px;
      width: 13px;
      height: 13px;
    }
  }



</style>
