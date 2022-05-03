class handler {

    constructor() {}

    async loadData() {
        console.log('test 1')
        Promise.all([
            d3.json("assets/data/world_geo.json"),
            d3.json("assets/data/us-states.json")
        ]).then(r => {
            console.log('test 2')
            mapVis.initializeMap(r[0], r[1], d3.geoRobinson, 'globe');
        })
        console.log('test 3')
            // d3.json("assets/data/country_concentrations.json").then(r => {
            //     let concs = r
            //     setTimeout(
            //         () => {
            //             console.log('test 4')

        //             d3.csv("assets/data/cleaned_csv2.csv").then(r => {
        //                 mapVis.loadData(r);
        //                 mapVis.setCounts(concs);
        //             })
        //         },
        //         "1"
        //     );
        //     d3.json('assets/data/ed_concentrations.json').then(r2 => {
        //         barVisL.ed_data = r2;
        //         barVisR.ed_data = r2;
        //         barVisL.create_attrs(r, 'country', 'ed_count').render();
        //         barVisR.create_attrs(r, 'editor', 'journal_count').render();
        //     })
        //     d3.json('assets/data/institution_concentrations.json').then(r => {
        //         barVisL.inst_data = r;
        //         barVisR.inst_data = r;
        //         d3.json('assets/data/subcountry_concentrations.json').then(r => {
        //             barVisL.inst_data = r;
        //             barVisR.inst_data = r;
        //         })
        //     })
        // });

        // d3.json('assets/data/network_data.json').then(r => {
        //     netVis.initialRender(r, 'countries')
        // })


    }

    async build() {


        this.mapVis = new mapGraph
        this.mapVis.beginRender()



        Promise.all([
                d3.json("assets/data/us-states.json"),
                d3.json("assets/data/world_geo.json")
            ])
            .then(d => startMap(d))

        d3.json('assets/data/concentrations.json').then(d => loadCounts(d))


        function startMap(data) {

            console.log(data)
                // let usMap = data[0]
                // let worldMap = data[1]
                // this.mapVis = new mapGraph(worldMap, usMap);
                // this.createProjectionOptions(this.mapVis.projections)
                // this.mapVis.setProjection(d3.geoRobinson)
                // this.mapVis.setColorMap(140000, ['f2f2f2', '#467aaa'])
                // this.mapVis.setListener()
                // return this
        }

        function loadCounts(data) {
            console.log(data)
                //const concentrations = data
        }


    }

    async lazyLoad() {
        this.usData = d3.json("assets/data/us-states.json", d => d)
        this.globeData = await d3.json("assets/data/world_geo.json", d => d);
        return this
    }

    async loadNetworkData() {
        this.networkData = await d3.json("assets/data/pred_node_data.json", d => d)
        return this
    }
    async loadLargeData() {
        this.editorData = await d3.csv("assets/data/cleaned_csv2.csv", d => d);
        return this
    }

    async computeConcentrations() {
        this.countryConcentration = {}
        this.editorConcentration = {}
        this.editorData.forEach(d => !(d.country in this.countryConcentration) ? this.countryConcentration[d.country] = { 'editors': 1 } : this.countryConcentration[d.country]['editors'] += 1)
        this.editorData.forEach(d => {
            if (!this.countryConcentration[d.country]['journals']) {
                this.countryConcentration[d.country]['journals'] = [d.journal];
                this.countryConcentration[d.country]['journal_count'] = 1;
            } else if (!this.countryConcentration[d.country]['journals'].includes(d.journal)) {
                this.countryConcentration[d.country]['journals'].push(d.journal);
                this.countryConcentration[d.country]['journal_count'] += 1;
            } else {
                return
            }

        })

        this.editorData.forEach(d => !(d.editor in this.editorConcentration) ? this.editorConcentration[d.editor] = { 'positions': 1 } : this.editorConcentration[d.editor]['positions'] += 1)
        this.globeData.features.map(d => {
            if (this.countryConcentration[d.properties.geounit]) {
                d.properties['editor_count'] = this.countryConcentration[d.properties.geounit]['editors']
            } else if (d.properties.geounit == 'United States of America') {
                d.properties['editor_count'] = this.countryConcentration["United States"]['editors']
            } else if (d.properties.geounit == 'Hong Kong S.A.R.') {
                d.properties['editor_count'] = this.countryConcentration["Hong Kong"]['editors']
            } else if (d.properties.geounit == 'Ivory Coast') {
                d.properties['editor_count'] = this.countryConcentration["Republic of Côte d'Ivoire"]['editors']
            } else if (d.properties.geounit == 'Syria') {
                d.properties['editor_count'] = this.countryConcentration["Syrian Arab Republic"]['editors']
            } else if (d.properties.geounit == 'South Korea') {
                d.properties['editor_count'] = this.countryConcentration["Korea"]['editors']
            } else if (d.properties.geounit == 'Guinea Bissau') {
                d.properties['editor_count'] = this.countryConcentration["Guinea-Bissau"]['editors']
            } else if (d.properties.geounit == 'The Bahamas') {
                d.properties['editor_count'] = this.countryConcentration["Bahamas"]['editors']
            } else if (d.properties.geounit == 'Macao S.A.R') {
                d.properties['editor_count'] = this.countryConcentration["Macau"]['editors']
            } else if (d.properties.geounit == 'Republic of Serbia') {
                d.properties['editor_count'] = this.countryConcentration["Serbia"]['editors']
            } else if (d.properties.geounit == 'Democratic Republic of the Congo') {
                d.properties['editor_count'] = this.countryConcentration["Congo"]['editors']
            } else {
                d.properties['editor_count'] = 'Unknown'
            }
        })
    }

    async createProjectionOptions(projections) {
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
    }

}