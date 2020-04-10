<style scoped>

.wh_item_date:hover {
 background: #409eff;  
  color: #ffffff;
  border-radius: 100px;
  cursor: pointer;
}

* {
  margin: 0;
  padding: 0;
}

.wh_container {
  max-width: 300px;
}

li {
  list-style-type: none;
}
.wh_top_changge {
  display: flex;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: #333333;
  font-size: 18px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 47px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
}
.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
  background-color: #ffffff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
  margin-top: 20px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 16px;
}

.wh_content_item,
wh_content_item_tag {
  font-size: 15px;
  width: 13.4%;
  text-align: center;
  color: #fff;
  position: relative;
}
.wh_content_item {
  height: 40px;
}

.wh_top_tag {
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-size: 14px;
}

.wh_item_date {
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin: auto;
  color: #666666;
  text-align: center;
  display: block;
  font-size: 14px;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #666666;
  border-left: 2px solid #666666;
  transform: rotate(-45deg);
}
.wh_jiantou1:hover,
.wh_jiantou2:hover {
  border-color:#333333;
}
.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color:#333333;
}

.wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #666666;
  border-right: 2px solid #666666;
  transform: rotate(45deg);
}
.wh_content_item> .wh_isMark  {
 width: 6px;
 height: 6px;
 background-color: #409eff;
 border-radius: 6px;
  margin-left: -2px;
 position: absolute;

}
/* .wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: blue;
  z-index: 2;
} */
.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_isToday {
 background: #409eff;
  border-radius: 100px;
  color: #ffffff;
}
.wh_content_item .wh_chose_day {
  background: #409eff;
  border-radius: 100px;
  color: #ffffff;
  cursor: pointer;
}
</style>
<template>
<div>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li @click="PreMonth(myDate,false)">
          <div class="wh_jiantou1"></div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth(myDate,false)">
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="tag in textTop">
          <div class="wh_top_tag">
            {{tag}}
          </div>
          
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" @click="clickDay(item,index)">
          <div class="wh_item_date" v-bind:class="[{wh_other_dayhide:item.otherMonth!=='nowMonth'},{wh_want_dayhide:item.dayHide},{wh_isToday:item.date==setdate},{wh_chose_day:item.chooseDay},setClass(item)]">
            <span>{{item.id}}</span>
          </div>
          <i :class="[{wh_isMark: item.isMark}]"></i>
        </div>
      </div>
    </div>
  </section>
</div>  
</template>
<script>
import timeUtil from './timedate';
import storage from '@/global/storage'
export default {
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: '',
    };
  },
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    setdate: {
      type: String,
      default: () => ''
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ['日', '一', '二', '三', '四', '五', '六']
    },
    sundayStart: {
      type: Boolean,
      default: () => true
    },
    agoDayHide: { type: String, default: `0` },
    futureDayHide: { type: String, default: `2554387200` }
  },
  computed : {
			clazzId () {
				return this.$route.query.clazzId;
			}
	},
  created() {
    this.intStart();
    this.myDate = new Date();
  },
  methods: {
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay: function (item, index) {
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth'
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date);
      }
    },
    ChoseMonth: function (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    PreMonth: function (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    NextMonth: function (date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    forMatArgs: function () {
      let markDate = this.markDate;
      let markDateMore = this.markDateMore;
      markDate = markDate.map((k) => {
        return timeUtil.dateFormat(k);
      })
      markDateMore = markDateMore.map((k) => {
        k.date = timeUtil.dateFormat(k.date)
        return k;
      })
      return [markDate, markDateMore];
    },
    getList: function (date, chooseDay, isChosedDay = true) {
      const [markDate, markDateMore] = this.forMatArgs();
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);
      for (let i = 0; i < arr.length; i++) {
        let markClassName = '';
        let k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        //看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || '';
          }
        }
        //标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          this.$emit('isToday', nowTime);
        }
        let flag = !k.dayHide && k.otherMonth === 'nowMonth';
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit('choseDay', nowTime);
          this.historyChose.push(nowTime);
          k.chooseDay = true;
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime && !chooseDay && flag
        ) {
          k.chooseDay = true;
        }
      }
      this.list = arr;
    }
  },
  mounted() {
    this.getList(this.myDate);
    if(storage.session.get('当前班级'+this.clazzId)!=undefined){
      this.ChoseMonth(storage.session.get('当前班级'+this.clazzId))
    }
    
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
        this.forMatArgs();
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.agoDayHide = parseInt(val);
        this.getList(this.myDate);
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.futureDayHide = parseInt(val);
        this.getList(this.myDate);
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
       deep: true
    },
    setdate:{
      handler(val,oldVal){
        console.log('选择的月份',val)
        this.ChoseMonth(val)
      },
      deep: true
    }
  }
};
</script>