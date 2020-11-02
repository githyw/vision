<template>
    <div class="com-container">
        <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>

<script>
    import 'assets/theme/chalk'
  export default {
    name: "Seller",
    data(){
      return {
        chartInstance: null,
        allData:null,
        currentPage:1,
        totalPage:0,
        timerID:null,
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      clearInterval(this.timerID)
      window.removeEventListener('resize',this.screenAdapter)
    },
    methods:{
      initChart () {
       this.chartInstance = this.$echarts.init(this.$refs.seller_ref,"chalk")
        const initOption ={
          title:{
            text:'★ 商家商品销售情况 ☆',
            left:20,
            top:15,
          },
          grid:{
            left:'3%',
            right:'3%',
            bottom:'2%',
            containLabel:true
          },
          xAxis:{
            type:'value'
          },
          yAxis:{
            type:'category',
          },
          //背景
          tooltip:{
            trigger:'axis',
            axisPointer:{
              type:'line',
              z:0,
              lineStyle:{
                color:'#2D3443'
              }
            }
          },
          series:[
            {
              type:'bar',
              label:{
                show:true,
                position:'right',
                textStyle:{
                  color:'white',
                }
              },
              itemStyle:{
                color: new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                  {
                    offset:0,
                    color:'#5052EE'
                  },
                  {
                    offset:1,
                    color:'#AB6EE5'
                  }
                ])
              }
            }
          ]
        }
        this.chartInstance.setOption(initOption)

       this.chartInstance.on('mouseover',()=>{
         clearInterval(this.timerID)
       })
        this.chartInstance.on('mouseout',()=>{
          this.ctartInterval()
        })
      },
     async getData () {
       const { data:ret } = await this.$http.get('seller')
       console.log(ret)
       this.allData = ret
       this.allData.sort(( a , b ) => a.value - b.value)
       this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
       this.updataChart()
       this.ctartInterval()
     },
      updataChart () {
        const start = (this.currentPage - 1) * 5
        const end = this.currentPage * 5
        const showData = this.allData.slice(start,end)
        const sellerNames = showData.map(item => item.name)
        const sellerValue = showData.map(item => item.value)
        console.log(sellerValue)
        const dataOption ={
          yAxis:{
            data:sellerNames
          },
          series:[
            {
              data:sellerValue,
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      ctartInterval(){
        if(this.timerID){
          clearInterval(this.timerID)
        }
       this.timerID = setInterval(() =>{
          this.currentPage++
          if(this.currentPage > this.totalPage){
            this.currentPage = 1
          }
          this.updataChart()
         console.log(this.totalPage,'----',this.currentPage)
       },3000)
      },
      screenAdapter() {
        const titleFontSize = this.$refs.seller_ref.offsetWidth /100 * 3.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize:titleFontSize/2,
            }
          },
          //背景
          tooltip:{
            axisPointer:{
              lineStyle:{
                width:titleFontSize,
              }
            }
          },
          series:[
            {
              barWidth:titleFontSize,
              itemStyle:{
                barBorderRadius:[0,titleFontSize/2,titleFontSize/2,0],
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }

    }

  }
</script>

<style scoped lang="less">

</style>