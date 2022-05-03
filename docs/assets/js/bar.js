class barGraph {

    constructor(id) {
        this.id = id
        this.data = false;
        this.graph = d3.select('#' + id)
        this.width = parseInt(window.getComputedStyle(this.graph.node()).width) // dimension of box
        this.height = parseInt(window.getComputedStyle(this.graph.node()).height) // dimension of box
        this.xMargin = this.width * 0.05;
        this.yMargin = this.height * 0.1;
        this.countriesScope = [];
        this.country_data = false;
        this.ed_data = false;
        this.pub_data = false;
        this.inst_data = false;
        this.sub_data = false;
    }

    create_attrs(country_data, filter, subfilter) {
        this.filter = filter;
        this.subfilter = subfilter;
        this.country_data = country_data;
        this.create_aggs(country_data, false);
        this.set_listener();
        return this
    }

    create_aggs(data, update) {

        let chosen_data = this.filter == 'country' ? this.country_data : this.filter == 'editor' ? this.ed_data : this.pub_data;

        if (update == false) {
            this.topData = Object.entries(chosen_data).filter(x => x[0] != null).sort(([, a], [, b]) => b[this.subfilter] - a[this.subfilter]).slice(0, 10).map(d => [d[1][this.filter], d[1][this.subfilter]]);
        } else {
            this.topData = data;
        }

        this.dataMin = d3.min(this.topData.map(x => x[1]))
        this.dataMax = d3.max(this.topData.map(x => x[1]))
        this.xScale = d3.scaleBand().domain(this.topData.map(d => d[0] == 'United States' ? 'U.S.A' : d[0] == 'United Kingdom' ? 'U.K.' : d[0])).range([0, this.width - 4 * this.xMargin]).padding(0.2);
        this.yScale = d3.scaleLinear().domain([0, this.dataMax + (this.dataMax * 0.1)]).range([this.height - 3 * this.yMargin, 0]);
        this.durationScale = d3.scaleLinear().domain([this.dataMin, this.dataMax]).range([200, 800]);
        this.chart = this.graph.append('g').attr("transform", `translate(${this.xMargin}, 0)`);


        return this

    }


    render() {

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
                .attr('y', d => this.height - 2 * this.yMargin)
                .attr('width', this.xScale.bandwidth())
                .attr('height', d => 1)
                .transition().delay(1000).duration(500)
                .attr('height', d => this.height - this.yScale(d[1]) - 3 * this.yMargin)
                .attr('y', d => this.yScale(d[1]) + this.yMargin)
                .attr('fill', '#467aaa')
                .attr("data-tippy-content", d => {
                    let count = d[1]
                    let html = `<span><b>${this.subfilter}:</b> ${Number.isFinite(count) == false? count : count.toLocaleString()}</span>`
                    return html
                })
                .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 })),
                update => update
                .transition().duration(1000)
                .attr('y', d => this.height - 2 * this.yMargin)
                .attr('height', 1)
                .transition().duration(500).delay(500)
                .attr('y', d => this.yScale(d[1]) + this.yMargin)
                .attr('height', d => this.height - this.yScale(d[1]) - 3 * this.yMargin),
                exit => exit
                .transition().delay(100).duration(1000)
                .attr('height', 1)
                .attr('y', d => this.height - 2 * this.yMargin)
            )

        return this
    }

    set_listener() {
        // CREATE EVENT LISTENER
        let bar_select = d3.select('#' + this.id + "-filter-select");
        bar_select.on('change', event => {
            this.subfilter = event.target.value;
            this.chart.selectAll("*").remove().transition().delay(100).duration(800);
            this.create_aggs(null, false);
            this.render();
        });
    }

    updateScope(countries, filter) {

        let j = filter == 'institution' ? 3 : 'editor' ? 1 : 7;
        let data = filter == 'institution' ? this.inst_data : 'editor' ? this.ed_data : this.pub_data;

        let filtered_list = [...new Set(mapVis.largeData.map(x => {
            if (countries.includes(Object.values(x)[5]) && Object.values(x)[j] != 'Unknown' && Object.values(x)[j] != undefined) {
                return Object.values(x)[j]
            }
        }))]

        let cont_list = Object.keys(data)
        let counts = Object.values(data).map(x => filter == 'institution' ? x.ed_count : filter == "editor" ? x.jrnl_count : x.journal)

        let sorted_list = filtered_list.map(x => {
            let index = cont_list.indexOf(x)
            return [x, index > 0 ? counts[index] : 0]
        })

        sorted_list = sorted_list.sort(([, a], [, b]) => b - a).splice(0, 10)
        d3.select('#filter_object').text('Institutions');
        this.chart.selectAll("*").remove().transition().delay(100).duration(800);
        this.create_aggs(sorted_list, true);
        this.render();

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

        //console.log(mapVis.largeData)
    }
}