class mapGraph {
    // INITIALIZING VARIABLES
    // width/height code from https://stackoverflow.com/questions/44017721/d3-js-v4-9-get-the-calculated-width-of-selected-element
    constructor() {
        this.globe_data = false;
        this.us_data = false;
        this.svg = d3.select("#geoGraph")
        this.width = parseInt(window.getComputedStyle(this.svg.node()).width) // dimension of SVG
        this.height = parseInt(window.getComputedStyle(this.svg.node()).height); // dimension of SVG
        this.xMargin = this.width * 0.05;
        this.yMargin = this.height * 0.05;
        this.projectionList = [
            { name: "Airy’s minimum error", value: d3.geoAiry },
            { name: "Aitoff", value: d3.geoAitoff },
            { name: "AlbersUsa", value: d3.geoAlbersUsa },
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
        ];
    }


    setCounts(data, filter = 'countries', subfilter = 'ed_count') {
        console.log('concentrations loaded')
        this.concentrations = data;
        let countries_info = Object.values(this.concentrations)
        let c_values = countries_info.map(x => x[subfilter])
        this.colorMap = d3.scaleLinear().domain([0, d3.max(c_values)]).range(['#fee0d2', "#de2d26"]);

        let countries = countries_info.map(x => {
            let name = x.country == "Republic of Côte d'Ivoire" ? 'Ivory Coast' :
                x.country == 'United States' ? 'United States of America' :
                x.country == 'Republic of Serbia' ? 'Serbia' :
                x.country == 'Hong Kong' ? 'Hong Kong S.A.R.' :
                x.country
            return name
        })

        this.svg.selectAll("g .country").each((d) => {
                let node = d;
                let name = node.properties.geounit
                let i = countries.indexOf(name)
                node.properties['ed_count'] = c_values[i]
            })
            .style('fill', d => this.colorMap(d.properties.ed_count))
            .attr("data-tippy-content", d => {
                let count = d.properties.editor_count ? d.properties.editor_count : 0
                let html = `<span><b>Country:</b> ${d.properties.geounit? d.properties.geounit: d.properties.NAME}</span><br><span><b>Editor Count:</b> ${Number.isFinite(d.properties.ed_count) == false? d.properties.ed_count : d.properties.ed_count.toLocaleString()}</span>`
                return html
            })
            .call(selection => tippy(selection.nodes(), { allowHTML: true, followCursor: 'initial', delay: 150 }))

        return this
    }

    initializeMap(worldData, usData, proj, scope) {

        this.globe_data = worldData;
        this.us_data = usData;
        this.proj = proj;
        this.scope = scope;

        this.createProjection();
        this.buildProjectionForm();
        this.drawMap();
        this.setListeners();
    }

    buildProjectionForm() {
        let projectionForm = d3.select("#projection-select");
        projectionForm.selectAll('.projection').data(this.projectionList, d => d)
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
    }

    setListeners() {
        let projectionFilter = d3.select('#projection-select')
        let scopeFilter = d3.select("#scope-select")
        scopeFilter.on('change', (event) => mapVis.updateProjection(false, usData, us = event.target.value, proj, update = true))
        projectionFilter.on('change', (event) => mapVis.updateProjection(event.target.value))
    }

    // scaling inspired by https://observablehq.com/@d3/projection-comparison
    createProjection() {
        this.projection = this.proj().translate([this.width / 2, this.height / 2]);
        this.projection.scale(this.projection.scale() * (300) / 500);
        this.path = d3.geoPath().projection(this.projection);
    }

    updateProjection(proj) {
        this.proj = this.projectionList.filter(x => x.name == proj)[0].value;
        this.createProjection();
        this.svg.selectAll('g').remove();
        this.drawMap();
        // this.render(proj == 'AlbersUsa' ? true : false);
    }

    drawMap() {

        let selected_countries = [];

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
                .remove()
                .append('clipPath')
                .attr('id', 'clippath')
                .append('path')
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
                .style("fill", "#deebf7")
                .style("stroke", "gray")
                .style("stroke-width", 1.5)
                .attr("d", this.path),
                update => update
                .remove()
                .append('path')
                .attr("class", "border")
                .style("fill", "#deebf7")
                .style("stroke", "gray")
                .style("stroke-width", 1.5)
                .attr("d", this.path),
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
                .remove()
                .append("path")
                .attr("d", this.path)
                .attr('clip-path', 'url(#clippath)'),
                exit => exit
                .remove());

        // draw countries
        this.svg.append("g")
            .selectAll("path")
            .attr('id', 'countries')
            .data(this.scope == 'globe' ? this.globe_data.features : this.us_data.features, d => this.scope == 'globe' ? d.properties.geounit : d.properties.NAME)
            .join(
                enter => enter
                .append("path")
                .attr("country", d => `${this.scope == 'globe'? d.properties.geounit: d.properties.NAME}`)
                .attr('clip-path', 'url(#clippath)')
                .attr('class', 'country')
                .attr("d", this.path),
                update => update
                .remove()
                .append("path")
                .attr("class", "country")
                .attr("country", d => `${this.scope == 'globe'? d.properties.geounit: d.properties.NAME}`)
                .attr('clip-path', 'url(#clippath)')
                .attr("d", this.path),
                exit => exit
                .remove())
            .on('click', clicked);

        function clicked(e, d) {
            let sel = d3.select(e.target);
            let countries = d3.select("#geoGraph");
            let selected_list = d3.select('#selected_nodes');

            if (sel.classed('clicked') == false) {
                sel.classed('clicked', true).classed('not-clicked', false)
                selected_list.append('button').classed('country-btn', true).attr('id', `${d.properties.geounit}-button`).text(d.properties.geounit)
                selected_countries.push(d.properties.geounit == 'United States of America' ? 'United States' : d.properties.geounit)
                countries.selectAll('.country:not(.clicked)').classed('not-clicked', true);


                barVisL.updateScope(selected_countries, 'institution');
                barVisR.updateScope(selected_countries, 'editor');


                netVis.highlightNodes(selected_countries, false);

            } else {
                if (countries.selectAll('.clicked').nodes().length == 0) {
                    countries.selectAll('.not-clicked').classed('not-clicked', false)
                    selected_list.selectAll('.country-btn').remove()

                    barVisL.chart.selectAll("*").remove().transition().delay(100).duration(800);
                    barVisL.create_aggs(barVisL.country_data, false).render();

                    barVisR.chart.selectAll("*").remove().transition().delay(100).duration(800);
                    barVisR.create_aggs(barVisR.ed_data, false).render();



                    netVis.highlightNodes(selected_countries, true);
                } else {
                    sel.classed('clicked', false).classed('not-clicked', true);
                    d3.select(`button#${d.properties.geounit}-button`).remove();
                    let index = selected_countries.indexOf(d.properties.geounit == 'United States of America' ? 'United States' : d.properties.geounit)
                    selected_countries.splice(index, 1)
                    barVisL.updateScope(selected_countries, 'institution');
                    barVisR.updateScope(selected_countries, 'editor');
                    netVis.highlightNodes(selected_countries, false);

                }
            }


        }

    }

    async loadData(data) {
        this.largeData = data;


    }


}