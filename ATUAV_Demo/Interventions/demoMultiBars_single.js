// This file contains examples of custom scripts.
// All general-purpose library code should be in multiBars.js.

// Draw four graphs
var graph =  new DataGraph("data", "infovis", "intervention", "colorFamily");

// Set all interventions to off
var condition = new Array;
for (var i = 0; i < 8; i++) {
	condition[i] = false;
}

// Calculate pair groups
function mergePairGroups(seriesValuePairGroups) {
	var mergedGroup = new Array;
	for (i = 0; i < seriesValuePairGroups.length; i++) { // merge all the groups into one group
		for (j = 0; j < seriesValuePairGroups[i].length; j++) {
			mergedGroup.push(seriesValuePairGroups[i][j]);
		}
	}
	return mergedGroup;
}


// De-emph trigger
function triggerA() {
	var mergedGroup = mergePairGroups(graph.seriesValuePairGroups);
	selectedBars = graph.selectInverseBars(mergedGroup);
	if (condition[0]) {
		graph.undoDeEmph();
		condition[0] = false;
	}
	else {
		graph.deEmphRest(selectedBars);
		condition[0] = true;
	}
}

function triggerB() {
	var mergedGroup = mergePairGroups(graph.seriesValuePairGroups);
	selectedBars = getSelectedBars("infovis", mergedGroup);

	if (condition[1]) {
		graph.undoBolding(selectedBars);
		condition[1] = false;
	}
	else {
		graph.bolding(selectedBars);
		condition[1] = true;
	}

}

function triggerC() {
	if (condition[2]) {
		graph.undoArrows(1);
		condition[2] = false;
	} else {		
		for (var i = 0; i < graph.seriesValuePairGroups.length; i++) {
			selectedJBars = getSelectedJBars("infovis", graph.seriesValuePairGroups[i]);
			graph.drawArrowLineRelative(selectedJBars, 1);
		}
		condition[2] = true;
	}
}

function triggerD() {
	if (condition[3]) {
		graph.undoReferenceLine();
		condition[3] = false;
	} else {
		for (i = 0; i < graph.seriesValuePairGroups.length; i++) {
			selectedBars = graph.seriesValuePairGroups[i];
			graph.drawReferenceLine(selectedBars);
		}
		condition[3] = true;
	}
}

function triggerE() {
	if (condition[4]) {
		graph.undoDrawBlock();
		condition[4] = false;
	} else {
		graph.drawBlock(50, 100, "grey");
		condition[4] = true;
	}
}

function triggerF() {
	if (condition[5]) {
		graph.undoGrid();
		condition[5] = false;
	} else {
		graph.drawGrid(20);
		condition[5] = true;
	}
}

function triggerG() {
	if (condition[6]) {
		graph.undoBoldLegend(["Class_Average", "Steve", "Spencer"]);
		condition[6] = false;
	} else {
		graph.boldLegend(["Class_Average", "Steve", "Spencer"]);
		condition[6] = true;
	}
}

function triggerH() {
	var mergedGroup = mergePairGroups(graph.seriesValuePairGroups);
	selectedBars = getSelectedBars("infovis", mergedGroup);
	
	if (condition[7]) {
		graph.undoShowValue();
		condition[7] = false;
	} else {
		graph.showValue(selectedBars);
		condition[7] = true;
	}
}