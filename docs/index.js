// adds drop shadow and reveals full project name on the nav bar upon scrolling
window.addEventListener("scroll", e => {
    let nav = document.getElementById("nav");
    let text = Array.from(document.getElementsByClassName("restWord"), x => x);
    if (window.pageYOffset > 0) {
        nav.classList.add("shadow");
        text.forEach(x => {
            x.style.display = "inline-block";
        })
    } else {
        nav.classList.remove("shadow");
        text.forEach(x => {
            x.style.display = "none";
        })
    }
})

class bannerVis {
    constructor(div_id) {
        this.div_id = div_id;
        this.data = [...Array(11).keys()];
    }

    render() {

        console.log("render called from HTML page!");

        let edgeData = [...Array(10).keys()]
        let imgDiv = d3.select("#" + this.div_id);

        // let scaleX = d3.scaleLinear().domain([0, 30]).range([-90 * (Math.PI / 180), 90 * (Math.PI / 180)]);
        // let scaleY = d3.scaleLinear().domain([0, 30]).range([380, 400]);

        let icon_selection = imgDiv.selectAll(".book-icon").data(this.data);
        let edge_selection = imgDiv.selectAll(".edge").data(edgeData);

        icon_selection.join(
            enter => enter
            .append("svg")
            .attr("xlms", "http://www.w3.org/2000/svg")
            .attr("viewBox", "0 0 512 512")
            .html('<path d="M0 219.2v212.5c0 14.25 11.62 26.25 26.5 27C75.32 461.2 180.2 471.3 240 511.9V245.2C181.4 205.5 79.99 194.8 29.84 192C13.59 191.1 0 203.6 0 219.2zM482.2 192c-50.09 2.848-151.3 13.47-209.1 53.09C272.1 245.2 272 245.3 272 245.5v266.5c60.04-40.39 164.7-50.76 213.5-53.28C500.4 457.9 512 445.9 512 431.7V219.2C512 203.6 498.4 191.1 482.2 192zM352 96c0-53-43-96-96-96S160 43 160 96s43 96 96 96S352 149 352 96z"/>')
            .attr("class", "book-icon")
            .attr("width", 0 + "em")
            .attr("height", 0 + "em")
            .attr("x", d => d * 9 + "%")
            .attr("y", d => d % 2 == 0 ? 75 + "%" : 25 + "%")
            .attr("opacity", 0)
            .transition().duration(700).delay(d => d * 700)
            .attr("width", 2 + "em")
            .attr("height", 2 + "em")
            .attr("opacity", 1),
            update => update,
            exit => exit
        );

        edge_selection.join(
            e => e
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", "0px")
            .attr("x1", d => d * 9 + 3 + "%")
            .attr("y1", d => d % 2 == 0 ? 80 + "%" : 43 + "%")
            .attr("x2", d => d * 9 + 3 + "%")
            .attr("y2", d => d % 2 == 0 ? 80 + "%" : 43 + "%")
            .transition().duration(700).delay(d => d * 700 + 350)
            .attr("x2", d => (d + 1) * 9 - 0.5 + "%")
            .attr("y2", d => d % 2 == 0 ? 43 + "%" : 80 + "%")
            .attr("stroke-width", "3px"),
            u => u,
            ex => ex
        )

    }
}

let bookVis = new bannerVis("introBanner");
bookVis.render();

class mapVis {

    constructor(div_id) {
        this.div_id = div_id;
    }



    async render() {

        // select container and create visualization
        let svg = d3.select("#" + this.div_id)
        let svg_height = svg._parents[0].clientHeight
        let svg_width = svg._parents[0].clientWidth
        let projection = d3.geoRobinson().scale(130).translate([svg_width / 2, svg_height / 3])
        let path = d3.geoPath().projection(projection);

        // load and prepare data
        let map_data = await d3.json("world_geo.json", d => d);
        console.log(map_data);
        let ed_data = await d3.csv("cleaned_csv2.csv", d => d);
        console.log(ed_data);
        let country_conc = {}
        ed_data.forEach(d => !(d.country in country_conc) ? country_conc[d.country] = 1 : country_conc[d.country] += 1)

        let map_countries = []
        map_data.features.forEach(d => {
            map_countries.push(d.properties.geounit)
        })
        console.log(country_conc)

        map_data.features.forEach(d => {
            if (country_conc[d.properties.geounit]) {
                d.properties['editor_count'] = country_conc[d.properties.geounit]
            } else if (d.properties.geounit == 'United States of America') {
                d.properties['editor_count'] = country_conc["United States"]
            } else if (d.properties.geounit == 'Hong Kong S.A.R.') {
                d.properties['editor_count'] = country_conc["Hong Kong"]
            } else if (d.properties.geounit == 'Ivory Coast') {
                d.properties['editor_count'] = country_conc["Côte d'Ivoire"]
            } else if (d.properties.geounit == 'Syria') {
                d.properties['editor_count'] = country_conc["Syrian Arab Republic"]
            } else if (d.properties.geounit == 'South Korea') {
                d.properties['editor_count'] = country_conc["Korea"]
            } else if (d.properties.geounit == 'Guinea Bissau') {
                d.properties['editor_count'] = country_conc["Guinea-Bissau"]
            } else if (d.properties.geounit == 'The Bahamas') {
                d.properties['editor_count'] = country_conc["Bahamas"]
            } else if (d.properties.geounit == 'Macao S.A.R') {
                d.properties['editor_count'] = country_conc["Macau"]
            } else if (d.properties.geounit == 'Republic of Serbia') {
                d.properties['editor_count'] = country_conc["Serbia"]
            } else if (d.properties.geounit == 'Democratic Republic of the Congo') {
                d.properties['editor_count'] = country_conc["Congo"]
            } else {
                d.properties['editor_count'] = 'Unknown'
            }
        })


        // create colorscale for map
        let colorMap = d3.scaleLinear().domain([0, 123844]).range(["#f2f2f2", 'purple']);

        // draw countries
        svg.append("g")
            .selectAll("path")
            .data(map_data.features)
            .join("path")
            .attr("class", "country")
            .attr("id", d => `${d.properties.geounit}_drawing`)
            .attr("fill", d => colorMap(d.properties.editor_count ? d.properties.editor_count : 0))
            .attr("data-tippy-content", d => {
                let count = d.properties.editor_count
                let html = `<span><b>Country:</b> ${d.properties.geounit}</span><br><span><b>Editor Count:</b> ${Number.isFinite(count) == false? count : count.toLocaleString()}</span>`
                return html
            })
            .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))
            .attr("d", path)

        // draw lat/long lines
        svg.append("g")
            .attr("class", "graticule")
            .selectAll("path")
            .data(d3.geoGraticule().lines())
            .join("path")
            .attr("d", path);

        // draw border around globe
        svg.append("g")
            .selectAll("path")
            .data([{ type: "Sphere" }])
            .join("path")
            .attr("class", "border")
            .style("fill", "none")
            .style("stroke", "gray")
            .style("stroke-width", 2)
            .attr("d", path);

    }

}

let geoVis = new mapVis("geoGraph")
geoVis.render()