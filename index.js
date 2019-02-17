
 //constructTree('[S [NP [DET The][N koala]][VP [V ran][PP [P to][NP [DET the][N store]]]]]', '[', ']', head)
var clusterLayout = d3.cluster()
  .size([400, 200])

var root = d3.hierarchy(head)

clusterLayout(root)

// Nodes
d3.select('svg g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 4);

// Links
d3.select('svg g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;});
