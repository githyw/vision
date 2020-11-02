<template>
    <div class="com-container">
        <div class="title" >
            <span :style="comStyle">★ {{showTitle}}</span>
            <span class="iconFont" :style="ccStyle" > <img src="~assets/img/jiantou.svg"  alt="" @click="iconFontClick"></span>
            <div class="text" v-for="item in selectTypes" :style="comStyle" :key="item.key" v-show="textShow" @click="textClick(item.key)">
                ☆ {{item.text}}
            </div>
        </div>
        <div class="com-chart" ref="trend_ref"></div>
    </div>
</template>

<script>
  import 'assets/theme/chalk'
  export default {
    name: "Trend",
    data(){
      return {
        chartInstane: null,
        allData: null, //从服务器获取到的所有数据
        textShow:false,
        choiceType:'map',
        titleFontSize:0
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize',this.screenAdapter)
    },
    computed:{
      selectTypes(){
        if(!this.allData){
          return []
        }else{
          return this.allData.type.filter(item =>{
            return item.key !== this.choiceType
          })
        }
      },
      showTitle(){
        if(!this.allData){
          return ''
        }else{
          return this.allData[this.choiceType].title
        }
      },
      comStyle(){
        return {
          fontSize: this.titleFontSize + 'px',
          backgroundColor:'#222733'

        }
      },
      ccStyle(){
        return {
          width:this.titleFontSize + 'px',
          height:this.titleFontSize + 'px',
        }
      }
    },
    methods:{

      textClick(item){
        this.choiceType = item
        this.updataChart()
        this.textShow = false
      },
      iconFontClick(){
        this.textShow = !this.textShow
      },
      initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.trend_ref,'chalk')
        const initOption = {
          legend: {
            left:20,
            top:'10%',
            icon:'circle'
          },
          grid:{
            left:'2%',
            top:'20%',
            right:'3%',
            bottom:'1%',
            containLabel:true
          },
          xAxis: {
            type:'category',
            boundaryGap:false
          },
          yAxis:{
            type:'value'
          },
          tooltip:{
            trigger:'axis'
          }
        }
        this.chartInstane.setOption(initOption)
      },
      async getData(){
        const { data:ret } = await this.$http.get('trend')
        this.allData = ret
        this.updataChart()
        console.log(this.allData)
      },
      updataChart(){
        //类目轴的数据
        const timeArr = this.allData.common.month
        //y轴的数据 series下的数据
        const valueArr = this.allData[this.choiceType].data
        const seriesArr = valueArr.map(item => {
          return {
            name:item.name,
            type:'line',
            data:item.data,
            stack:this.choiceType
          }
        })
        const legendArr = valueArr.map(item =>{
          return item.name
        })
        const dataOption ={
          xAxis: {
            data:timeArr
          },
          legend:{
            data:legendArr
          },
          series: seriesArr
        }
        this.chartInstane.setOption(dataOption)
      },
      screenAdapter(){
        this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 2
        console.log(this.titleFontSize)
        const adapterOption = {
          legend:{
            itemWidth:this.titleFontSize - 5,
            itemHeight:this.titleFontSize - 5,
            textStyle:{
              fontSize: this.titleFontSize / 2
            }
          }
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      }
    }
  }
</script>

<style scoped>
.title{
    position: absolute;
    top: 2.5%;
    left: 20px;
    z-index: 10;
    color: #eeeeee;
}
.iconFont{
    display: inline-block;
    margin-left: 7px;
    width: 15px;
    height: 15px;
    color: #eeeeee;
    cursor:pointer;
}
    .iconFont img{
        width: 100%;
        height: 100%;
    }
    .text{
        margin-top: 5px;
        cursor:pointer;
    }
</style>