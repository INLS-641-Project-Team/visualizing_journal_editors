// const pageHandler = new handler;

// pageHandler.barVis1, pageHandler.barVis2 = pageHandler.loadLargeData(this).then(r => {
//     r.computeConcentrations();
//     r.mapVis.render()
//     r.barVis1 = new barGraph(r.countryConcentration, '#bar_1', 'editors')
//     r.barVis1.render()
//         //barGraph1.setListener()
//     r.barVis2 = new barGraph(r.editorConcentration, '#bar_2', 'positions')
//     r.barVis2.render()
//         //barGraph2.setListener()
//     return r.barVis1, r.Barvis2
// })

const main = new handler
const mapVis = new mapGraph
const netVis = new networkGraph
const barVisL = new barGraph('bar1')
const barVisR = new barGraph('bar2')

main.loadData()

//mapVis.beginRender(false, d3.geoRobinson);
//netVis.render();


// add red circle to determine the center of the network svg