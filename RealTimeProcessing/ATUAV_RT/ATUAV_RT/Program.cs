using System;
using System.Collections.Generic;
using System.Threading;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    class Program
    {
        private static Clock clock;

        static void Main(string[] args)
        {
            Library.Init();
            clock = new Clock();

            // find eyetrackers on LAN
            EyetrackerBrowser browser = new EyetrackerBrowser(EventThreadingOptions.BackgroundThread);
            browser.EyetrackerFound += EyetrackerFound;
            browser.Start();

            // keep main thread running
            // (all events happen in background thread)
            while (true)
            {
                Thread.Sleep(1000000);
            }
        }

        static void EyetrackerFound(object sender, EyetrackerInfoEventArgs e)
        {
            EyetrackerConnector connector = new EyetrackerConnector(e.EyetrackerInfo);
            connector.Connect();

            // sync CPU and Eyetracker clocks
            SyncManager syncManager = new SyncManager(clock, e.EyetrackerInfo, EventThreadingOptions.BackgroundThread);
            
            // detect fixations
            GazeDataFixationHandler fixations = new GazeDataFixationHandler(syncManager);
            connector.AddGazeDataHandler(fixations.GazeDataReceived);

            // print to console
            GazeDataConsolePrintHandler printer = new GazeDataConsolePrintHandler(syncManager);
            //connector.AddGazeDataHandler(printer.GazeDataReceived);
            fixations.FixationDetector.FixationEnd += printer.FixationEnd;
        }
    }
}
