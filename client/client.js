/*global Template, document, Session, Taxonomies*/
Session.set("searchString", "~");
Session.set("selectedNode", "~");
Session.set("nodeConnections", []);
Template.searchBox.events({
    'click #btnSearch': function () {
        'use strict';
        Session.set("searchString", document.getElementById("txtSearch").value);
    }
});
Template.results.searchString = function () {
    'use strict';
    return Session.get("searchString");
};
Template.results.searchMatches = function () {
    'use strict';
    var regex =  new RegExp(Session.get('searchString'), 'i'),
        results = Taxonomies.find({TaxonomyName: regex});
    return results;
};
Template.searchMatch.events({
    'click' : function (template) {
        Session.set("selectedNode", template.currentTarget.childNodes[0].data);
        getNodeConnections();
    }
});
getNodeConnections = function () {
    var pk,
        rtnNodes = [];
    pk = Taxonomies.find({TaxonomyName: Session.get("selectedNode")}).fetch();
    if (pk.length > 0) {
        pk[0].pk_TaxanomyId;
        rtnNodes = Taxonomies.find({FK_ParentId: pk[0].pk_TaxanomyId}).fetch();
    }
    Session.set("nodeConnections", rtnNodes);
    redrawNodeDiagram();
};
redrawNodeDiagram = function () {
    if(Session.get("nodeConnections").length > 0) {
    var graph = new Graph(),
        i = 0,
        nodeConnections = Session.get("nodeConnections"),
        centerNode      = Session.get("selectedNode"),
        graphNodes      = [];
    graphNodes.push(graph.newNode({label: centerNode}));
    for (i = 0; i < nodeConnections.length; i = i + 1) {
        graphNodes.push(graph.newNode({label: nodeConnections[i].TaxonomyName}))
    }
    for (i = 1; i < graphNodes.length; i = i + 1) {
        graph.newEdge(graphNodes[0], graphNodes[i], {color: '#00A0B0'});
    }
    function drawStuff() {
        var springy = jQuery('#springydemo').springy({
            graph: graph,
            nodeSelected: function(node){
                Session.set("selectedNode", node.data.label);
                getNodeConnections();
            }
        });
    }
    drawStuff();
    }
};