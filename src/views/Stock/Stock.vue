<template>
    <div class="com-container">
        <div class="com-chart" ref="stock_ref"></div>
    </div>
</template>

<script>
    import 'assets/theme/chalk'
    import { mapState } from 'vuex'
  export default {
    name: "Stock",
    data() {
      return {
        chartInstance:null,
        allData:null,
        currentIndex:0,
        timeID:null
      }
    },
    created() {
      this.$socket.registerCallBack('stockData',this.getData)
    },
    mounted() {
      this.initChart()
      this.$socket.send({
        action:'getData',
        socketType:'stockData',
        chartName:'stock',
        value:''
      })
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
      this.setInterval()
    },
    destroyed() {
      window.removeEventListener('resize',this.screenAdapter)
      clearInterval(this.timeID)
      this.$socket.unRegisterCallBack('stockData')
    },
    methods:{
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.stock_ref,this.theme)
        const initOption = {
          title:{
            text:'★ 库存和销量分析 ☆',
            left:20,
            top:20
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
        this.updataChart()
      },
      updataChart(){
        const centerArr = [
          ['18%','40%'],
          ['50%','40%'],
          ['82%','40%'],
          ['34%','75%'],
          ['66%','75%'],
        ]
        const colorArr = [
          ['#4FF778','#0BA82C'],
          ['#E5DD45','#E8BEEC'],
          ['#E8821C','#E55445'],
          ['#5052EE','#AB6EE5'],
          ['#23E5E5','#2E72BF'],
        ]
        const start = this.currentIndex * 5;
        const end = (this.currentIndex + 1) * 5
        const showData = this.allData.slice(start,end)
        const seriesArr = showData.map((item,index) =>{
          return {
            type:'pie',
            center:centerArr[index],
            hoverAnimation:false,
            labelLine:{
              show:false
            },
            label:{
              position:'center',
              color:colorArr[index][0],
            },
            data:[
              {
                itemStyle:{
                  color: new this.$echarts.graphic.LinearGradient(0 ,1, 0 ,0 ,[
                    {
                      offset:0,
                      color:colorArr[index][0]
                    },
                    {
                      offset:1,
                      color:colorArr[index][1]
                    }
                  ])
                },
                name:item.name + '\n' + item.sales,
                value:item.sales
              },
              {
                itemStyle:{
                  color:'#333843'
                },
                value:item.stock,

              }
            ]
          }
        })
        const dataOption = {
          series:seriesArr
        }
        this.chartInstance.setOption(dataOption)
      },
      screenAdapter(){
        const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 4.5
        const innerRadius = titleFontSize * 2
        const outterRadius = innerRadius * 1.125

        const adapterOption = {
          title:{
            textStyle:{
              fontSize:titleFontSize / 1.5
            }
          },
          series:[
            {
              type:'pie',
              radius: [outterRadius,innerRadius],
              label:{
                fontSize:titleFontSize / 2
              }
            },
            {
              type:'pie',
              radius: [outterRadius,innerRadius],
              label:{
                fontSize:titleFontSize / 2
              }
            },
            {
              type:'pie',
              radius: [outterRadius,innerRadius],
              label:{
                fontSize:titleFontSize / 2
              }
            },
            {
              type:'pie',
              radius: [outterRadius,innerRadius],
              label:{
                fontSize:titleFontSize / 2
              }
            },
            {
              type:'pie',
              radius: [outterRadius,innerRadius],
              label:{
                fontSize:titleFontSize / 2
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      setInterval(){
        if(this.timeID){
          clearInterval(this.timeID)
        }
       this.timeID = setInterval(()=>{
          this.currentIndex++
          if(this.currentIndex > 1){
            this.currentIndex = 0
          }
         this.updataChart()
        },3000)
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