<template>
  <div>
    <div v-if="!removed">
      <h3>Chart with {{ currentOrder }} orders</h3>
    </div>
    <div id="gantt-chart" ref="gantt-chart"></div>
    <div
      v-if="!removed && $refs['gantt-chart'] && currentOrder > 5"
      class="pagination"
      :key="$refs['gantt-chart'].children[3].clientHeight"
      :style="{
        height: `${+heightMoreBtn + 200}px`,
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center'
      }"
    >
      <a class="butt w-auto c-pointer" @click="scroll">Show more</a>
    </div>
  </div>
</template>
<script>
import ordersJson from '../assets/orders.json'

export default {
  name: 'GunttChart',
  props: {
    currentOrder: {
      type: Number,
      required: true
    },
    removed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      ordersJson: ordersJson,
      page: 1,
      perPage: 25,
      heightMoreBtn: 0
    }
  },
  watch: {
    currentOrder: {
      handler(data) {
        this.$refs['gantt-chart'].textContent = ''
        this.page = 1
        this.generateGunttChart(data > 5 ? this.page * this.perPage : data)
        this.$emit('emitRemoved')
      }
    },
    removed: {
      handler(data) {
        if (data) {
          this.toRemove()
        }
      }
    }
  },
  mounted() {
    this.$refs['gantt-chart'].textContent = ''
    this.generateGunttChart(this.currentOrder > 5 ? this.page * this.perPage : this.currentOrder)
  },
  methods: {
    generateGunttChart(currentOrder) {
      const propeties = this.getProperties(currentOrder)
      const gantt = Object.create({
        ...d3.ganttChart,
        defaultParameters: {
          ...d3.ganttChart.defaultParameters,
          data: propeties.data,
          activities: propeties.activities
        }
      })
      gantt.init(propeties)
      gantt.draw()
      this.heightMoreBtn = this.$refs['gantt-chart'].children[3].clientHeight
    },
    toRemove() {
      d3.selectAll('.gantt-chart-x-axis').remove()
      d3.selectAll('.gantt-chart-y-axis').remove()
      d3.selectAll('.gantt-chart-container').remove()
    },
    scroll() {
      this.$refs['gantt-chart'].innerHTML = ''
      this.$refs['gantt-chart'].textContent = ''
      this.generateGunttChart(
        this.currentOrder > 5 ? ++this.page * this.perPage : this.currentOrder
      )
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    getProperties(orders) {
      const activities = []
      const data = []
      const currentOrders = new Array(orders < this.currentOrder ? orders : this.currentOrder)
      let orderIdx = 0
      for (let i = 0; i < currentOrders.length; i++) {
        if (orderIdx > ordersJson.length - 1) {
          orderIdx = 0
        }
        currentOrders[i] = ordersJson[orderIdx]

        let startDate = Date.parse(currentOrders[i].schedule)
        if (isNaN(startDate)) {
          currentOrders[i].schedule = currentOrders[i].schedule.replace('60', '00')
          let today = new Date(currentOrders[i].schedule)
          today.setHours(today.getHours() + 1)
          startDate = Date.parse(today)
        }

        let endDate = 0
        const color = this.getRandomColor()
        activities.push({
          name: currentOrders[i].name + i,
          description: `Description for ${currentOrders[i].name + i}`
        })
        currentOrders[i].operations.forEach((operation) => {
          endDate = startDate + +operation.compliance_rate
          data.push({
            activity: currentOrders[i].name + i,
            text: operation.name,
            fillColor: color,
            start: new Date(startDate),
            end: new Date(endDate)
          })

          startDate = endDate
        })
        orderIdx++
      }
      return {
        node: '#gantt-chart',
        activities: activities,
        data: data,

        xAxis: {
          interval: d3.timeHour.every(1),
          height: 80,
          label: {
            format: '%Y-%m-%d',
            dy: '-0.5em'
          }
        },
        yAxis: {
          width: 50
        }
      }
    }
  }
}
</script>
<style>
.gantt-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

.gantt-chart-y-axis {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 11;
  height: 100%;
  pointer-events: all;
}

.gantt-chart-x-axis {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  overflow-y: hidden;
  z-index: 10;
}

.gantt-chart-container {
  position: absolute;
  top: 0;
  right: 0;
  overflow-x: hidden;
}

.y-axis-tooltip {
  background-color: rgba(50, 50, 50, 0.8);
  color: white;
  font-family: sans-serif;
  padding: 4px;
  font-size: 75%;
}
</style>
