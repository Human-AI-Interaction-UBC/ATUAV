using System;
using System.Collections.Generic;
using System.Threading;
using NDesk.Options;
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
    /// - NDesk.Options http://www.ndesk.org/Options
    /// </summary>
    class Program
    {
        private static Clock clock;
        private static int windowDuration = 3000; // ms
        private static bool cumulativeWindows = false;
        private static bool help = false;

        /// <summary>
        /// Parses arguments and finds connected Eyetrackers.
        /// </summary>
        /// <param name="args">Command line arguments</param>
        static void Main(string[] args)
        {
            Library.Init();
            clock = new Clock();

            // parse arguments
            var p = new OptionSet()
            {
                { "c|cumulative", "windows collect data cumulatively", v => cumulativeWindows = v != null},
                { "w|window=", "the {DURATION} of a window in ms (default=" + windowDuration + ")", (int v) => windowDuration = v },
                { "h|help", v => help = v != null }
            };

            try
            {
                List<string> extra = p.Parse(args);
                if (extra.Count > 0)
                {
                    throw new OptionException("Unknown arguments.", "");
                }
            }
            catch (OptionException e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("Try \'atuavrt --help\' for more information.");
                Console.WriteLine();
                return;
            }

            if (help)
            {
                ShowHelp(p);
                return;
            }

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

        /// <summary>
        /// Writes usage to console.
        /// </summary>
        /// <param name="options">Parsed command line arguments</param>
        static void ShowHelp(OptionSet options)
        {
            Console.WriteLine("Usage: atuav_rt [OPTIONS]");
            Console.WriteLine("Process eyetracking data in real time");
            Console.WriteLine();
            Console.WriteLine("Options:");
            options.WriteOptionDescriptions(Console.Out);
        }

        /// <summary>
        /// Connects to found eyetrackers, synchronizes CPU and eyetracker clocks, and attaches event handlers.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains found EyetrackerInfo</param>
        static void EyetrackerFound(object sender, EyetrackerInfoEventArgs e)
        {
            EyetrackerConnector connector = new EyetrackerConnector(e.EyetrackerInfo);
            connector.Connect();

            // sync CPU and Eyetracker clocks
            SyncManager syncManager = new SyncManager(clock, e.EyetrackerInfo, EventThreadingOptions.BackgroundThread);
            
            // detect fixations
            FixationDetector fixations = new FixationDetector(syncManager);
            connector.Eyetracker.GazeDataReceived += fixations.GazeDataReceived;

            // print each event to console
            ConsolePrinter printer = new ConsolePrinter(syncManager);
            //connector.Eyetracker.GazeDataReceived += printer.GazeDataReceived;
            fixations.FixDetector.FixationEnd += printer.FixationEnd;

            /*/ windowed print to console
            WindowingConsolePrinter printer = new WindowingConsolePrinter(syncManager);
            //connector.Eyetracker.GazeDataReceived += printer.GazeDataReceived;
            fixations.FixDetector.FixationEnd += printer.FixationEnd;
            printer.StartWindow();

            while (true)
            {
                Thread.Sleep(windowDuration);
                printer.ProcessWindow(cumulativeWindows);
            }*/
        }
    }
}
