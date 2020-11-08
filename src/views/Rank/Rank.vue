<template>
    <div class="com-container">
        <div class="com-chart" ref="rank_ref"></div>
    </div>
</template>

<script>
    import 'assets/theme/chalk.js'
    import { mapState } from 'vuex'
  export default {
    name: "Rank",
    data() {
      return {
        chartInstance:null,
        allData:null,
        startValue:0,
        endValue: 9,
        timeID:null
      }
    },
    created() {
      this.$socket.registerCallBack('rankData',this.getData)
    },
    mounted(){
      this.initChart()
      this.$socket.send({
        action:'getData',
        socketType:'rankData',
        chartName:'rank',
        value:''
      })
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
      this.setInterval()

    },
    destroyed() {
      window.removeEventListener('resize',this.screenAdapter)
      clearInterval(this.timeID)
      this.$socket.unRegisterCallBack('rankData')
    },
    methods:{
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.rank_ref,this.theme)
        const initOption = {
          title:{
            text:'★ 地区销售排行 ☆',
            left:20,
            top:10
          },
          tooltip:{
            show:true
          },
          grid:{
            left:'3%',
            top:'15%',
            right:'3%',
            bottom:'4%',
            containLabel:true
          },
          xAxis:{
            type:'category'
          },
          yAxis:{
            type:'value'
          },
          series:{
            type:'bar'
          }
        }
        this.chartInstance.setOption(initOption)
        this.chartInstance.on('mouseover',()=>{
          clearInterval(this.timeID)
        })
        this.chartInstance.on('mouseout',()=>{
         this.setInterval()
        })
      },
      getData(ret){
        this.allData = ret
        this.allData.sort((a,b)=>{
          return b.value - a.value
        })
        this.updataChart()
      },
      updataChart(){
        const colorArr = [
          ['#0BA82C','#4ff778'],
          ['#2E72BF','#23E5E5'],
          ['#5052EE','#AB6EE5']
        ]
        const provinceArr = this.allData.map(item => item.name)
        const valueArr = this.allData.map(item => item.value)
        const dataOption = {
          xAxis:{
            data:provinceArr
          },
          dataZoom:{
            show:false,
            startValue:this.startValue,
            endValue:this.endValue
          },
          series:{
            data:valueArr,
            itemStyle:{
              color: reg =>{
                let targetColorArr = null;
                if(reg.data > 300){
                  targetColorArr = colorArr[0]
                }else if(reg.data > 200){
                  targetColorArr = colorArr[1]
                }else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                  {
                    offset:0,
                    color:targetColorArr[0]
                  },
                  {
                    offset:1,
                    color:targetColorArr[1]
                  }
                ])
              }
            }
          }
        }
        this.chartInstance.setOption(dataOption)
      },
      screenAdapter(){
        const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 2.3
        const dapterOption = {
          title:{
            textStyle:{
              fontSize:titleFontSize
            }
          },
          series:[
            {
            barWidth:titleFontSize + 10,
            itemStyle:{
              barBorderRadius:[titleFontSize / 2 +10,titleFontSize/2 +10, 0, 0]
            }
          }
          ]
        }
        this.chartInstance.setOption(dapterOption)
        this.chartInstance.resize()
      },
      setInterval(){
        if(this.timeID){
          clearInterval(this.timeID)
        }
        this.timeID = setInterval(()=>{
          this.startValue++
          this.endValue++
          if(this.endValue > this.allData.length - 1){
            this.startValue = 0
            this.endValue = 9
          }
          this.updataChart()
        },2000)
      }
    },
    computed:{
      ...mapState(['theme'])
    },
    watch:{
      theme(){
        this.chartInstance.dispose()
        this.initChart()
        this.screenAdapter()
        this.updataChart()
      }
    }
  }
</script>

<style scoped>

</style>