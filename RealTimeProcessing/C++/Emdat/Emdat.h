// Emdat.h
#pragma once
#include <Python.h>
#include <string>
#include <marshal.h>
using namespace std;
using namespace System;

// .../Python26/libs/python26_d.lib (DEBUG version of python)
// the proper solution is probably to install debug python from source
// but the quick solution (which I used) is to disable python debugging
// and use .../Python26/libs/python26.lib
// To do this .../Python26/include/pyconfig.h must be changed
// search for _DEBUG, there should be 2 instances, for these 2 instances
// make sure: 
// 1) python26.lib is used in place of python26_d.lib
// 2) Py_DEBUG is not defined
namespace Emdat {
	// calls EMDAT python library
	class UnmanagedEmdatModule {
		static const char *EMDAT;
		static const char *GENERATE_FEATURES;
		PyObject *emdat_module;
		PyObject *generate_features_function;
	public:
		UnmanagedEmdatModule();
		~UnmanagedEmdatModule();
		string generate_features(string, string, string, string);
	};

	// calls unmanaged C++ code
	public ref class EmdatModule {
	private:
		UnmanagedEmdatModule *emdat;
		void MarshalString(String^,string&);
	public:
		EmdatModule() { emdat = new UnmanagedEmdatModule(); }
		~EmdatModule() { delete emdat; }
		String^ GenerateFeatures(String^, String^, String^, String^);
	};
}