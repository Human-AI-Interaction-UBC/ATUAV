// This is the main DLL file.
#include "stdafx.h"
#include "Emdat.h"
using namespace std;
using namespace System;

// EmdatModule

// converts from String^ to std::string
void Emdat::EmdatModule::MarshalString(String ^s, string &os) {
	using namespace System::Runtime::InteropServices;
	const char *chars = (const char*)(Marshal::StringToHGlobalAnsi(s)).ToPointer();
	os = chars;
	Marshal::FreeHGlobal(IntPtr((void*)chars));
}

// generates features from gaze points, fixations and AOIs
// 
// segment_id: name for segment
// raw_gaze_points: gaze point data formatted like lines from a Tobii all data export
// raw_fixations: fixations formatted like lines from a Tobii fixation export
// raw_aois: aoi definitions
//
// returns: line deliminated features with format "feature=value" (without quotes)
String^ Emdat::EmdatModule::GenerateFeatures(String ^segment_id, String ^raw_gaze_points, String ^raw_fixations, String ^raw_aois) {
	// convert String^ to std::string
	string seg_id, gazes, fixes, aois;
	MarshalString(segment_id, seg_id);
	MarshalString(raw_gaze_points, gazes);
	MarshalString(raw_fixations, fixes);
	MarshalString(raw_aois, aois);

	// call unmanaged emdat
	string result = emdat->generate_features(seg_id, gazes, fixes, aois);

	// convert std::string to String^
	return gcnew String(result.c_str());
}

// UnmanagedEmdatModule

const char *Emdat::UnmanagedEmdatModule::EMDAT = "emdat";
const char *Emdat::UnmanagedEmdatModule::GENERATE_FEATURES = "generate_features";

// initializes python engine and imports emdat module and generate features function
Emdat::UnmanagedEmdatModule::UnmanagedEmdatModule() {
	Py_Initialize();

	// import module
	PyObject *emdat = PyString_FromString(EMDAT);
	emdat_module = PyImport_Import(emdat);
	if (emdat_module) {
		// import function
		generate_features_function = PyObject_GetAttrString(emdat_module, GENERATE_FEATURES);
		if (!generate_features_function || !PyCallable_Check(generate_features_function)) {
			fprintf(stderr, "Cannot find function \"%s\"\n", GENERATE_FEATURES);
		}
	} else {
		PyErr_Print();
		fprintf(stderr, "Failed to load \"%s\"\n", EMDAT);
	}
}

// destroys generate_features function, emdat module, and python engine
Emdat::UnmanagedEmdatModule::~UnmanagedEmdatModule() {
	Py_XDECREF(generate_features_function);
	Py_DECREF(emdat_module);
	Py_Finalize();
}

// generates features from gaze points, fixations and AOIs
// 
// segment_id: name for segment
// raw_gaze_points: gaze point data formatted like lines from a Tobii all data export
// raw_fixations: fixations formatted like lines from a Tobii fixation export
// aoi_path: AOI definitions
//
// returns: line deliminated features with format "feature=value" (without quotes)
string Emdat::UnmanagedEmdatModule::generate_features(string segment_id, string raw_gaze_points, string raw_fixations, string raw_aois) {
	// build arguments
	PyObject *arguments = PyTuple_New(4);
	PyTuple_SetItem(arguments, 0, PyString_FromString(segment_id.c_str()));
	PyTuple_SetItem(arguments, 1, PyString_FromString(raw_gaze_points.c_str()));
	PyTuple_SetItem(arguments, 2, PyString_FromString(raw_fixations.c_str()));
	PyTuple_SetItem(arguments, 3, PyString_FromString(raw_aois.c_str()));

	// call python function
	PyObject *value = PyObject_CallObject(generate_features_function, arguments);
	Py_DECREF(arguments);

	// parse return value
	string features = PyString_AsString(value);
	Py_DECREF(value);
	return features;
}