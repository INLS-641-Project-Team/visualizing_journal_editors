// map functions 

render(us = false) {

    function handleZoom(e) {
        d3.select("#geoGraph").attr('transform', e.transform);
        this.render()
    }


    let zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .translateExtent([
            [0, 0],
            [this.width, this.height]
        ])
        .on('zoom', handleZoom)
    this.svg.call(zoom)

    // DRAW COUNTRIES
    this.svg.append("g")
        .selectAll("path")
        .data(us == false ? this.globe_data.features : this.us_data.features, d => us == false ? d.properties.geounit : d.properties.NAME)
        .join(
            enter => enter
            .append("path")
            .attr("class", "country")
            .attr("id", d => `${us == false? d.properties.geounit: d.properties.name}_drawing`)
            .attr('clip-path', 'url(#clippath)')
            .attr("fill", d => this.colorMap(us == true ? 2 : d.properties.editor_count ? d.properties.editor_count : 0))
            .attr("data-tippy-content", d => {
                let count = d.properties.editor_count ? d.properties.editor_count : 0
                let html = `<span><b>Country:</b> ${d.properties.geounit? d.properties.geounit: d.properties.NAME}</span><br><span><b>Editor Count:</b> ${Number.isFinite(count) == false? count : count.toLocaleString()}</span>`
                return html
            })
            .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))
            .attr("d", this.path),
            update => update
            .attr('d', this.path),
            exit => exit
            .remove());

    // DRAW LONG/LAT LINES
    this.svg.append("g")
        .attr("class", "graticule")
        .selectAll("path")
        .data(d3.geoGraticule().lines())
        .join(
            enter => enter
            .append("path")
            .attr("d", this.path)
            .attr('clip-path', 'url(#clippath)'),
            update => update
            .attr('d', this.path),
            exit => exit
            .remove());

    // DRAW MAP BORDER
    this.svg.append("g")
        .selectAll("path")
        .data([{ type: "Sphere" }])
        .join(
            enter => enter
            .append('path')
            .attr("class", "border")
            .style("fill", "none")
            .style("stroke", "gray")
            .style("stroke-width", 1.5)
            .attr("d", this.path),
            update => update
            .attr('d', this.path),
            exit => exit
            .remove());

    // DRAW CLIPPATH
    // Necessary for some of the projections
    this.svg.append('g')
        .selectAll('clipPath')
        .data([{ type: 'Sphere' }])
        .join(
            enter => enter
            .append('clipPath')
            .attr('id', 'clippath')
            .append('path')
            .attr('d', this.path),
            update => update
            .attr('d', this.path),
            exit => exit
            .remove()
        );

}

updateProjection(proj) {
    let update = true
    console.log(proj);
    let projection = this.projections.filter(x => x.name == proj)[0].value;
    this.buildMaps(proj = projection, update = true);
    // this.svg.selectAll('g').remove();
    // this.render(proj == 'AlbersUsa' ? true : false);
}

getProjection() {
    console.log(this.projection)
}