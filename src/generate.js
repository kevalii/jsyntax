var d3 = require('d3')

/*******************************************************************************
                              For generating SVGs
   Much of this code was adapted from https://blockbuilder.org/d3noob/8326869

   Because this code is derived from a rather simple example, it lacks scaling.
   At the moment, it is possible for the text of different nodes to overlap, but
   only in rather extreme cases.
*******************************************************************************/

/*******************************************************************************
                                     update
    Produces a visualization of the tree given the head of a well-formed tree
*******************************************************************************/

function update(source) {
    var i = 0;

    // Compute the new tree layout
    var root = d3.hierarchy(source.children[0])
    let bounds = d3.selection()._groups[0][0].getBoundingClientRect()
    console.log(d3.selection()._groups[0][0].clientWidth)
    // Set properties of SVG element; should be adjusted for scalability
    let width = bounds.width,
    	  height = bounds.height ;

    var tree = d3.tree()
    	.size([width, height]).separation(function separation(a, b) {
            return a.parent == b.parent ? 2 : 1;
        });;

    // Initialize SVG element on page
    var svg = d3.select("body").append("svg")
    	.attr("viewBox", `-30 -30 ${1.2 * width} ${width}`)
      .attr("preserveAspectRatio", "none")
      .attr("position", "absolute")
        .append("g")
    	//.attr("transform", "translate(" + (margin.left + width/2) + "," + margin.top + ")");

    var nodes = tree(root).descendants(), links = tree(root).links();
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 100; });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });

    nodeEnter.append("text")
        .attr("y", function(d) {
        return d.children || d._children ? -18 : 18; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return `${d.data.name}  ${(d.data.category === undefined ? '' : '(' + d.data.category + ')')}`; })
        .style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("line", "g")
        .attr("class", "link")
        .attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y - 30;});

    console.log(tree(root).data)
    console.log(links)
}

export {update} ;
