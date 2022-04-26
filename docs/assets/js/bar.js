class barGraph {

    constructor(id) {
        this.id = id
        this.data = false;
        this.graph = d3.select('#' + id)
        this.width = parseInt(window.getComputedStyle(this.graph.node()).width) // dimension of box
        this.height = parseInt(window.getComputedStyle(this.graph.node()).height) // dimension of box
        this.xMargin = this.width * 0.05;
        this.yMargin = this.height * 0.1;
    }

    create_attrs(data, filter, subfilter) {
        let v_name = filter == 'countries' ? 'country' : 'editor'
        this.filter = filter;
        this.nodeFilter = v_name;
        this.subfilter = subfilter;
        this.data = data;
        //console.log(`Filter:${filter} | Subfilter: ${subfilter}`)
        this.create_aggs();
        this.set_listener();
        return this
    }

    create_aggs() {


        this.topData = Object.entries(this.data[this.filter]).sort(([, a], [, b]) => b[this.subfilter] - a[this.subfilter]).slice(0, 10).map(d => [d[1][this.nodeFilter], d[1][this.subfilter]]);
        this.dataMin = d3.min(this.topData.map(x => x[1]))
        this.dataMax = d3.max(this.topData.map(x => x[1]))
        this.xScale = d3.scaleBand().domain(this.topData.map(d => d[0] == 'United States' ? 'U.S.A' : d[0] == 'United Kingdom' ? 'U.K.' : d[0])).range([0, this.width - 4 * this.xMargin]).padding(0.2);
        this.yScale = d3.scaleLinear().domain([0, this.dataMax + (this.dataMax * 0.1)]).range([this.height - 3 * this.yMargin, 0]);
        this.durationScale = d3.scaleLinear().domain([this.dataMin, this.dataMax]).range([200, 800]);
        this.chart = this.graph.append('g').attr("transform", `translate(${this.xMargin}, 0)`);
    }


    render() {

        this.chart.select('g').remove();
        // CREATE X AXIS
        this.chart
            .append('g')
            .attr('id', this.id + '-x')
            .attr('class', `${this.id}_${this.subfilter}`)
            .attr('transform', `translate(${this.xMargin}, ${this.height - 2 * this.yMargin})`)
            .transition().duration(500)
            .call(d3.axisBottom(this.xScale).ticks(this.topData.length))
            .selectAll('text')
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)")


        // CREATE Y AXIS
        this.chart
            .append('g')
            .attr('id', this.id + '-y')
            .attr('class', `${this.id}_${this.subfilter}`)
            .attr('transform', `translate(${this.xMargin}, ${this.yMargin})`)
            .transition().duration(500)
            .call(d3.axisLeft(this.yScale).ticks(5))


        // CREATE BARS FOR GRAPH
        this.chart.append('g').selectAll('rect').data(this.topData, d => d)
            .join(
                enter => enter
                .append('rect')
                .attr('x', d => this.xScale(d[0] == 'United States' ? 'U.S.A' : d[0] == 'United Kingdom' ? 'U.K.' : d[0]) + this.xMargin)
                .attr('y', d => this.yScale(d[1]) + this.yMargin)
                .attr('width', this.xScale.bandwidth())
                .attr('height', d => this.height - this.yScale(d[1]) - 3 * this.yMargin)
                .attr('fill', 'red')
                .attr("data-tippy-content", d => {
                    let count = d[1]
                    let html = `<span><b>${this.subfilter}:</b> ${Number.isFinite(count) == false? count : count.toLocaleString()}</span>`
                    return html
                })
                .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 })),
                update => update
                .transition().duration(500)
                .attr('y', this.height - 2 * this.yMargin)
                .attr('height', 2)
                .transition().duration(500).delay(500)
                .attr('height', d => this.height - this.yScale(d[1]) - 3 * this.yMargin),
                exit => exit
            )


    }

    set_listener() {
        // CREATE EVENT LISTENER
        let bar_select = d3.select('#' + this.id + "-filter-select");
        bar_select.on('change', event => {
            this.subfilter = event.target.value;
            this.create_aggs();
            this.render();
        });
    }


    updateGraph(filter) {

        filter = filter == 'United States of America' ? filter = 'United States' : filter
        let filtered_list = mapVis.largeData
            .filter(x => Object.values(x)[5] == filter)
            .map(x => Object.values(x)[7])
            .reduce((jList, journal) => {
                if (jList[journal] == true) { jList[journal]++ } else { jList[journal] = 1 }
                return jList
            }, {})
        console.log(filtered_list)
        console.log(filter)
            //console.log(mapVis.largeData)
        console.log(this.data)
    }
}