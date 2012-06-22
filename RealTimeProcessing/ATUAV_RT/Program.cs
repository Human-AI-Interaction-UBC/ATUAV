using System;
using System.Collections.Generic;
using System.Threading;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Processes ATUAV eyetracking data in real-time.
    /// 
    /// Requires:
    /// - Tobii SDK 3.0 RC 1 http://www.tobii.com/en/eye-tracking-research/global/landingpages/analysis-sdk-30rc/
    /// - FixDet http://www.sis.uta.fi/~csolsp/projects.php
    /// </summary>
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
            connector.Eyetracker.GazeDataReceived += fixations.GazeDataReceived;

            /*/ print each event to console
            GazeDataConsolePrintHandler printer = new GazeDataConsolePrintHandler(syncManager);
            //connector.Eyetracker.GazeDataReceived += printer.GazeDataReceived;
            fixations.FixationDetector.FixationEnd += printer.FixationEnd;*/

            // windowed print to console
            GazeDataWindowingPrintHandler printer = new GazeDataWindowingPrintHandler(syncManager);
            //connector.Eyetracker.GazeDataReceived += printer.GazeDataReceived;
            fixations.FixationDetector.FixationEnd += printer.FixationEnd;
            printer.StartWindow();

            while (true)
            {
                Thread.Sleep(3000);
                printer.RenewWindow(true);
            }
        }
    }
}
