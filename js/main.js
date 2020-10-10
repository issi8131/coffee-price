const GEO_API_URL = "https://maps.googleapis.com/maps/api/geocode/json?result_type=sublocality_level_3&key=AIzaSyDQFBcx49cg1KIUSv86rMtNStC-zv2Zzy0&";
var app = new Vue({
  el: '#app',
  data: {
    tax_flag: false,
    drawerVisible: false,
    direction: 'rtl',//ドロワーの方向
    width: window.innerWidth,
    detailMode: false,
    now_address: "",
    items: [
      {
        store_name: "スターバックスコーヒー",
        price: 330,
        icons: [],
      },
      {
        store_name: "ドトールコーヒー",
        price: 220,
        icons: [],
      },
      {
        store_name: "星乃珈琲店",
        price: 500,
        icons: [],
      },
      {
        store_name: "コメダ珈琲店",
        price: 490,
        icons: [],
      },
      {
        store_name: "タリーズコーヒー",
        price: 300,
        icons: [],
      },
    ],
  },

  filters: {
    taxin: function (value) {
      return parseInt(value * 1.1);
    }
  },

  computed: {// 何か処理をした結果をデータとして返す
    // priceで降順並べ替え
    sortedItemsByPrice() {
      return this.items.sort((a, b) => {
        return (a.price < b.price) ? 1 : (a.price > b.price) ? -1 : 0;
      });;
    },
    drawerWidth: function () {//ページ表示時のウィンドウ幅に応じてダイアログのwidthを計算
      if (this.width < 640)
        return "50%";//モバイル端末のとき
      else
        return "30%";//PCのとき
    },
  },

  methods: {
    openMap: function (store_name) {
      if (!navigator.geolocation) {
        // Geolocation APIに対応していない
        alert("端末が未対応です");
        return;
      }
      // 現在地を取得
      navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function (position) {
          address_query_url = GEO_API_URL + "latlng=" + position.coords.latitude + "," + position.coords.longitude;
          axios
            .get(address_query_url)
            .then(response => {
              if (response.data.status != "OK") {
                alert("現在位置の取得に失敗しました");
                return;
              }
              this.now_address = response.data.results[0].formatted_address;

              // let url = "https://www.google.com/maps/search/?api=1&query=" + this.now_address + "+" + store_name;
              let url = "https://www.google.com/maps/search/?api=1&query=" + store_name;
              window.location.href = url; // 遷移
            })
            .catch(error => {
              alert("現在位置の取得に失敗しました");
              return;
            });
        },
        // 取得失敗した場合
        function (error) {
          switch (error.code) {
            case 1: //PERMISSION_DENIED
              alert("位置情報の利用が許可されていません");
              break;
            case 2: //POSITION_UNAVAILABLE
              alert("現在位置が取得できませんでした");
              break;
            case 3: //TIMEOUT
              alert("タイムアウトになりました");
              break;
            default:
              alert("その他のエラー(エラーコード:" + error.code + ")");
              break;
          }
        });
    },

    handleResize: function () {
      // resizeのたびにやりたいことを記述
      this.width = window.innerWidth;
    },

  },

  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }

})
