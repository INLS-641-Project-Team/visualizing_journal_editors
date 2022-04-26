class networkGraph {
    constructor() {
        this.svg = d3.select("#networkGraph")
        this.width = parseInt(window.getComputedStyle(this.svg.node()).width) // dimension of SVG
        this.height = parseInt(window.getComputedStyle(this.svg.node()).height); // dimension of SVG
        this.xMargin = this.width * 0.05;
        this.yMargin = this.height * 0.05;
    }

    // createNetworkData() {
    //     console.log(this.data)
    //     this.networkData = { "nodes": { "countries": [], "journals": [], 'editors': [] }, "links": { "countries": [], "journals": [], 'editors': [] } };
    //     Object.keys(this.data).forEach(d => {
    //         //d['countries'].push({ 'id': i, "name": d[0] })
    //     })
    // }

    async initialRender(data, filter = 'country') {
        this.network = this.svg.append("g").attr("transform", `translate(${this.width/2}, ${this.height/2}) scale(0.2)`).attr("id", "networkSpace");
        this.country_data = data;
        this.publisher_data = d3.json('assets/data/publisher_network.json', d => d);
        this.journal_data = d3.json('assets/data/journal_network.json', d => d);
        let filtered_data = filter == 'country' ? this.country_data : 'publisher' ? this.publisher_data : this.journal_data;
        let width = this.width,
            height = this.height;
        let weights = filtered_data['edges'].map(d => Math.log10(d.weight))
        let linkScale = d3.scaleLinear().domain([ss.min(weights), ss.max(weights)]).range([5, 200]);
        let nodeScale = d3.scaleLinear().domain([1, 300]).range([10, 100])
        let link, node;
        let simulation = d3.forceSimulation(filtered_data['nodes']);

        // This algorithm taken from https://stackoverflow.com/questions/56225369/javascript-get-count-of-object-with-specific-value
        let counts = filtered_data['edges'].reduce((c, { "source": key }) => (c[key] = (c[key] || 0) + 1, c), {});

        console.log(counts[0])
        initializeDisplay();
        initializeForces();
        simulation.on('tick', ticked)



        function initializeDisplay() {
            link = d3.select('#networkSpace').append('g').attr('class', 'links')
                .selectAll('.link')
                .data(filtered_data['edges'], d => d)
                .join(
                    enter => enter
                    .append('line')
                    .transition().duration(50).delay(200)
                    .attr('class', 'link')
                    .style('stroke', '#aaa')
                    .style('stroke-width', 2)
                    .style('z-index', 998),
                    update => update,
                    exit => exit
                )

            node = d3.select('#networkSpace').append('g').attr('class', 'nodes')
                .selectAll('circle')
                .data(filtered_data['nodes'], d => d.id)
                .join(
                    enter => enter
                    .append('circle')
                    .attr('class', 'node')
                    .style('fill', '#647aaa')
                    .style("z-index", 999)
                    .attr('r', 1)
                    .attr("data-tippy-content", d => {
                        let html = `<span><b>Country:</b> ${d.name}</span><br><span><b>Editor Count:</b> TEST</span>`
                        return html
                    })
                    .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))
                    .transition().duration(70).delay((d, i) => 50 * i)
                    .attr('r', d => nodeScale(counts[d.id])),
                    update => update,
                    exit => exit
                );
        }

        function initializeForces() {

            simulation
                .force("charge", d3.forceManyBody().strength(-300).theta(0.5))
                .force("collide", d3.forceCollide().strength(.7).radius(20).iterations(1))
                .force("center", d3.forceCenter().x(width / 2).y(height / 2))
                .force('link', d3.forceLink().id(d => d.id).links(filtered_data['edges']).strength(d => 1 / linkScale(d.weight)).iterations(1))

            simulation.alpha(0.5).restart();


        }

        function ticked() {

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            d3.select('#alpha_value').style('flex-basis', (simulation.alpha() * 100) + "%");
        }

    }



    async render(data, filter = 'country') {

        this.country_data = data;
        this.publisher_data = d3.json('assets/data/publisher_network.json', d => d);
        this.journal_data = d3.json('assets/data/journal_network.json', d => d);

        let filtered_data = filter == 'country' ? this.country_data : 'publisher' ? this.publisher_data : this.journal_data;

        console.log(filtered_data)
            // links
        let link = this.network.selectAll(".link")
            .data(filtered_data['edges'], d => d)
            .join(
                enter => enter
                .append('line')
                .attr('class', 'link')
                .transition().delay(2000)
                .style('stroke', '#aaa')
                .style("stroke-width", 1),
                update => update
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y),
                exit => exit
            );

        // nodes
        let nodes = this.network.selectAll(".node")
            .data(filtered_data['nodes'], d => d.id)
            .join(
                enter => enter
                .append('circle')
                .attr('class', 'node')
                .style('fill', '#647aaa')
                .style("z-index", 999)
                .attr('r', 0)
                .attr("data-tippy-content", d => {
                    let html = `<span><b>Country:</b> ${d.country}</span><br><span><b>Editor Count:</b> TEST</span>`
                    return html
                })
                .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))
                .transition().duration(10).delay((d, i) => 10 + 12 * i)
                .attr('r', 10),
                update => update
                .attr('cx', d => d.x)
                .attr('cy', d => d.y),
                exit => exit
            );

        // force
        let simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(filtered_data['edges'])
                .id(d => d.id)
                .links(filtered_data['edges'])
            )
            .force("charge", d3.forceManyBody().strength(-200).distanceMin(10).distanceMax(150))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .on('end', ticked);

        // updating network
        function ticked() {

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
        }


    }
}