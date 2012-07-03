#include <Python.h>
#include <string>
using namespace std;

class EMDAT {
        string EMDAT;
        string GENERATE_FEATURES;
        PyObject emdat_module;
        PyObject generate_features_function;
    public:
        string generate_features(string, string, string, string)
};

string EMDAT;
string GENERATE_FEATURES;
PyObject emdat_module;
PyObject generate_features_function;

// initializes python engine, emdat module, and generate_features function
EMDAT::EMDAT() {
    EMDAT = "emdat";
    GENERATE_FEATURES = "generate_features";
    Py_Initialize();

    // import module
    emdat_module = PyImport_Import(EMDAT);
    if (module != NULL) {
        // import function
        generate_features_function = PyObject_GetAttrString(module, GENERATE_FEATURES);
        if (!generate_features_function || PyCallable_Check(generate_features_function)) {
            fprintf(stderr, "Cannot find function \"%s\"\n", GENERATE_FEATURES);
        }
    }
    else {
        PyErr_Print();
        fprintf(stderr, "Failed to load \"%s\"\n", EMDAT);
    }
}

// destroys generate_features function, emdat module, and python engine
EMDAT::~EMDAT() {
    Py_XDECREF(generate_features_function);
    Py_DECREF(emdat_module);
    Py_Finalize();
}

// generates features from gaze points, fixations and AOIs
// 
// segment_id: name for segment
// raw_gaze_points: gaze point data formatted like lines from a Tobii all data export
// raw_fixations: fixations formatted like lines from a Tobii fixation export
// aoi_path: file path to AOI definitions file TODO eliminate IO bound by reading file only the first time
//
// returns: line deliminated features with format "feature=value" (without quotes)
string EMDAT::generate_features(string segment_id, string raw_gaze_points, string raw_fixations, string aoi_path) {
    // build arguments
    PyObject arguments = PyTuple_New(4);
    PyTuple_SetItem(arguments, 0, PyString_FromString(segment_id));
    PyTuple_SetItem(arguments, 1, PyString_FromString(raw_gaze_points));
    PyTuple_SetItem(arguments, 2, PyString_FromString(raw_fixations));
    PyTuple_SetItem(arguments, 3, PyString_FromString(aoi_path));

    // call python function
    PyObject value = PyObject_CallObject(generate_features_function, arguments);
    Py_DECREF(arguments);

    // parse return value
    string features = PyString_AsString(value);
    Py_DECREF(value);
    return features;
}
