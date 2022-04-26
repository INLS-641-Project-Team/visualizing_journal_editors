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

// From https://observablehq.com/@d3/projection-comparison
let projections = [
    { name: "Airy’s minimum error", value: d3.geoAiry },
    { name: "Aitoff", value: d3.geoAitoff },
    { name: "American polyconic", value: d3.geoPolyconic },
    { name: "armadillo", value: d3.geoArmadillo },
    { name: "August", value: d3.geoAugust },
    { name: "azimuthal equal-area", value: d3.geoAzimuthalEqualArea },
    { name: "azimuthal equidistant", value: d3.geoAzimuthalEquidistant },
    { name: "Baker dinomic", value: d3.geoBaker },
    { name: "Berghaus’ star", value: d3.geoBerghaus },
    { name: "Bertin’s 1953", value: d3.geoBertin1953 },
    { name: "Boggs’ eumorphic", value: d3.geoBoggs },
    { name: "Boggs’ eumorphic (interrupted)", value: d3.geoInterruptedBoggs },
    { name: "Bonne", value: d3.geoBonne },
    { name: "Bottomley", value: d3.geoBottomley },
    { name: "Bromley", value: d3.geoBromley },
    { name: "Butterfly (gnomonic)", value: d3.geoPolyhedralButterfly },
    { name: "Butterfly (Collignon)", value: d3.geoPolyhedralCollignon },
    { name: "Butterfly (Waterman)", value: d3.geoPolyhedralWaterman },
    { name: "Collignon", value: d3.geoCollignon },
    // {name: "conic conformal", value: d3.geoConicConformal}, // Not suitable for world maps.
    { name: "conic equal-area", value: d3.geoConicEqualArea },
    { name: "conic equidistant", value: d3.geoConicEquidistant },
    { name: "Craig retroazimuthal", value: d3.geoCraig },
    { name: "Craster parabolic", value: d3.geoCraster },
    { name: "cylindrical equal-area", value: d3.geoCylindricalEqualArea },
    { name: "cylindrical stereographic", value: d3.geoCylindricalStereographic },
    { name: "Eckert I", value: d3.geoEckert1 },
    { name: "Eckert II", value: d3.geoEckert2 },
    { name: "Eckert III", value: d3.geoEckert3 },
    { name: "Eckert IV", value: d3.geoEckert4 },
    { name: "Eckert V", value: d3.geoEckert5 },
    { name: "Eckert VI", value: d3.geoEckert6 },
    { name: "Eisenlohr conformal", value: d3.geoEisenlohr },
    { name: "Equal Earth", value: d3.geoEqualEarth },
    { name: "Equirectangular (plate carrée)", value: d3.geoEquirectangular },
    { name: "Fahey pseudocylindrical", value: d3.geoFahey },
    { name: "flat-polar parabolic", value: d3.geoMtFlatPolarParabolic },
    { name: "flat-polar quartic", value: d3.geoMtFlatPolarQuartic },
    { name: "flat-polar sinusoidal", value: d3.geoMtFlatPolarSinusoidal },
    { name: "Foucaut’s stereographic equivalent", value: d3.geoFoucaut },
    { name: "Foucaut’s sinusoidal", value: d3.geoFoucautSinusoidal },
    { name: "general perspective", value: d3.geoSatellite },
    { name: "Gilbert’s two-world", value: d3.geoGilbert },
    { name: "Gingery", value: d3.geoGingery },
    { name: "Ginzburg V", value: d3.geoGinzburg5 },
    { name: "Ginzburg VI", value: d3.geoGinzburg6 },
    { name: "Ginzburg VIII", value: d3.geoGinzburg8 },
    { name: "Ginzburg IX", value: d3.geoGinzburg9 },
    { name: "Goode’s homolosine", value: d3.geoHomolosine },
    { name: "Goode’s homolosine (interrupted)", value: d3.geoInterruptedHomolosine },
    { name: "gnomonic", value: d3.geoGnomonic },
    { name: "Gringorten square", value: d3.geoGringorten },
    { name: "Gringorten quincuncial", value: d3.geoGringortenQuincuncial },
    { name: "Guyou square", value: d3.geoGuyou },
    { name: "Hammer", value: d3.geoHammer },
    { name: "Hammer retroazimuthal", value: d3.geoHammerRetroazimuthal },
    { name: "HEALPix", value: d3.geoHealpix },
    { name: "Hill eucyclic", value: d3.geoHill },
    { name: "Hufnagel pseudocylindrical", value: d3.geoHufnagel },
    { name: "Kavrayskiy VII", value: d3.geoKavrayskiy7 },
    { name: "Lagrange conformal", value: d3.geoLagrange },
    { name: "Larrivée", value: d3.geoLarrivee },
    { name: "Laskowski tri-optimal", value: d3.geoLaskowski },
    // {name: "Littrow retroazimuthal", value: d3.geoLittrow}, // Not suitable for world maps.
    { name: "Loximuthal", value: d3.geoLoximuthal },
    { name: "Mercator", value: d3.geoMercator },
    { name: "Miller cylindrical", value: d3.geoMiller },
    { name: "Mollweide", value: d3.geoMollweide },
    { name: "Mollweide (Goode’s interrupted)", value: d3.geoInterruptedMollweide },
    { name: "Mollweide (interrupted hemispheres)", value: d3.geoInterruptedMollweideHemispheres },
    { name: "Natural Earth", value: d3.geoNaturalEarth1 },
    { name: "Natural Earth II", value: d3.geoNaturalEarth2 },
    { name: "Nell–Hammer", value: d3.geoNellHammer },
    { name: "Nicolosi globular", value: d3.geoNicolosi },
    { name: "orthographic", value: d3.geoOrthographic },
    { name: "Patterson cylindrical", value: d3.geoPatterson },
    { name: "Peirce quincuncial", value: d3.geoPeirceQuincuncial },
    { name: "rectangular polyconic", value: d3.geoRectangularPolyconic },
    { name: "Robinson", value: d3.geoRobinson },
    { name: "sinusoidal", value: d3.geoSinusoidal },
    { name: "sinusoidal (interrupted)", value: d3.geoInterruptedSinusoidal },
    { name: "sinu-Mollweide", value: d3.geoSinuMollweide },
    { name: "sinu-Mollweide (interrupted)", value: d3.geoInterruptedSinuMollweide },
    { name: "stereographic", value: d3.geoStereographic },
    { name: "Times", value: d3.geoTimes },
    { name: "Tobler hyperelliptical", value: d3.geoHyperelliptical },
    { name: "transverse Mercator", value: d3.geoTransverseMercator },
    { name: "Van der Grinten", value: d3.geoVanDerGrinten },
    { name: "Van der Grinten II", value: d3.geoVanDerGrinten2 },
    { name: "Van der Grinten III", value: d3.geoVanDerGrinten3 },
    { name: "Van der Grinten IV", value: d3.geoVanDerGrinten4 },
    { name: "Wagner IV", value: d3.geoWagner4 },
    { name: "Wagner VI", value: d3.geoWagner6 },
    { name: "Wagner VII", value: d3.geoWagner7 },
    { name: "Werner", value: () => d3.geoBonne().parallel(90) },
    { name: "Wiechel", value: d3.geoWiechel },
    { name: "Winkel tripel", value: d3.geoWinkel3 }
]

// list the projects
let projectionForm = d3.select("#projection-select")



projectionForm.selectAll('.projection').data(projections, d => d)
    .join(
        enter => enter
        .append("option")
        .text(d => d.name)
        .attr("class", 'projection')
        .attr("name", d => d.name)
        .attr('value', d => d.name),
        update => update,
        exit => exit
    );


class bannerVis {
    constructor(div_id) {
        this.div_id = div_id;
        this.data = [...Array(11).keys()];
    };

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
            // .transition().duration(700).delay(d => d * 700)
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
//bookVis.render();

class visGraphs {

    constructor(div_id) {
        this.div_id = div_id;
    }

    updateProj(proj) {
        let result = projections.filter(x => {
            return x.name === proj.value
        })[0]
        d3.select('#geoGraph').selectAll('g').remove()
        geoVis.createMap(result.value)
    }

    // dynamically renders the main map visualization 
    // recieves projection from select options
    // fData = filtered data 
    createMap(fData = map_data, proj) {


        console.log(fData);

        // INITIALIZING VARIABLES
        // width/height code from https://stackoverflow.com/questions/44017721/d3-js-v4-9-get-the-calculated-width-of-selected-element
        const svg = d3.select("#geoGraph")
        const width = parseInt(window.getComputedStyle(svg.node()).width) // dimension of SVG
        const height = parseInt(window.getComputedStyle(svg.node()).height); // dimension of SVG
        const xMargin = width * 0.05; // x-axis margin
        const yMargin = height * 0.5; // y-axis margin

        // CREATING PROJECTION
        // scaling inspired by https://observablehq.com/@d3/projection-comparison
        let projection = proj().translate([width / 2, height / 2]);
        projection.scale(projection.scale() * (300) / 500)
        let path = d3.geoPath().projection(projection);

        // create map colorscale ; 123884 is the high num of editors per country
        // ** NEEDS UPDATING ** UPDATE DOMAIN TO BE DYNAMIC -- UPDATE COLOR PALETTE
        const colorMap = d3.scaleLinear().domain([0, 123844]).range(["#f2f2f2", 'purple']);

        // DRAW COUNTRIES
        svg.append("g")
            .selectAll("path")
            .data(fData.features)
            .join(
                enter => enter
                .append("path")
                .attr("class", "country")
                .attr("id", d => `${d.properties.geounit}_drawing`)
                .attr('clip-path', 'url(#clippath)')
                .attr("fill", d => colorMap(d.properties.editor_count ? d.properties.editor_count : 0))
                .attr("data-tippy-content", d => {
                    let count = d.properties.editor_count
                    let html = `<span><b>Country:</b> ${d.properties.geounit}</span><br><span><b>Editor Count:</b> ${Number.isFinite(count) == false? count : count.toLocaleString()}</span>`
                    return html
                })
                .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))
                .attr("d", path),
                update => update
                .attr('d', path),
                exit => exit
                .remove());

        // DRAW LONG/LAT LINES
        svg.append("g")
            .attr("class", "graticule")
            .selectAll("path")
            .data(d3.geoGraticule().lines())
            .join(
                enter => enter
                .append("path")
                .attr("d", path)
                .attr('clip-path', 'url(#clippath)'),
                update => update
                .attr('d', path),
                exit => exit
                .remove());

        // DRAW MAP BORDER
        svg.append("g")
            .selectAll("path")
            .data([{ type: "Sphere" }])
            .join(
                enter => enter
                .append('path')
                .attr("class", "border")
                .style("fill", "none")
                .style("stroke", "gray")
                .style("stroke-width", 1.5)
                .attr("d", path),
                update => update
                .attr('d', path),
                exit => exit
                .remove());

        // DRAW CLIPPATH
        // Necessary for some of the projections
        svg.append('g')
            .selectAll('clipPath')
            .data([{ type: 'Sphere' }])
            .join(
                enter => enter
                .append('clipPath')
                .attr('id', 'clippath')
                .append('path')
                .attr('d', path),
                update => update
                .attr('d', path),
                exit => exit
            );



        return true
    }

    //  DYNAMICALLY RENDERS BOTH BAR GRAPHS
    createBarGraphs(fData1, fData2, filter1 = false, filter2 = false) {

        //  PREPARE DATA
        let topData1 = Object.entries(fData1).sort(([, a], [, b]) => b['editors'] - a['editors']).slice(0, 10).map(d => [d[0], d[1]['editors']]);
        let topData2 = Object.entries(fData2).sort(([, a], [, b]) => b - a).slice(0, 10).map(d => [d[0], d[1]]);
        console.log(topData2);

        // INITIALIZING VARIABLES
        const bg1 = d3.select('#bar_1');
        const bg2 = d3.select('#bar_2');
        const width = parseInt(window.getComputedStyle(bg1.node()).width) // dimension of box
        const height = parseInt(window.getComputedStyle(bg1.node()).height) // dimension of box
        const xMargin = width * 0.05;
        const yMargin = height * 0.1;
        const scaleY1 = d3.scaleLinear().domain([0, 150000]).range([height - 3 * yMargin, 0])
        const scaleX1 = d3.scaleBand().domain(topData1.map(d => d[0] == 'United States' ? 'U.S.A' : d[0] == 'United Kingdom' ? 'U.K.' : d[0])).range([0, width - 4 * xMargin]).padding(0.2)
        const scaleY2 = d3.scaleLinear().domain([0, 400]).range([height - 3 * yMargin, 0])
        const scaleX2 = d3.scaleBand().domain(topData2.map(d => d[0])).range([0, width - 4 * xMargin]).padding(0.2)
        const durationScale = d3.scaleLinear().domain([200, 140000]).range([500, 1000])

        // CREATE TITLES
        bg1.append('text').attr('x', width / 3).attr('y', 0.5 * yMargin).attr('dy', '1em').text(`Top 10 Countries With Most Editors`);
        bg2.append('text').attr('x', width / 4).attr('y', 0.5 * yMargin).attr('dy', '1em').text(`Top 10 Editors by Number of Editorial Positions`);

        // CREATE CHARTS
        const chart1 = bg1.append('g').attr("transform", `translate(${xMargin}, ${yMargin})`);
        const chart2 = bg2.append('g').attr("transform", `translate(${xMargin}, ${yMargin})`);

        // CREATE Y-AXIS 
        chart1.append('g').attr('transform', `translate(${xMargin}, ${yMargin})`).call(d3.axisLeft(scaleY1).ticks(5));
        chart2.append('g').attr('transform', `translate(${xMargin}, ${yMargin})`).call(d3.axisLeft(scaleY2).ticks(5));

        // CREATE x-AXIS
        chart1.append('g').attr('transform', `translate(${xMargin}, ${298 - 2 * yMargin})`).call(d3.axisBottom(scaleX1).ticks(10))
        chart2.append('g').attr('transform', `translate(${xMargin}, ${298 - 2 * yMargin})`).call(d3.axisBottom(scaleX2).ticks(10))


        // CREATE BARS FOR CHART 1
        chart1.append('g').selectAll('rect').data(topData1, d => d)
            .join(
                enter => enter
                .append('rect')
                .attr('x', d => scaleX1(d[0] == 'United States' ? 'U.S.A' : d[0] == 'United Kingdom' ? 'U.K.' : d[0]) + 30)
                .attr('y', height - 2 * yMargin)
                .attr('width', scaleX1.bandwidth())
                .attr('height', 0)
                .attr('fill', 'red')
                .transition()
                .duration(d => durationScale(d[1]))
                .delay((d, i) => 800 - durationScale(d[1]))
                .attr('height', d => height - scaleY1(d[1]) - 3 * yMargin)
                .attr('y', d => scaleY1(d[1]) + yMargin),
                update => update,
                exit => exit
            )

        // CREATE BARS FOR CHART 2
        chart2.append('g').selectAll('rect').data(topData2, d => d)
            .join(
                enter => enter
                .append('rect')
                .attr('x', d => scaleX2(d[0]) + 30)
                .attr('y', height - 2 * yMargin)
                .attr('width', scaleX2.bandwidth())
                .attr('height', 0)
                .attr('fill', 'red')
                .transition()
                .duration(d => durationScale(d[1]))
                .delay((d, i) => 800 - durationScale(d[1]))
                .attr('height', d => height - scaleY2(d[1]) - 3 * yMargin)
                .attr('y', d => scaleY2(d[1]) + yMargin),
                update => update,
                exit => exit
            )

        // CREATE FILTER BOX AND OPTIONS
        let fBox = bg1.append('foreignObject')
            .attr('x', width - 99)
            .attr('y', 1)
            .attr('class', 'filterBox')
            .html(`
                <h5>Filter by:</h5>
                <form>
                <input type="radio" id="editors" name="editors' value="editors">
                
                `);
        //fForm = fBox.append('form')

        return true
    }




    async initialRender(proj) {


        // load and prepare data
        let map_data = await d3.json("assets/data/world_geo.json", d => d);
        let ed_data = await d3.csv("assets/data/cleaned_csv2.csv", d => d);
        let country_conc = {}
        let editor_conc = {}
        ed_data.forEach(d => !(d.country in country_conc) ? country_conc[d.country] = { 'editors': 1 } : country_conc[d.country]['editors'] += 1)
        ed_data.forEach(d => !(d.editor in editor_conc) ? editor_conc[d.editor] = 1 : editor_conc[d.editor] += 1)
        ed_data.forEach(function(x) {
            !country_conc[x.country]['journals'] ? country_conc[x.country]['journals'] = [x.journal] :
                !(x.journal in country_conc[x.country]['journals']) ? country_conc[x.country]['journals'].push(x.journal) :
                false
        })



        let map_countries = []
        map_data.features.forEach(d => {
            map_countries.push(d.properties.geounit)
        })

        map_data.features.map(d => {
            if (country_conc[d.properties.geounit]) {
                d.properties['editor_count'] = country_conc[d.properties.geounit]['editors']
            } else if (d.properties.geounit == 'United States of America') {
                d.properties['editor_count'] = country_conc["United States"]['editors']
            } else if (d.properties.geounit == 'Hong Kong S.A.R.') {
                d.properties['editor_count'] = country_conc["Hong Kong"]['editors']
            } else if (d.properties.geounit == 'Ivory Coast') {
                d.properties['editor_count'] = country_conc["Republic of Côte d'Ivoire"]['editors']
            } else if (d.properties.geounit == 'Syria') {
                d.properties['editor_count'] = country_conc["Syrian Arab Republic"]['editors']
            } else if (d.properties.geounit == 'South Korea') {
                d.properties['editor_count'] = country_conc["Korea"]['editors']
            } else if (d.properties.geounit == 'Guinea Bissau') {
                d.properties['editor_count'] = country_conc["Guinea-Bissau"]['editors']
            } else if (d.properties.geounit == 'The Bahamas') {
                d.properties['editor_count'] = country_conc["Bahamas"]['editors']
            } else if (d.properties.geounit == 'Macao S.A.R') {
                d.properties['editor_count'] = country_conc["Macau"]['editors']
            } else if (d.properties.geounit == 'Republic of Serbia') {
                d.properties['editor_count'] = country_conc["Serbia"]['editors']
            } else if (d.properties.geounit == 'Democratic Republic of the Congo') {
                d.properties['editor_count'] = country_conc["Congo"]['editors']
            } else {
                d.properties['editor_count'] = 'Unknown'
            }
        })

        this.createMap(map_data, proj);
        this.createBarGraphs(country_conc, editor_conc);

    }

}

let geoVis = new visGraphs("geoGraph")
geoVis.initialRender(proj = d3.geoRobinson)