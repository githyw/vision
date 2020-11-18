<template>
    <div class="com-container" @dblclick="revertMap">
        <div class="com-chart" ref="map_ref"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import 'assets/theme/chalk'
    import { mapState } from 'vuex'
    import { getProvinceMapInfo } from '@/utils/map_utils'
    export default {
    name: "Map",
    data(){
      return {
        chartInstance:null,
        allData:null,
        dataMap:{}
      }
    },
      created() {
        this.$socket.registerCallBack('mapData',this.getData)
      },
    mounted() {
      this.initChart()
      this.$socket.send({
        action:'getData',
        socketType:'mapData',
        chartName:'map',
        value:''
      })
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
        },
    destroyed() {
      window.removeEventListener('resize',this.screenAdapter)
      this.$socket.unRegisterCallBack('mapData')

    },
    methods:{
      async initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.map_ref,this.theme)
        const ret = await axios.get('http://42.192.16.209//map/china.json')
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
          },
          legend:{
            left:'10%',
            bottom:'15%',
            orient:'vertical'
          }
        }
        this.chartInstance.setOption(initOption)
        this.chartInstance.on('click',async arg =>{
          const provinceInfo = getProvinceMapInfo(arg.name)
          if(!this.dataMap[provinceInfo.key]){
            const ret = await axios.get('http://42.192.16.209/' + provinceInfo.path)
            this.dataMap[provinceInfo.key] = ret.data
            this.$echarts.registerMap(provinceInfo.key,ret.data)
          }
          const changeOption ={
            geo:{
              map:provinceInfo.key
            }
          }
          this.chartInstance.setOption(changeOption)
        })
      },
      getData(ret){
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
        const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 2.6
        const adapterOption = {
            title:{
              textStyle: {
                fontSize: titleFontSize
              }
            },
          legend:{
              itemGap:titleFontSize -10,
            itemWidth:titleFontSize - 10,
            itemHeight:titleFontSize - 10,
            textStyle:{
              fontSize:titleFontSize - 10,
            }
          }
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      revertMap(){
        const reverOption = {
          geo:{
            map:'china'
          }
        }
        this.chartInstance.setOption(reverOption)
      },
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