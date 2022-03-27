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


let data = [...Array(11).keys()]



class bannerVis {
    constructor(div_id, data) {
        this.div_id = div_id;
        this.data = data;
    }

    render() {

        console.log("render called from HTML page!");

        let edgeData = [...Array(10).keys()]
        let imgDiv = d3.select("#" + this.div_id);

        // let scaleX = d3.scaleLinear().domain([0, 30]).range([-90 * (Math.PI / 180), 90 * (Math.PI / 180)]);
        // let scaleY = d3.scaleLinear().domain([0, 30]).range([380, 400]);

        let icon_selection = imgDiv.selectAll(".book-icon").data(data);
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

let bookVis = new bannerVis("introBanner", data);
bookVis.render();

class mapVis {

    constructor(div_id) {
        this.div_id = div_id;
    }

    async render() {

        // load data
        let map_data = await d3.json("world_geo.json", d => d)


        // select container and create visualization
        let svg = d3.select("#" + this.div_id)
        let svg_height = svg._parents[0].clientHeight
        let svg_width = svg._parents[0].clientWidth
        let projection = d3.geoRobinson().scale(140).translate([svg_width / 2, svg_height / 3])
        let path = d3.geoPath().projection(projection);

        // prepare data
        let data = await d3.csv("cleaned_csv2.csv", d => d);
        let country_conc = {}
        data.forEach(d => !(d.country in country_conc) ? country_conc[d.country] = 1 : country_conc[d.country] += 1)

        let map_countries = []
        map_data.features.forEach(d => {
            map_countries.push(d.properties.geounit)
        })
        let data_countries = Array.from(Object.keys(country_conc));
        data_countries.map(d => d.trim().toLowerCase())

        console.log(data_countries)
        console.log(map_countries)

        map_data.features.forEach(d => {
            if (data_countries.map(d => d.trim().toLowerCase()).includes(d.properties.geounit.trim().toLowerCase())) {
                d.properties['editor_count'] = country_conc[d.properties.geounit.trim()]
                console.log(`${d.properties.geounit} has ${d.properties['editor_count']} editors!`)
            } else if (d.properties.geounit == 'United States of America') {
                d.properties['editor_count'] = country_conc['United States']
                console.log(`${d.properties.geounit} has ${d.properties['editor_count']} editors!`)
            } else if (d.properties.geounit == 'Hong Kong S.A.R.') {
                d.properties['editor_count'] = country_conc['Hong Kong']
                console.log(`${d.properties.geounit} has ${d.properties['editor_count']} editors!`)
            } else {
                console.log(`----${d.properties.geounit} didn't work!`)
            }
        })

        data_countries.forEach(d => {
            if (!map_countries.includes(d)) {
                console.log(d)
            }
        })

        // create colorscale for map
        let colorMap = d3.scaleLinear().domain([0, d3.max(Object.values(country_conc))]).range(["green", "#467aaa"]);

        // draw countries
        svg.append("g")
            .attr("class", "country")
            .selectAll("path")
            .data(map_data.features)
            .join("path")
            .attr("fill", d => colorMap(d.properties.editor_count))
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
            .style("stroke-width", 3)
            .attr("d", path);

    }

}

let geoVis = new mapVis("geoGraph")
geoVis.render()