// This file contains examples of custom scripts.
// All general-purpose library code should be in multiBars.js.

// Draw four graphs
var graph = new Array;
for (var i = 0; i < 7; i++) {
	graph[i] = new DataGraph("data", "infovis"+(i+1), "intervention", "colorFamily");
}
graph[7] = new DataGraph("smallData", "infovis8", "smallIntervention", "colorFamily");

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
	var mergedGroup = mergePairGroups(graph[0].seriesValuePairGroups);
	selectedBars = getSelectedBars("infovis1", mergedGroup);
	if (condition[0]) {
		graph[0].undoDeEmph();
		condition[0] = false;
	}
	else {
		graph[0].deEmphRest(selectedBars);
		condition[0] = true;
	}
}

function triggerB() {
	var mergedGroup = mergePairGroups(graph[1].seriesValuePairGroups);
	selectedBars = getSelectedBars("infovis2", mergedGroup);

	if (condition[1]) {
		graph[1].undoBolding(selectedBars);
		condition[1] = false;
	}
	else {
		graph[1].bolding(selectedBars);
		condition[1] = true;
	}

}

function triggerC() {
	if (condition[2]) {
		graph[2].undoArrows(1);
		condition[2] = false;
	} else {		
		for (var i = 0; i < graph[2].seriesValuePairGroups.length; i++) {
			selectedJBars = getSelectedJBars("infovis3", graph[2].seriesValuePairGroups[i]);
			graph[2].drawArrowLineRelative(selectedJBars, 1);
		}
		condition[2] = true;
	}
}

function triggerD() {
	if (condition[3]) {
		graph[3].undoReferenceLine();
		condition[3] = false;
	} else {
		for (i = 0; i < graph[3].seriesValuePairGroups.length; i++) {
			selectedBars = graph[3].seriesValuePairGroups[i];
			graph[3].drawReferenceLine(selectedBars);
		}
		condition[3] = true;
	}
}

function triggerE() {
	if (condition[4]) {
		graph[4].undoDrawBlock();
		condition[4] = false;
	} else {
		graph[4].drawBlock(50, 100, "grey");
		condition[4] = true;
	}
}

function triggerF() {
	if (condition[5]) {
		graph[5].undoGrid();
		condition[5] = false;
	} else {
		graph[5].drawGrid(20);
		condition[5] = true;
	}
}

function triggerG() {
	if (condition[6]) {
		graph[6].undoBoldLegend(["Class_Average", "Mark", "Spencer"]);
		condition[6] = false;
	} else {
		graph[6].boldLegend(["Class_Average", "Mark", "Spencer"]);
		condition[6] = true;
	}
}

function triggerH() {
	var mergedGroup = mergePairGroups(graph[7].seriesValuePairGroups);
	selectedBars = getSelectedBars("infovis8", mergedGroup);
	
	if (condition[7]) {
		graph[7].undoShowValue();
		condition[7] = false;
	} else {
		graph[7].showValue(selectedBars);
		condition[7] = true;
	}
}