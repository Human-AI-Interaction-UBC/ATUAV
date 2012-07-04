// Emdat.h
#pragma once
#include <Python.h>
#include <string>
#include <marshal.h>
using namespace std;
using namespace System;

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