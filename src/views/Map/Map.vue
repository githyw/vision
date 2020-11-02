<template>
    <div class="com-container">
        <div class="com-chart" ref="map_ref">1111</div>
    </div>
</template>

<script>
    import axios from 'axios'
    import 'assets/theme/chalk'
    export default {
    name: "Map",
    data(){
      return {
        chartInstance:null,
        allData:null
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
    methods:{
      async initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
        const ret = await axios.get('http://localhost:8080/map/china.json')
        this.$echarts.registerMap('china',ret.data)
        const initOption = {
          title:{
            text:'★ 商家分布 ☆',
            left:20,
            top:20
          },
          geo:{
            type:'map',
            map:'china',
            top:'3%',
            bottom:'5%',
            itemStyle:{
              areaColor:'#2E72Bf',
              borderColor:'#333',
            },
            label: {
              normal: { //静态的时候展示样式
                textStyle: {
                  color: "#fff",
                  fontSize: 10,
                  fontFamily: "Arial"
                },
                emphasis: { //动态展示的样式
                  color:'#eeeeee',
                },
              }
            },
          },
          legend:{
            left:'10%',
            bottom:'15%',
            orient:'vertical'
          }
        }
        this.chartInstance.setOption(initOption)
      },
      async getData(){
        const { data:ret } = await this.$http.get('map')
        this.allData = ret
        this.updataChart()
      },
      updataChart(){
        const legendArr = this.allData.map(item => item.name)
        const seriesArr = this.allData.map(item =>{
          return {
            type:'effectScatter',
            rippleEffect:{
              scale:5,
              brushType:'stroke'
            },
            name:item.name,
            data:item.children,
            coordinateSystem:'geo'
          }
        })
        const dataOption = {
          legend:{
            data:legendArr
          },
          series:seriesArr
        }
        this.chartInstance.setOption(dataOption)
      },
      screenAdapter(){
        const adapterOption = {}
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
  }
</script>

<style scoped>

</style>