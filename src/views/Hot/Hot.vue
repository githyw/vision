<template>
    <div class="com-container">
        <div class="com-chart" ref="hot_ref"></div>
        <span class="iconfont arr-left" @click="currentClickLeft" :style="comStyle">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="currentClickRight" :style="comStyle">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">★ {{catName}}</span>
    </div>
</template>

<script>
    import 'assets/theme/chalk'
    import { getThemeValue } from '@/utils/theme_utils'
    import { mapState } from 'vuex'
  export default {
    name: "Hot",
    data(){
      return {
        chartInstance:null,
        allData:null,
        currentIndex:0,
        titleFontSize:0,
        timerID:null
      }
    },
    computed:{
        catName(){
          if(!this.allData){
            return ''
          }else{
            return this.allData[this.currentIndex].name
          }
        },
      comStyle(){
          return {
            fontSize : this.titleFontSize + 'px',
            color: getThemeValue(this.theme).titleColor
          }
      },
      ...mapState(['theme'])
    },
    created() {
      this.$socket.registerCallBack('hotData',this.getData)
      clearInterval(this.timerID)
    },
    mounted() {
      this.initChart()
      this.$socket.send({
        action:'getData',
        socketType:'hotData',
        chartName:'hotproduct',
        value:''
      })
      this.setIntval()

      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()

    },
    destroyed() {
      window.removeEventListener('resize',this.screenAdapter)
      this.$socket.unRegisterCallBack('hotData')
    },
    methods:{
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.hot_ref,this.theme)
        const initOption ={
          legend:{
            top:'5%',
            icon:'circle'
          },
          title:{
            text:'★ 热销商品的占比 ☆',
            left:'6%',
            top:'20%'
          },
          tooltip:{
            show:true,
            formatter:(arg)=>{
              return arg.name + ' : '+ arg.percent + '%'
            }
          },
          series:[
            {
              type:'pie',
              label:{
                show:false
              },
              emphasis:{
                label:{
                  show:true
                }
              }

            },
          ]
        }
        this.chartInstance.setOption(initOption)
      },
      getData(ret){
        this.allData = ret
        this.updataChart()

      },
      updataChart(){
        const legendData = this.allData[this.currentIndex].children.map(item =>{
          return item.name
        })
        const seriesData = this.allData[this.currentIndex].children.map(item =>{
          return {
            name : item.name,
            value : item.value
          }
        })
        const dataOption = {
          legend:{
            data:legendData
          },
          series:[
            {
              data:seriesData
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
        this.chartInstance.on('mouseover',()=>{
          clearInterval(this.timerID)
        })
        this.chartInstance.on('mouseout',()=>{
          this.setIntval()
        })
      },
      screenAdapter(){
        this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 2.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize:this.titleFontSize
            }
          },
          legend:{
            itemWidth:this.titleFontSize,
            itemHeight:this.titleFontSize,
            itemGap:this.titleFontSize,
            textStyle:{
              fontSize: this.titleFontSize / 2
            }
          },
          series:[
            {
              radius:this.titleFontSize * 7.5,
              center:['50%','55%']
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      currentClickLeft(){
        this.currentIndex++
        if(this.currentIndex > this.allData.length - 1){
          this.currentIndex = 0
        }
        this.updataChart()
      },
      currentClickRight(){
        this.currentIndex--
        if(this.currentIndex < 0){
          this.currentIndex = 2
        }
        this.updataChart()
      },
      setIntval(){
        clearInterval(this.timerID)
        this.timerID = setInterval(()=>{
          this.currentIndex++
          if(this.currentIndex > this.allData.length - 1){
            this.currentIndex = 0
          }
          console.log(this.currentIndex)
          this.updataChart()
        },3000)
      }
    },
    watch:{
      theme(){
        console.log('主题切换了')
        this.chartInstance.dispose()
        this.initChart()
        this.screenAdapter()
        this.updataChart()
      }
    }
  }
</script>

<style scoped>
    .arr-left{
        cursor:pointer;
        position: absolute;
        left: 10%;
        top: 50%;
        transform: translateY(-50%);
        color: #eeeeee;
        user-select:none;
    }
    .arr-right{
        cursor:pointer;
        position: absolute;
        right: 10%;
        top: 50%;
        transform: translateY(-50%);
        color: #eeeeee;
        user-select:none;
    }
    .cat-name{
        position: absolute;
        left: 80%;
        bottom: 20%;
        color: #eeeeee;
    }
</style>